import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;

const PLANS: Record<string, { priceId: string; name: string }> = {
  creator_plus: {
    priceId: process.env.STRIPE_PRICE_CREATOR_PLUS || "",
    name: "Creator Plus",
  },
  shop_pro: {
    priceId: process.env.STRIPE_PRICE_SHOP_PRO || "",
    name: "Shop Pro",
  },
  shop_featured: {
    priceId: process.env.STRIPE_PRICE_SHOP_FEATURED || "",
    name: "Shop Featured",
  },
};

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { plan } = await req.json();
    const planInfo = PLANS[plan];
    if (!planInfo || !planInfo.priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Create Stripe Checkout Session
    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("success_url", "https://whipspec.com/dashboard?subscription=success");
    params.set("cancel_url", "https://whipspec.com/pricing?cancelled=1");
    params.set("customer_email", payload.email);
    params.set("line_items[0][price]", planInfo.priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("metadata[user_id]", String(payload.userId));
    params.set("metadata[plan]", plan);

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await response.json();

    if (session.error) {
      return NextResponse.json({ error: session.error.message }, { status: 400 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
