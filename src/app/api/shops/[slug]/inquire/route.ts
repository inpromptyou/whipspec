import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const sql = getSql();

    const shops = await sql`SELECT id FROM shops WHERE slug = ${slug}`;
    if (shops.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const { name, email, phone, car_details, message, budget } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    await sql`
      INSERT INTO inquiries (shop_id, name, email, phone, car_details, message, budget)
      VALUES (${shops[0].id}, ${name}, ${email}, ${phone || null}, ${car_details || null}, ${message}, ${budget || null})
    `;

    return NextResponse.json({ success: true, message: "Inquiry sent" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
