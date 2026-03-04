import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// GET — list all pending shop tags (admin) or tags for a build
export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const url = new URL(req.url);
    const buildId = url.searchParams.get("build_id");

    if (buildId) {
      const tags = await sql`
        SELECT st.*, u.name as tagged_by_name
        FROM shop_tags st
        JOIN users u ON st.tagged_by = u.id
        WHERE st.build_id = ${parseInt(buildId)}
        ORDER BY st.created_at DESC
      `;
      return NextResponse.json({ tags });
    }

    // Admin: list all pending tags
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tags = await sql`
      SELECT st.*, u.name as tagged_by_name, b.title as build_title, b.slug as build_slug
      FROM shop_tags st
      JOIN users u ON st.tagged_by = u.id
      JOIN builds b ON st.build_id = b.id
      WHERE st.status = 'pending'
      ORDER BY st.created_at DESC
    `;
    return NextResponse.json({ tags });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to fetch tags";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — creator tags a shop on their build
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { build_id, shop_name, address, phone, website, email, google_place_id, shop_id } = await req.json();
    if (!build_id || !shop_name) return NextResponse.json({ error: "Build ID and shop name required" }, { status: 400 });

    const sql = getSql();

    // If shop_id provided (existing registered shop), link directly
    if (shop_id) {
      const rows = await sql`
        INSERT INTO shop_tags (build_id, tagged_by, shop_name, shop_id, status)
        VALUES (${build_id}, ${user.id}, ${shop_name}, ${shop_id}, 'claimed')
        RETURNING *
      `;
      return NextResponse.json({ tag: rows[0] });
    }

    // Check if this shop was already tagged (by Google Place ID or name+address)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existing: any[] = [];
    if (google_place_id) {
      existing = await sql`SELECT id FROM shop_tags WHERE google_place_id = ${google_place_id} LIMIT 1`;
    }
    if (!existing.length && shop_name && address) {
      existing = await sql`SELECT id FROM shop_tags WHERE LOWER(shop_name) = LOWER(${shop_name}) AND LOWER(address) = LOWER(${address}) LIMIT 1`;
    }

    const rows = await sql`
      INSERT INTO shop_tags (build_id, tagged_by, shop_name, address, phone, website, email, google_place_id)
      VALUES (${build_id}, ${user.id}, ${shop_name}, ${address || null}, ${phone || null}, ${website || null}, ${email || null}, ${google_place_id || null})
      RETURNING *
    `;

    return NextResponse.json({ tag: rows[0], existing: existing?.length ? true : false });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to tag shop";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
