import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// GET — list all claimed shops for admin
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user || user.email !== "inpromptyou@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const sql = getSql();
    const shops = await sql`
      SELECT * FROM shops ORDER BY verified DESC, claimed DESC, created_at DESC
    `;
    return NextResponse.json({ shops });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — toggle featured status
export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user || user.email !== "inpromptyou@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { shop_id, verified, featured_until } = await req.json();
    if (!shop_id) return NextResponse.json({ error: "Shop ID required" }, { status: 400 });

    const sql = getSql();

    // Add featured_until column if not exists
    try {
      await sql`ALTER TABLE shops ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE`;
    } catch { /* ignore */ }

    await sql`
      UPDATE shops SET verified = ${verified}, updated_at = NOW()
      WHERE id = ${shop_id}
    `;

    if (featured_until) {
      try {
        await sql`UPDATE shops SET featured_until = ${featured_until} WHERE id = ${shop_id}`;
      } catch { /* column may not exist */ }
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
