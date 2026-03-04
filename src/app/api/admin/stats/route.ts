import { NextRequest, NextResponse } from "next/server";
import { getSql } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = await getUserFromToken(token);
    if (!user || user.email !== "inpromptyou@gmail.com") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const sql = getSql();

    const [users, builds, tags, shops] = await Promise.all([
      sql`SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE account_type IN ('creator', 'buyer')) as creators,
        COUNT(*) FILTER (WHERE account_type = 'shop') as shop_users,
        COUNT(*) FILTER (WHERE subscription_plan = 'creator_plus' AND subscription_status = 'active') as pro_subs
      FROM users`,
      sql`SELECT COUNT(*) as total, COALESCE(SUM(views), 0) as total_views FROM builds WHERE status = 'published'`,
      sql`SELECT
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'claimed') as claimed
      FROM shop_tags`,
      sql`SELECT
        COUNT(*) FILTER (WHERE claimed = TRUE) as claimed,
        COUNT(*) FILTER (WHERE verified = TRUE) as featured
      FROM shops`,
    ]);

    const proSubscribers = Number(users[0].pro_subs || 0);
    const featuredShops = Number(shops[0].featured || 0);
    const proMRR = proSubscribers * 4.99;
    const featuredMRR = featuredShops * 49.99;

    return NextResponse.json({
      totalUsers: Number(users[0].total),
      creators: Number(users[0].creators),
      shops: Number(users[0].shop_users),
      totalBuilds: Number(builds[0].total),
      totalViews: Number(builds[0].total_views),
      pendingTags: Number(tags[0].pending),
      claimedShops: Number(shops[0].claimed),
      proSubscribers,
      featuredShops,
      proMRR,
      featuredMRR,
      totalMRR: proMRR + featuredMRR,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Stats failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
