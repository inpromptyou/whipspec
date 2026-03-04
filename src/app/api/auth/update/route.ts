import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { name, username, location, bio, instagram } = await req.json();
    const sql = getSql();

    // Validate username if provided
    if (username) {
      const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (clean.length < 3 || clean.length > 30) {
        return NextResponse.json({ error: "Username must be 3-30 characters (letters, numbers, underscores)" }, { status: 400 });
      }
      // Check uniqueness
      const existing = await sql`SELECT id FROM users WHERE username = ${clean} AND id != ${payload.userId}`;
      if (existing.length > 0) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    await sql`
      UPDATE users SET
        name = COALESCE(${name || null}, name),
        username = COALESCE(${username ? username.toLowerCase().replace(/[^a-z0-9_]/g, "") : null}, username),
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
