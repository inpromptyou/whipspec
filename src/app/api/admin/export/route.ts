import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user || user.email !== "inpromptyou@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const type = new URL(req.url).searchParams.get("type") || "shops";
    const sql = getSql();

    if (type === "shops") {
      const shops = await sql`
        SELECT s.id, s.name, s.location, s.phone, s.email, s.website, s.claimed, s.verified, s.created_at,
          u.name as owner_name, u.email as owner_email
        FROM shops s
        LEFT JOIN users u ON s.user_id = u.id
        ORDER BY s.created_at DESC
      `;

      const header = "ID,Name,Location,Phone,Email,Website,Claimed,Featured,Created,Owner Name,Owner Email\n";
      const rows = shops.map((s) =>
        [s.id, `"${s.name}"`, `"${s.location || ""}"`, s.phone || "", s.email || "", s.website || "", s.claimed, s.verified, s.created_at, `"${s.owner_name || ""}"`, s.owner_email || ""].join(",")
      ).join("\n");

      return new Response(header + rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=whipspec-shops-${new Date().toISOString().split("T")[0]}.csv`,
        },
      });
    }

    if (type === "tags") {
      const tags = await sql`
        SELECT st.id, st.shop_name, st.address, st.phone, st.website, st.email, st.status, st.created_at,
          u.name as tagged_by, b.title as build_title
        FROM shop_tags st
        JOIN users u ON st.tagged_by = u.id
        JOIN builds b ON st.build_id = b.id
        ORDER BY st.created_at DESC
      `;

      const header = "ID,Shop Name,Address,Phone,Website,Email,Status,Created,Tagged By,Build\n";
      const rows = tags.map((t) =>
        [t.id, `"${t.shop_name}"`, `"${t.address || ""}"`, t.phone || "", t.website || "", t.email || "", t.status, t.created_at, `"${t.tagged_by}"`, `"${t.build_title}"`].join(",")
      ).join("\n");

      return new Response(header + rows, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename=whipspec-shop-tags-${new Date().toISOString().split("T")[0]}.csv`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Export failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
