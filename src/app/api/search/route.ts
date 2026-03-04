import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) return NextResponse.json({ builds: [], shops: [], brands: [], users: [] });

  try {
    const sql = getSql();
    const pattern = `%${q}%`;

    const [builds, shops, brands, users] = await Promise.all([
      sql`
        SELECT b.id, b.title, b.slug, b.make, b.model, b.year, b.style, b.hero_image, u.name as creator_name
        FROM builds b JOIN users u ON b.user_id = u.id
        WHERE b.status = 'published'
          AND (LOWER(b.title) LIKE LOWER(${pattern}) OR LOWER(b.make) LIKE LOWER(${pattern}) OR LOWER(b.model) LIKE LOWER(${pattern}))
        ORDER BY b.views DESC LIMIT 8
      `,
      sql`
        SELECT id, name, slug, location, description
        FROM shops
        WHERE LOWER(name) LIKE LOWER(${pattern}) OR LOWER(location) LIKE LOWER(${pattern})
        ORDER BY claimed DESC, name ASC LIMIT 6
      `,
      sql`
        SELECT id, name, slug, category, logo_url
        FROM brands
        WHERE LOWER(name) LIKE LOWER(${pattern}) OR LOWER(category) LIKE LOWER(${pattern})
        ORDER BY name ASC LIMIT 6
      `,
      sql`
        SELECT id, name, username, avatar_url, account_type
        FROM users
        WHERE username IS NOT NULL
          AND (LOWER(name) LIKE LOWER(${pattern}) OR LOWER(username) LIKE LOWER(${pattern}))
        LIMIT 6
      `,
    ]);

    return NextResponse.json({ builds, shops, brands, users });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Search failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
