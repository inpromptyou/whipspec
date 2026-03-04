import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, generateToken } from "@/lib/auth";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const { success } = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    if (!success) {
      return NextResponse.json({ error: "Too many login attempts. Try again in 15 minutes." }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await verifyCredentials(email.toLowerCase().trim(), password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json({ user, token });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
