import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { LocalBusinessSchema } from "@/components/StructuredData";
import { getSql } from "@/lib/db";
import ShopClient from "./ShopClient";

interface Shop {
  id: number; name: string; slug: string; description: string; location: string;
  services: string[]; phone: string; email: string; instagram: string; website: string;
  hero_image: string; claimed: boolean; verified: boolean;
}
interface Build {
  id: number; title: string; slug: string; make: string; model: string; year: number; hero_image: string; style: string;
}

async function getShop(slug: string): Promise<{ shop: Shop; builds: Build[] } | null> {
  try {
    const sql = getSql();
    const shops = await sql`SELECT * FROM shops WHERE slug = ${slug} LIMIT 1`;
    if (shops.length === 0) return null;
    const shop = shops[0] as unknown as Shop;

    const builds = await sql`
      SELECT DISTINCT b.id, b.title, b.slug, b.make, b.model, b.year, b.hero_image, b.style
      FROM builds b
      JOIN build_mods bm ON bm.build_id = b.id
      WHERE bm.shop_id = ${shop.id} AND b.status = 'published'
      ORDER BY b.created_at DESC LIMIT 20
    `;

    return { shop, builds: builds as unknown as Build[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getShop(slug);
  if (!data) return { title: "Shop Not Found — WhipSpec" };

  const { shop } = data;
  const title = `${shop.name}${shop.location ? ` — ${shop.location}` : ""} | WhipSpec`;
  const description = shop.description || `${shop.name} on WhipSpec. See their work and send an inquiry.`;

  return {
    title,
    description,
    openGraph: { title, description, url: `https://whipspec.com/shop/${slug}`, type: "profile" },
  };
}

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getShop(slug);
  if (!data) notFound();

  const { shop, builds } = data;

  return (
    <>
      <LocalBusinessSchema name={shop.name} description={shop.description} location={shop.location} url={`https://whipspec.com/shop/${slug}`} />
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          <ShopClient shop={shop} builds={builds} />
        </div>
      </main>
      <Footer />
    </>
  );
}
