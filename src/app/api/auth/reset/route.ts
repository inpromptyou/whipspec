import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "Password must be 8+ characters" }, { status: 400 });

    const sql = getSql();

    const rows = await sql`
      SELECT pr.user_id, pr.expires_at, pr.used
      FROM password_resets pr
      WHERE pr.token = ${token}
      LIMIT 1
    `;

    if (rows.length === 0) return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });

    const reset = rows[0];
    if (reset.used) return NextResponse.json({ error: "This reset link has already been used" }, { status: 400 });
    if (new Date(reset.expires_at as string) < new Date()) return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });

    const hash = await bcrypt.hash(password, 12);

    await sql`UPDATE users SET password_hash = ${hash}, updated_at = NOW() WHERE id = ${reset.user_id}`;
    await sql`UPDATE password_resets SET used = TRUE WHERE token = ${token}`;

    return NextResponse.json({ success: true, message: "Password updated. You can now log in." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
