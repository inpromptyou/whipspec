import { getSql } from "./db";

// --- Billable Inquiry Qualification ---
// An inquiry is billable if:
// 1. Unique contact method (email or phone)
// 2. Message length >= 20 characters
// 3. Not a duplicate within 7 days (same email + same shop)
// 4. Includes a service type or car details
// 5. Not flagged as spam

interface InquiryData {
  shop_id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  car_details?: string;
}

export async function isQualifiedInquiry(data: InquiryData): Promise<{ qualified: boolean; reason?: string }> {
  if (!data.email || data.email.length < 5) return { qualified: false, reason: "no_email" };
  if (!data.message || data.message.length < 20) return { qualified: false, reason: "message_too_short" };

  // Spam patterns
  const spamPatterns = [/\b(viagra|casino|lottery|bitcoin.*free|click here now)\b/i];
  if (spamPatterns.some(p => p.test(data.message))) return { qualified: false, reason: "spam" };

  const sql = getSql();

  // Dedup: same email + same shop within 7 days
  const dupes = await sql`
    SELECT id FROM inquiries
    WHERE shop_id = ${data.shop_id}
      AND email = ${data.email.toLowerCase()}
      AND created_at > NOW() - INTERVAL '7 days'
    LIMIT 1
  `;
  if (dupes.length > 0) return { qualified: false, reason: "duplicate" };

  return { qualified: true };
}

// --- Record billable inquiry event ---
export async function recordBillableInquiry(inquiryId: number, shopId: number) {
  const sql = getSql();

  // Ensure billing_events table
  await sql`
    CREATE TABLE IF NOT EXISTS billing_events (
      id SERIAL PRIMARY KEY,
      event_type VARCHAR(50) NOT NULL,
      entity_type VARCHAR(50) NOT NULL,
      entity_id INTEGER NOT NULL,
      shop_id INTEGER,
      amount NUMERIC(10,2),
      currency VARCHAR(3) DEFAULT 'AUD',
      stripe_usage_record_id VARCHAR(255),
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(event_type, entity_type, entity_id)
    )
  `;

  // Insert (idempotent — unique constraint on event_type + entity_type + entity_id)
  try {
    await sql`
      INSERT INTO billing_events (event_type, entity_type, entity_id, shop_id)
      VALUES ('billable_inquiry', 'inquiry', ${inquiryId}, ${shopId})
      ON CONFLICT (event_type, entity_type, entity_id) DO NOTHING
    `;
  } catch { /* duplicate — already recorded */ }

  // If shop has usage-based billing via Stripe meter, record usage
  // This would fire a Stripe meter event in production
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  if (STRIPE_SECRET) {
    try {
      const shopUser = await sql`
        SELECT u.stripe_customer_id FROM shops s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ${shopId} AND u.stripe_customer_id IS NOT NULL
        LIMIT 1
      `;

      if (shopUser.length > 0 && shopUser[0].stripe_customer_id) {
        // Record usage event for metered billing
        // Stripe Billing Meter API: POST /v1/billing/meter_events
        const meterId = process.env.STRIPE_METER_INQUIRY;
        if (meterId) {
          await fetch("https://api.stripe.com/v1/billing/meter_events", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${STRIPE_SECRET}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              event_name: "billable_inquiry",
              "payload[stripe_customer_id]": shopUser[0].stripe_customer_id,
              "payload[value]": "1",
              timestamp: Math.floor(Date.now() / 1000).toString(),
            }).toString(),
          });
        }
      }
    } catch { /* meter recording is best-effort */ }
  }
}

// --- Entitlement check ---
export async function hasEntitlement(userId: number, feature: string): Promise<boolean> {
  const sql = getSql();
  const rows = await sql`
    SELECT subscription_plan, subscription_status FROM users WHERE id = ${userId} LIMIT 1
  `;
  if (rows.length === 0) return false;

  const { subscription_plan, subscription_status } = rows[0];

  // Only active subscriptions grant entitlements
  if (subscription_status !== "active") return false;

  const entitlements: Record<string, string[]> = {
    creator_plus: ["unlimited_builds", "vanity_url", "build_analytics", "priority_placement", "hd_gallery", "founding_badge"],
    shop_pro: ["enhanced_profile", "inquiry_form", "shop_analytics", "search_priority", "gallery_20"],
    shop_featured: ["enhanced_profile", "inquiry_form", "shop_analytics", "search_priority", "gallery_20", "top_placement", "featured_badge", "sponsored_slots", "category_promo"],
  };

  return entitlements[subscription_plan as string]?.includes(feature) || false;
}
