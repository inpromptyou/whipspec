import { NextResponse } from "next/server";
import { snapshotMetrics } from "@/lib/sponsorship";

// GET — snapshot today's platform metrics (triggers floor price recalculation)
export async function GET() {
  try {
    const metrics = await snapshotMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
