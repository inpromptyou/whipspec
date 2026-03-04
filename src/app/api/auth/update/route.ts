import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, location, bio, instagram } = await req.json();
    const sql = getSql();

    await sql`
      UPDATE users SET
        name = COALESCE(${name || null}, name),
        location = ${location || null},
        bio = ${bio || null},
        instagram = ${instagram || null},
        updated_at = NOW()
      WHERE id = ${payload.userId}
    `;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
