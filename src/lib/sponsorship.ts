import { getSql } from "./db";

// Placement types and their base floor prices (AUD/day)
export const PLACEMENTS = {
  build_feature:    { label: "Featured Build Slot",   desc: "Top of discover feed and build pages",    baseFloor: 5 },
  category_sponsor: { label: "Category Sponsor",      desc: "Banner on a specific category page",      baseFloor: 8 },
  brand_spotlight:  { label: "Brand Spotlight",        desc: "Highlighted in brand directory",           baseFloor: 5 },
  shop_boost:       { label: "Shop Boost",             desc: "Priority in shop listings and search",     baseFloor: 5 },
  homepage_banner:  { label: "Homepage Banner",        desc: "Featured placement on the homepage",       baseFloor: 15 },
  search_top:       { label: "Search Top Result",      desc: "First result for relevant searches",       baseFloor: 10 },
} as const;

export type PlacementKey = keyof typeof PLACEMENTS;

/**
 * Calculate the current floor price for a placement based on platform engagement.
 *
 * Formula: baseFloor * engagementMultiplier
 *   - engagementMultiplier starts at 1.0x
 *   - Every 1,000 daily views adds 0.1x
 *   - Every 100 daily unique visitors adds 0.15x
 *   - Capped at 10x base (so $5 floor can go up to $50)
 */
export async function getFloorPrice(placement: PlacementKey): Promise<number> {
  const base = PLACEMENTS[placement]?.baseFloor ?? 5;

  try {
    const sql = getSql();
    const rows = await sql`
      SELECT total_views, unique_visitors, engagement_score
      FROM platform_metrics
      ORDER BY date DESC LIMIT 1
    `;

    if (rows.length === 0) return base;

    const { total_views, unique_visitors } = rows[0];
    const viewBoost = Math.floor((total_views as number) / 1000) * 0.1;
    const visitorBoost = Math.floor((unique_visitors as number) / 100) * 0.15;
    const multiplier = Math.min(1 + viewBoost + visitorBoost, 10);

    return Math.round(base * multiplier * 100) / 100;
  } catch {
    return base;
  }
}

/**
 * Get all floor prices for all placements (for pricing display).
 */
export async function getAllFloorPrices(): Promise<Record<PlacementKey, number>> {
  const result = {} as Record<PlacementKey, number>;
  for (const key of Object.keys(PLACEMENTS) as PlacementKey[]) {
    result[key] = await getFloorPrice(key);
  }
  return result;
}

/**
 * Record an impression or click event for a sponsorship.
 */
export async function recordEvent(sponsorshipId: number, eventType: "impression" | "click", metadata: Record<string, unknown> = {}) {
  try {
    const sql = getSql();
    await sql`
      INSERT INTO sponsorship_events (sponsorship_id, event_type, metadata)
      VALUES (${sponsorshipId}, ${eventType}, ${JSON.stringify(metadata)})
    `;

    if (eventType === "impression") {
      await sql`UPDATE sponsorships SET impressions = impressions + 1 WHERE id = ${sponsorshipId}`;
    } else {
      await sql`UPDATE sponsorships SET clicks = clicks + 1 WHERE id = ${sponsorshipId}`;
    }
  } catch {
    // Non-blocking
  }
}

/**
 * Get active sponsorships for a specific placement.
 * Returns up to `limit` active sponsorships, weighted by daily_budget.
 */
export async function getActiveSponsorships(placement: PlacementKey, limit = 3) {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT s.*, u.name as sponsor_name
      FROM sponsorships s
      JOIN users u ON s.user_id = u.id
      WHERE s.placement = ${placement}
        AND s.status = 'active'
        AND (s.ends_at IS NULL OR s.ends_at >= CURRENT_DATE)
        AND (s.budget_cap IS NULL OR s.total_spent < s.budget_cap)
      ORDER BY s.daily_budget DESC, s.created_at ASC
      LIMIT ${limit}
    `;
    return rows;
  } catch {
    return [];
  }
}

/**
 * Snapshot today's platform metrics (call daily via cron or on-demand).
 */
export async function snapshotMetrics() {
  try {
    const sql = getSql();

    const [viewsRow] = await sql`SELECT COALESCE(SUM(views), 0)::int as total FROM builds`;
    const [usersRow] = await sql`SELECT COUNT(*)::int as total FROM users`;
    const [buildsRow] = await sql`SELECT COUNT(*)::int as total FROM builds WHERE status = 'published'`;
    const [shopsRow] = await sql`SELECT COUNT(*)::int as total FROM shops`;

    const totalViews = viewsRow.total as number;
    const totalUsers = usersRow.total as number;
    const totalBuilds = buildsRow.total as number;
    const totalShops = shopsRow.total as number;

    // Simple engagement score: views + (users * 10) + (builds * 5)
    const engagementScore = totalViews + (totalUsers * 10) + (totalBuilds * 5);

    // Calculate today's floor price based on engagement
    const baseFloor = 5;
    const multiplier = Math.min(1 + (totalViews / 1000) * 0.1 + (totalUsers / 100) * 0.15, 10);
    const floorPrice = Math.round(baseFloor * multiplier * 100) / 100;

    await sql`
      INSERT INTO platform_metrics (date, total_views, unique_visitors, total_builds, total_shops, total_users, engagement_score, floor_price)
      VALUES (CURRENT_DATE, ${totalViews}, ${totalUsers}, ${totalBuilds}, ${totalShops}, ${totalUsers}, ${engagementScore}, ${floorPrice})
      ON CONFLICT (date) DO UPDATE SET
        total_views = EXCLUDED.total_views,
        unique_visitors = EXCLUDED.unique_visitors,
        total_builds = EXCLUDED.total_builds,
        total_shops = EXCLUDED.total_shops,
        total_users = EXCLUDED.total_users,
        engagement_score = EXCLUDED.engagement_score,
        floor_price = EXCLUDED.floor_price
    `;

    return { totalViews, totalUsers, totalBuilds, totalShops, engagementScore, floorPrice };
  } catch (e) {
    throw e;
  }
}
