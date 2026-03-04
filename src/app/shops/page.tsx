import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shops — WhipSpec",
  description: "Find the workshops, installers, and specialists behind the builds on WhipSpec.",
};
import Footer from "@/components/Footer";
import { getAllShops } from "@/lib/queries";
import ShopsClient from "./ShopsClient";

export default async function ShopsPage() {
  const shops = await getAllShops(100);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">Shops</h1>
            <p className="text-[15px] text-[#64748B]">The workshops and installers behind the builds.</p>
          </div>
          <ShopsClient initialShops={shops} />
        </div>
      </main>
      <Footer />
    </>
  );
}
