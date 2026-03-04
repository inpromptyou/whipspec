import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const q = searchParams.get("q");

    let brands;

    if (category && q) {
      brands = await sql`
        SELECT b.*, (SELECT COUNT(*) FROM build_mods bm WHERE LOWER(bm.brand) = LOWER(b.name)) as build_count
        FROM brands b WHERE LOWER(b.category) = LOWER(${category}) AND LOWER(b.name) LIKE LOWER(${`%${q}%`})
        ORDER BY b.name ASC
      `;
    } else if (category) {
      brands = await sql`
        SELECT b.*, (SELECT COUNT(*) FROM build_mods bm WHERE LOWER(bm.brand) = LOWER(b.name)) as build_count
        FROM brands b WHERE LOWER(b.category) = LOWER(${category})
        ORDER BY b.name ASC
      `;
    } else if (q) {
      brands = await sql`
        SELECT b.*, (SELECT COUNT(*) FROM build_mods bm WHERE LOWER(bm.brand) = LOWER(b.name)) as build_count
        FROM brands b WHERE LOWER(b.name) LIKE LOWER(${`%${q}%`})
        ORDER BY b.name ASC
      `;
    } else {
      brands = await sql`
        SELECT b.*, (SELECT COUNT(*) FROM build_mods bm WHERE LOWER(bm.brand) = LOWER(b.name)) as build_count
        FROM brands b ORDER BY b.name ASC
      `;
    }

    return NextResponse.json({ brands });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
