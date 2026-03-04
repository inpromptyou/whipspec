import { NextRequest, NextResponse } from "next/server";
import { createUser, generateToken } from "@/lib/auth";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIP(req);
    const { success } = rateLimit(`signup:${ip}`, 3, 60 * 60 * 1000); // 3 signups per hour per IP
    if (!success) {
      return NextResponse.json({ error: "Too many signup attempts. Try again later." }, { status: 429 });
    }

    const { name, email, password, accountType } = await req.json();

    if (!name || !email || !password || !accountType) {
      return NextResponse.json(
        { error: "Name, email, password, and account type are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (!["creator", "shop"].includes(accountType)) {
      return NextResponse.json(
        { error: "Account type must be 'creator' or 'shop'" },
        { status: 400 }
      );
    }

    const user = await createUser(name, email.toLowerCase().trim(), password, accountType);
    const token = generateToken(user);

    const response = NextResponse.json({ user, token });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
