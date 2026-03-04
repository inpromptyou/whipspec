import { NextResponse } from "next/server";
import { ensureTables } from "@/lib/schema";

export async function GET() {
  try {
    const result = await ensureTables();
    return NextResponse.json({ ...result, message: "Migration complete" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
