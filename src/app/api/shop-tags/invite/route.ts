import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

// POST — admin sends invite email to a tagged shop
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only admin can send invites (check email for now)
    if (user.email !== "inpromptyou@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { tag_id, email } = await req.json();
    if (!tag_id || !email) return NextResponse.json({ error: "Tag ID and email required" }, { status: 400 });

    const sql = getSql();

    const tags = await sql`SELECT * FROM shop_tags WHERE id = ${tag_id}`;
    if (!tags.length) return NextResponse.json({ error: "Tag not found" }, { status: 404 });

    const tag = tags[0];

    // Send invite email via Resend (if configured)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "WhipSpec <hello@whipspec.com>",
          to: email,
          subject: `You've been tagged on WhipSpec — claim your shop profile`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h2 style="color: #0F172A; font-size: 20px;">Your shop was tagged on a build</h2>
              <p style="color: #64748B; font-size: 15px; line-height: 1.6;">
                A creator on WhipSpec tagged <strong>${tag.shop_name}</strong> on their build.
                Claim your free shop profile to get discovered by car enthusiasts across Australia.
              </p>
              <p style="color: #64748B; font-size: 15px; line-height: 1.6;">
                Every build you're tagged on becomes part of your portfolio — real proof of your work, visible to people actively looking for shops like yours.
              </p>
              <a href="https://whipspec.com?claim=shop" style="display: inline-block; background: #0F172A; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; margin-top: 8px;">
                Claim your shop profile
              </a>
              <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">
                WhipSpec is Australia's automotive build showcase. Shops, builds, and brands — attributed and discoverable.
              </p>
            </div>
          `,
        }),
      });
    }

    // Update tag record
    await sql`
      UPDATE shop_tags SET
        email = ${email},
        invite_sent_at = NOW(),
        status = 'invited'
      WHERE id = ${tag_id}
    `;

    return NextResponse.json({ success: true, message: RESEND_KEY ? "Invite email sent" : "Tag updated (email not sent — RESEND_API_KEY not configured)" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to send invite";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
