import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

// General image upload endpoint — returns base64 data URL
// Future: swap to Vercel Blob or S3 when ready
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Rate limit: 20 uploads per hour
    const ip = getClientIP(req);
    const { success } = rateLimit(`upload:${payload.userId}:${ip}`, 20, 60 * 60 * 1000);
    if (!success) return NextResponse.json({ error: "Upload limit reached. Try again later." }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }
    // 5MB limit (should already be compressed client-side)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 5MB after compression" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({ url: dataUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
