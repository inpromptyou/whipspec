import { getSql } from "./db";

export interface BuildRow {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; style: string; location: string; hero_image: string;
  creator_name: string; creator_avatar: string; views: number;
  description: string; created_at: string;
}

export interface ShopRow {
  id: number; name: string; slug: string; description: string;
  location: string; services: string[]; hero_image: string;
  claimed: boolean; verified: boolean; build_count: number;
}

export interface BrandRow {
  id: number; name: string; slug: string; description: string;
  category: string; website: string; logo_url: string;
}

export async function getPublishedBuilds(limit = 50): Promise<BuildRow[]> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT b.*, u.name as creator_name, u.avatar_url as creator_avatar
      FROM builds b JOIN users u ON b.user_id = u.id
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC LIMIT ${limit}
    `;
    return rows as unknown as BuildRow[];
  } catch {
    return [];
  }
}

export async function getAllShops(limit = 100): Promise<ShopRow[]> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT s.*,
        (SELECT COUNT(*) FROM build_mods bm WHERE bm.shop_id = s.id)::int as build_count
      FROM shops s
      ORDER BY s.claimed DESC, s.name ASC LIMIT ${limit}
    `;
    return rows as unknown as ShopRow[];
  } catch {
    return [];
  }
}

export async function getAllBrands(limit = 200): Promise<BrandRow[]> {
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM brands ORDER BY name ASC LIMIT ${limit}
    `;
    return rows as unknown as BrandRow[];
  } catch {
    return [];
  }
}
