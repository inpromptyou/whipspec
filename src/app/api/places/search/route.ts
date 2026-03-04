import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json({ predictions: [] });

  if (!API_KEY) {
    // No Google Places key — return empty (graceful degradation)
    return NextResponse.json({ predictions: [] });
  }

  try {
    const params = new URLSearchParams({
      input: q,
      types: "establishment",
      components: "country:au",
      key: API_KEY,
    });

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params}`
    );
    const data = await res.json();

    return NextResponse.json({ predictions: data.predictions || [] });
  } catch {
    return NextResponse.json({ predictions: [] });
  }
}
