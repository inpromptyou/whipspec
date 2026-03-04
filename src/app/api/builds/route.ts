import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const style = searchParams.get("style");
    const q = searchParams.get("q");
    const userId = searchParams.get("user_id");
    const mine = searchParams.get("mine");

    let builds;

    // If ?mine=1, return the current user's builds (all statuses)
    if (mine) {
      const token = req.cookies.get("token")?.value;
      if (!token) return NextResponse.json({ builds: [] });
      const user = await getUserFromToken(token);
      if (!user) return NextResponse.json({ builds: [] });
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.user_id = ${user.id} ORDER BY b.created_at DESC LIMIT 100
      `;
      return NextResponse.json({ builds });
    }

    if (userId) {
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.user_id = ${parseInt(userId)} ORDER BY b.created_at DESC LIMIT 100
      `;
    } else if (style && q) {
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.status = 'published' AND b.style = ${style}
          AND (LOWER(b.title) LIKE LOWER(${`%${q}%`}) OR LOWER(b.make) LIKE LOWER(${`%${q}%`}) OR LOWER(b.model) LIKE LOWER(${`%${q}%`}))
        ORDER BY b.created_at DESC LIMIT 50
      `;
    } else if (style) {
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.status = 'published' AND b.style = ${style}
        ORDER BY b.created_at DESC LIMIT 50
      `;
    } else if (q) {
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.status = 'published'
          AND (LOWER(b.title) LIKE LOWER(${`%${q}%`}) OR LOWER(b.make) LIKE LOWER(${`%${q}%`}) OR LOWER(b.model) LIKE LOWER(${`%${q}%`}))
        ORDER BY b.created_at DESC LIMIT 50
      `;
    } else {
      builds = await sql`
        SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.status = 'published'
        ORDER BY b.created_at DESC LIMIT 50
      `;
    }

    return NextResponse.json({ builds });
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

    const { title, make, model, year, description, style, location, hero_image, mods } = await req.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const sql = getSql();

    // Enforce build limits for free tier (3 builds max)
    const { hasEntitlement } = await import("@/lib/billing");
    const hasUnlimited = await hasEntitlement(user.id, "unlimited_builds");
    if (!hasUnlimited) {
      const countRows = await sql`SELECT COUNT(*) as count FROM builds WHERE user_id = ${user.id}`;
      if (Number(countRows[0].count) >= 3) {
        return NextResponse.json({ error: "Free accounts can publish up to 3 builds. Upgrade to Creator Plus for unlimited builds." }, { status: 403 });
      }
    }
    const slug = slugify(title);

    const rows = await sql`
      INSERT INTO builds (user_id, title, slug, make, model, year, description, style, location, hero_image)
      VALUES (${user.id}, ${title}, ${slug}, ${make || null}, ${model || null}, ${year || null}, ${description || null}, ${style || null}, ${location || null}, ${hero_image || null})
      RETURNING *
    `;

    const build = rows[0];

    if (mods && Array.isArray(mods)) {
      for (let i = 0; i < mods.length; i++) {
        const m = mods[i];
        if (m.category) {
          await sql`
            INSERT INTO build_mods (build_id, category, brand, product_name, shop_name, link, notes, sort_order)
            VALUES (${build.id}, ${m.category}, ${m.brand || null}, ${m.product_name || null}, ${m.shop_name || null}, ${m.link || null}, ${m.notes || null}, ${i})
          `;
        }
      }
    }

    return NextResponse.json({ build }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
