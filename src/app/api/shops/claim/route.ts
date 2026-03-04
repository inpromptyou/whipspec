import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

// POST — authenticated shop owner claims a shop profile from shop_tags
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { tag_id, shop_name, address, phone, website, description, services } = await req.json();

    const sql = getSql();

    // Check if user already owns a shop
    const existing = await sql`SELECT id FROM shops WHERE user_id = ${user.id} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "You already have a shop profile", shop_id: existing[0].id }, { status: 400 });
    }

    // Create the shop profile
    const slug = slugify(shop_name || user.name);
    const rows = await sql`
      INSERT INTO shops (user_id, name, slug, description, location, phone, email, website, services, claimed)
      VALUES (
        ${user.id},
        ${shop_name || user.name},
        ${slug},
        ${description || null},
        ${address || null},
        ${phone || null},
        ${user.email},
        ${website || null},
        ${services || "{}"},
        TRUE
      )
      RETURNING *
    `;

    const shop = rows[0];

    // Update user account type to shop
    await sql`UPDATE users SET account_type = 'shop', updated_at = NOW() WHERE id = ${user.id}`;

    // If claiming from a tag, link the tag and update all matching tags
    if (tag_id) {
      await sql`
        UPDATE shop_tags SET shop_id = ${shop.id}, status = 'claimed', claimed_at = NOW()
        WHERE id = ${tag_id}
      `;
    }

    // Also claim any other tags that match this shop name
    if (shop_name) {
      await sql`
        UPDATE shop_tags SET shop_id = ${shop.id}, status = 'claimed', claimed_at = NOW()
        WHERE LOWER(shop_name) = LOWER(${shop_name}) AND shop_id IS NULL
      `;
    }

    // Link existing build_mods that reference this shop name
    if (shop_name) {
      await sql`
        UPDATE build_mods SET shop_id = ${shop.id}
        WHERE LOWER(shop_name) = LOWER(${shop_name}) AND shop_id IS NULL
      `;
    }

    return NextResponse.json({ shop, message: "Shop profile claimed! All tagged builds are now linked." }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Claim failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// GET — check if there are unclaimed tags matching a name
export async function GET(req: NextRequest) {
  const name = new URL(req.url).searchParams.get("name");
  if (!name) return NextResponse.json({ tags: [] });

  try {
    const sql = getSql();
    const tags = await sql`
      SELECT st.*, b.title as build_title, b.slug as build_slug
      FROM shop_tags st
      JOIN builds b ON st.build_id = b.id
      WHERE LOWER(st.shop_name) = LOWER(${name}) AND st.shop_id IS NULL
      ORDER BY st.created_at DESC
    `;
    return NextResponse.json({ tags });
  } catch {
    return NextResponse.json({ tags: [] });
  }
}
