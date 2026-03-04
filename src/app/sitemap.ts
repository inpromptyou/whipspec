import { MetadataRoute } from "next";
import { getSql } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://whipspec.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/discover`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/builds`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/shops`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/brands`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${baseUrl}/advertise`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  // Dynamic pages from database
  let buildPages: MetadataRoute.Sitemap = [];
  let shopPages: MetadataRoute.Sitemap = [];

  try {
    const sql = getSql();

    const builds = await sql`
      SELECT slug, updated_at FROM builds WHERE status = 'published' ORDER BY updated_at DESC LIMIT 5000
    `;
    buildPages = builds.map((b) => ({
      url: `${baseUrl}/build/${b.slug}`,
      lastModified: new Date(b.updated_at as string),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const shops = await sql`
      SELECT slug, updated_at FROM shops ORDER BY updated_at DESC LIMIT 5000
    `;
    shopPages = shops.map((s) => ({
      url: `${baseUrl}/shop/${s.slug}`,
      lastModified: new Date(s.updated_at as string),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // DB not available — return static pages only
  }

  return [...staticPages, ...buildPages, ...shopPages];
}
