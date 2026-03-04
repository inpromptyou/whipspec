import type { Metadata } from "next";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Builds — WhipSpec",
  description: "Every tagged build on WhipSpec. See the full spec sheets behind the best Australian car builds.",
};
import Footer from "@/components/Footer";
import { getPublishedBuilds } from "@/lib/queries";
import BuildsClient from "./BuildsClient";

export default async function BuildsPage() {
  const builds = await getPublishedBuilds(50);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <BuildsClient initialBuilds={builds} />
        </div>
      </main>
      <Footer />
    </>
  );
}
