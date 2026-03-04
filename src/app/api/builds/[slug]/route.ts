import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const sql = getSql();

    const builds = await sql`
      SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM builds b
      JOIN users u ON b.user_id = u.id
      WHERE b.slug = ${slug}
    `;

    if (builds.length === 0) {
      return NextResponse.json({ error: "Build not found" }, { status: 404 });
    }

    // Increment views
    await sql`UPDATE builds SET views = views + 1 WHERE slug = ${slug}`;

    const build = builds[0];

    // Get mods
    const mods = await sql`
      SELECT bm.*, s.name as shop_display_name, s.slug as shop_slug
      FROM build_mods bm
      LEFT JOIN shops s ON bm.shop_id = s.id
      ORDER BY bm.sort_order ASC
    `;

    return NextResponse.json({ build, mods: mods.filter((m: Record<string, unknown>) => m.build_id === build.id) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
