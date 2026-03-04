import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { PLACEMENTS, getFloorPrice, type PlacementKey } from "@/lib/sponsorship";

// GET — list own sponsorships or get floor prices
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Public: get current floor prices
  if (searchParams.get("prices") === "1") {
    const prices: Record<string, { label: string; desc: string; floor: number }> = {};
    for (const [key, info] of Object.entries(PLACEMENTS)) {
      prices[key] = {
        label: info.label,
        desc: info.desc,
        floor: await getFloorPrice(key as PlacementKey),
      };
    }
    return NextResponse.json({ prices });
  }

  // Authenticated: list own sponsorships
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const sql = getSql();
  const sponsorships = await sql`
    SELECT * FROM sponsorships
    WHERE user_id = ${payload.userId}
    ORDER BY created_at DESC
  `;

  return NextResponse.json({ sponsorships });
}

// POST — create a new sponsorship
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const body = await req.json();
  const { placement, daily_budget, title, image_url, link_url, target_type, target_id, budget_cap, ends_at } = body;

  // Validate placement
  if (!placement || !(placement in PLACEMENTS)) {
    return NextResponse.json({ error: "Invalid placement type" }, { status: 400 });
  }

  // Validate budget against floor price
  const floor = await getFloorPrice(placement as PlacementKey);
  if (!daily_budget || daily_budget < floor) {
    return NextResponse.json({
      error: `Minimum daily budget for ${PLACEMENTS[placement as PlacementKey].label} is $${floor.toFixed(2)}/day`,
      floor,
    }, { status: 400 });
  }

  const sql = getSql();
  const rows = await sql`
    INSERT INTO sponsorships (user_id, placement, daily_budget, title, image_url, link_url, target_type, target_id, budget_cap, ends_at)
    VALUES (${payload.userId}, ${placement}, ${daily_budget}, ${title || null}, ${image_url || null}, ${link_url || null}, ${target_type || null}, ${target_id || null}, ${budget_cap || null}, ${ends_at || null})
    RETURNING *
  `;

  return NextResponse.json({ sponsorship: rows[0], floor }, { status: 201 });
}
