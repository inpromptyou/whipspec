import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// --- Signature verification (HMAC-SHA256, Stripe v1 scheme) ---
function verifyStripeSignature(payload: string, sigHeader: string, secret: string): boolean {
  const parts = sigHeader.split(",").reduce((acc, part) => {
    const [key, val] = part.split("=");
    if (key === "t") acc.timestamp = val;
    if (key === "v1") acc.signatures.push(val);
    return acc;
  }, { timestamp: "", signatures: [] as string[] });

  if (!parts.timestamp || parts.signatures.length === 0) return false;

  // Reject events older than 5 minutes (replay protection)
  const age = Math.floor(Date.now() / 1000) - parseInt(parts.timestamp);
  if (age > 300) return false;

  const signedPayload = `${parts.timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");

  return parts.signatures.some(sig =>
    crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  );
}

// --- Idempotency: processed events table ---
async function ensureWebhookEventsTable(sql: ReturnType<typeof getSql>) {
  await sql`
    CREATE TABLE IF NOT EXISTS stripe_webhook_events (
      event_id VARCHAR(255) PRIMARY KEY,
      event_type VARCHAR(100) NOT NULL,
      processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;
}

async function isAlreadyProcessed(sql: ReturnType<typeof getSql>, eventId: string): Promise<boolean> {
  const rows = await sql`SELECT event_id FROM stripe_webhook_events WHERE event_id = ${eventId}`;
  return rows.length > 0;
}

async function markProcessed(sql: ReturnType<typeof getSql>, eventId: string, eventType: string) {
  await sql`
    INSERT INTO stripe_webhook_events (event_id, event_type) VALUES (${eventId}, ${eventType})
    ON CONFLICT (event_id) DO NOTHING
  `;
}

// --- Plan → entitlement mapping ---
const PLAN_ENTITLEMENTS: Record<string, { accountType: string }> = {
  creator_plus: { accountType: "creator" },
  shop_pro: { accountType: "shop_pro" },
  shop_featured: { accountType: "shop_featured" },
};

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const body = await req.text();
  const sigHeader = req.headers.get("stripe-signature") || "";

  // 1. Verify signature
  if (!verifyStripeSignature(body, sigHeader, WEBHOOK_SECRET)) {
    console.error("[Stripe Webhook] Signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);
  const sql = getSql();

  // 2. Ensure idempotency table exists
  try { await ensureWebhookEventsTable(sql); } catch { /* table may already exist */ }

  // 3. Check idempotency
  if (await isAlreadyProcessed(sql, event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      // --- PROVISION ON PAID (not on checkout.session.completed) ---
      case "invoice.paid": {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          // Fetch subscription metadata from Stripe to get plan + user_id
          const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
          if (STRIPE_SECRET) {
            const subRes = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
              headers: { Authorization: `Bearer ${STRIPE_SECRET}` },
            });
            const sub = await subRes.json();
            const plan = sub.metadata?.plan;
            const userId = sub.metadata?.user_id;

            if (userId && plan) {
              const entitlement = PLAN_ENTITLEMENTS[plan];
              await sql`
                UPDATE users SET
                  stripe_customer_id = ${customerId},
                  stripe_subscription_id = ${subscriptionId},
                  subscription_plan = ${plan},
                  subscription_status = 'active',
                  updated_at = NOW()
                WHERE id = ${parseInt(userId)}
              `;

              // Set account type for shop tiers
              if (entitlement && plan.startsWith("shop")) {
                await sql`
                  UPDATE users SET account_type = ${entitlement.accountType}
                  WHERE id = ${parseInt(userId)}
                `;
              }
            }
          }
        }
        break;
      }

      // Store checkout metadata on subscription for invoice.paid to use
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const subscriptionId = session.subscription;

        // Push metadata to the subscription so invoice.paid can read it
        if (subscriptionId && userId && plan) {
          const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
          if (STRIPE_SECRET) {
            const params = new URLSearchParams();
            params.set("metadata[user_id]", userId);
            params.set("metadata[plan]", plan);
            await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${STRIPE_SECRET}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: params.toString(),
            });
          }
        }
        break;
      }

      // --- REVOKE ON CANCEL ---
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const userId = sub.metadata?.user_id;

        if (userId) {
          await sql`
            UPDATE users SET
              subscription_status = 'cancelled',
              subscription_plan = NULL,
              updated_at = NOW()
            WHERE id = ${parseInt(userId)}
          `;
        } else {
          // Fallback: find by subscription ID
          await sql`
            UPDATE users SET
              subscription_status = 'cancelled',
              subscription_plan = NULL,
              updated_at = NOW()
            WHERE stripe_subscription_id = ${sub.id}
          `;
        }

        // If shop featured, downgrade to shop_pro or creator
        await sql`
          UPDATE users SET account_type = 'creator'
          WHERE stripe_subscription_id = ${sub.id} AND account_type IN ('shop_pro', 'shop_featured')
        `;
        break;
      }

      // --- MARK PAST DUE ---
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await sql`
          UPDATE users SET
            subscription_status = 'past_due',
            updated_at = NOW()
          WHERE stripe_customer_id = ${invoice.customer}
        `;
        break;
      }

      // --- HANDLE SUBSCRIPTION UPDATES (upgrade/downgrade) ---
      case "customer.subscription.updated": {
        const sub = event.data.object;
        const plan = sub.metadata?.plan;
        const userId = sub.metadata?.user_id;
        const status = sub.status; // active, past_due, canceled, etc.

        if (userId) {
          await sql`
            UPDATE users SET
              subscription_status = ${status === "active" ? "active" : status === "past_due" ? "past_due" : status},
              subscription_plan = ${plan || null},
              updated_at = NOW()
            WHERE id = ${parseInt(userId)}
          `;
        }
        break;
      }

      // --- INVOICE FINALIZATION FAILURE ---
      case "invoice.finalization_failed": {
        const invoice = event.data.object;
        console.error(`[Stripe] Invoice finalization failed: ${invoice.id}, error: ${JSON.stringify(invoice.last_finalization_error)}`);
        break;
      }

      // --- DISPUTES ---
      case "charge.dispute.created": {
        const dispute = event.data.object;
        console.error(`[Stripe] DISPUTE CREATED: ${dispute.id}, amount: ${dispute.amount}, reason: ${dispute.reason}`);
        // TODO: send admin notification
        break;
      }
    }

    // 4. Mark as processed
    await markProcessed(sql, event.id, event.type);

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook processing failed";
    console.error(`[Stripe Webhook] Error processing ${event.type}: ${msg}`);
    // Return 200 to prevent Stripe retries on our errors (we logged it)
    return NextResponse.json({ received: true, error: msg });
  }
}
