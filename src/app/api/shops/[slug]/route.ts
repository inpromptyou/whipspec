import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const sql = getSql();

    const shops = await sql`SELECT * FROM shops WHERE slug = ${slug}`;
    if (shops.length === 0) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const shop = shops[0];

    // Get builds featuring this shop
    const builds = await sql`
      SELECT DISTINCT b.id, b.title, b.slug, b.make, b.model, b.year, b.hero_image, b.style
      FROM builds b
      JOIN build_mods bm ON bm.build_id = b.id
      WHERE bm.shop_id = ${shop.id} AND b.status = 'published'
      ORDER BY b.created_at DESC
    `;

    return NextResponse.json({ shop, builds });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
