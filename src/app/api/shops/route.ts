import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    let shops;

    if (q) {
      shops = await sql`
        SELECT s.*, (SELECT COUNT(*) FROM build_mods bm WHERE bm.shop_id = s.id) as build_count
        FROM shops s
        WHERE LOWER(s.name) LIKE LOWER(${`%${q}%`}) OR LOWER(s.location) LIKE LOWER(${`%${q}%`})
        ORDER BY s.claimed DESC, s.created_at DESC LIMIT 100
      `;
    } else {
      shops = await sql`
        SELECT s.*, (SELECT COUNT(*) FROM build_mods bm WHERE bm.shop_id = s.id) as build_count
        FROM shops s
        ORDER BY s.claimed DESC, s.created_at DESC LIMIT 100
      `;
    }

    return NextResponse.json({ shops });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, description, location, services, phone, email, instagram, website } = await req.json();
    if (!name) return NextResponse.json({ error: "Shop name is required" }, { status: 400 });

    const sql = getSql();
    const slug = slugify(name);

    const rows = await sql`
      INSERT INTO shops (user_id, name, slug, description, location, services, phone, email, instagram, website, claimed)
      VALUES (${user.id}, ${name}, ${slug}, ${description || null}, ${location || null}, ${services || []}, ${phone || null}, ${email || null}, ${instagram || null}, ${website || null}, true)
      RETURNING *
    `;

    return NextResponse.json({ shop: rows[0] }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
