import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { verifyToken } from "@/lib/auth";

// PATCH — update sponsorship (pause, resume, update budget)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const sql = getSql();

  // Verify ownership
  const existing = await sql`SELECT * FROM sponsorships WHERE id = ${id} AND user_id = ${payload.userId}`;
  if (existing.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { status, daily_budget, ends_at } = body;

  await sql`
    UPDATE sponsorships SET
      status = COALESCE(${status || null}, status),
      daily_budget = COALESCE(${daily_budget || null}, daily_budget),
      ends_at = COALESCE(${ends_at || null}, ends_at),
      updated_at = NOW()
    WHERE id = ${id} AND user_id = ${payload.userId}
  `;

  const updated = await sql`SELECT * FROM sponsorships WHERE id = ${id}`;
  return NextResponse.json({ sponsorship: updated[0] });
}

// DELETE — cancel sponsorship
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { id } = await params;
  const sql = getSql();

  await sql`
    UPDATE sponsorships SET status = 'cancelled', updated_at = NOW()
    WHERE id = ${id} AND user_id = ${payload.userId}
  `;

  return NextResponse.json({ success: true });
}
