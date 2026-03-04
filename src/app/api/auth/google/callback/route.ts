import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { generateToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const accountType = searchParams.get("state") || "creator";

    if (!code) {
      return NextResponse.redirect(new URL("/?auth_error=no_code", req.url));
    }

    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${process.env.NEXTAUTH_URL || "https://whipspec.com"}/api/auth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL("/?auth_error=token_failed", req.url));
    }

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userRes.json();

    if (!profile.email) {
      return NextResponse.redirect(new URL("/?auth_error=no_email", req.url));
    }

    const sql = getSql();

    // Check if user exists
    const existing = await sql`SELECT * FROM users WHERE email = ${profile.email}`;

    let user;
    if (existing.length > 0) {
      user = existing[0];
      // Update avatar if missing
      if (!user.avatar_url && profile.picture) {
        await sql`UPDATE users SET avatar_url = ${profile.picture} WHERE id = ${user.id}`;
      }
    } else {
      // Create new user (no password needed for Google auth)
      const rows = await sql`
        INSERT INTO users (name, email, password_hash, account_type, avatar_url)
        VALUES (${profile.name || "User"}, ${profile.email}, ${"google_oauth"}, ${accountType === "shop" ? "shop" : "creator"}, ${profile.picture || null})
        RETURNING *
      `;
      user = rows[0];
    }

    const token = generateToken({
      id: user.id as number,
      name: user.name as string,
      username: (user.username as string | null) || null,
      email: user.email as string,
      account_type: user.account_type as string,
      avatar_url: user.avatar_url as string | null,
      bio: user.bio as string | null,
      location: user.location as string | null,
      created_at: user.created_at as string,
    });

    const response = NextResponse.redirect(new URL("/dashboard", req.url));
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(new URL("/?auth_error=server_error", req.url));
  }
}
