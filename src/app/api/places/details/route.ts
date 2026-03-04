import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
  const placeId = new URL(req.url).searchParams.get("place_id");
  if (!placeId) return NextResponse.json({ result: null });
  if (!API_KEY) return NextResponse.json({ result: null });

  try {
    const params = new URLSearchParams({
      place_id: placeId,
      fields: "name,formatted_address,formatted_phone_number,website,geometry",
      key: API_KEY,
    });

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params}`
    );
    const data = await res.json();

    return NextResponse.json({ result: data.result || null });
  } catch {
    return NextResponse.json({ result: null });
  }
}
