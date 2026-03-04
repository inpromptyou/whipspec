import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Brands — WhipSpec",
  description: "The parts and products that make builds happen. Browse brands by category.",
};
import Footer from "@/components/Footer";
import { getAllBrands } from "@/lib/queries";
import BrandsClient from "./BrandsClient";

export default async function BrandsPage() {
  const brands = await getAllBrands(200);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">Brands</h1>
            <p className="text-[15px] text-[#64748B]">The parts and products behind the builds.</p>
          </div>
          <BrandsClient initialBrands={brands} />
        </div>
      </main>
      <Footer />
    </>
  );
}
