import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import crypto from "crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const { success } = rateLimit(`forgot:${ip}`, 3, 60 * 60 * 1000);
    if (!success) return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });

    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const sql = getSql();
    const users = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;

    // Always return success (don't reveal if email exists)
    if (users.length === 0) {
      return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store reset token
    await sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${users[0].id}, ${token}, ${expires.toISOString()})
    `;

    // TODO: Send email via Resend when RESEND_API_KEY is configured
    // For now, log the reset link
    const resetUrl = `https://whipspec.com/reset?token=${token}`;
    console.log(`Password reset for ${email}: ${resetUrl}`);

    return NextResponse.json({ success: true, message: "If that email exists, a reset link has been sent." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
