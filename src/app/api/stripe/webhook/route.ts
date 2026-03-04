import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  try {
    const body = await req.text();
    // In production, verify webhook signature with stripe-signature header
    // For now, process the event
    const event = JSON.parse(body);

    const sql = getSql();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const plan = session.metadata?.plan;
        const stripeCustomerId = session.customer;
        const subscriptionId = session.subscription;

        if (userId) {
          await sql`
            UPDATE users SET
              account_type = 'shop_pro',
              updated_at = NOW()
            WHERE id = ${parseInt(userId)}
          `;

          // Add subscription columns if they exist
          try {
            await sql`
              ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255);
              ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255);
              ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_plan VARCHAR(50);
              ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'inactive';
            `;
            await sql`
              UPDATE users SET
                stripe_customer_id = ${stripeCustomerId},
                stripe_subscription_id = ${subscriptionId},
                subscription_plan = ${plan},
                subscription_status = 'active'
              WHERE id = ${parseInt(userId)}
            `;
          } catch { /* columns may not exist yet */ }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        try {
          await sql`
            UPDATE users SET subscription_status = 'cancelled'
            WHERE stripe_subscription_id = ${sub.id}
          `;
        } catch { /* ignore */ }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        try {
          await sql`
            UPDATE users SET subscription_status = 'past_due'
            WHERE stripe_customer_id = ${invoice.customer}
          `;
        } catch { /* ignore */ }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
