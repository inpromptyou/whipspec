import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover Builds — WhipSpec",
  description: "Browse Australian car builds by style, make, and location. Find the exact parts, shops, and brands behind every build.",
};
import Footer from "@/components/Footer";
import { getPublishedBuilds } from "@/lib/queries";
import DiscoverClient from "./DiscoverClient";

export default async function DiscoverPage() {
  const builds = await getPublishedBuilds(50);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">
              Discover Builds
            </h1>
            <p className="text-[15px] text-[#64748B]">
              Browse by style, make, or search for something specific.
            </p>
          </div>
          <DiscoverClient initialBuilds={builds} />
        </div>
      </main>
      <Footer />
    </>
  );
}
