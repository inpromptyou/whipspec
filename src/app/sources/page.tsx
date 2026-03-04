import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sources — WhipSpec",
  description: "Sources and methodology behind the market statistics cited on WhipSpec.",
};

const SOURCES = [
  {
    stat: "$58 billion",
    context: "Australian automotive aftermarket industry contribution",
    source: "Australian Automotive Aftermarket Association (AAAA)",
    citation: "AAAA Industry Report, citing ATO data 2020-2021",
    url: "https://www.aaaa.com.au",
    updated: "2024",
  },
  {
    stat: "300,000+",
    context: "Australians employed in the automotive aftermarket",
    source: "Australian Automotive Aftermarket Association (AAAA)",
    citation: "AAAA Industry Overview",
    url: "https://www.aaaa.com.au",
    updated: "2024",
  },
  {
    stat: "19.7 million",
    context: "Registered vehicles on Australian roads (car parc)",
    source: "Bureau of Infrastructure and Transport Research Economics (BITRE)",
    citation: "BITRE Statistical Report, Australian Government",
    url: "https://www.bitre.gov.au",
    updated: "2024",
  },
  {
    stat: "50,000+",
    context: "Automotive businesses operating in Australia",
    source: "Australian Automotive Aftermarket Association (AAAA)",
    citation: "AAAA Industry Overview, derived from ABS Business Counts",
    url: "https://www.aaaa.com.au",
    updated: "2024",
  },
];

export default function SourcesPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">
              Sources
            </h1>
            <p className="text-[15px] text-[#64748B] leading-relaxed">
              WhipSpec cites industry statistics to provide context about the Australian automotive aftermarket.
              We are committed to accuracy and transparency. Below are the sources behind the figures used across the site.
            </p>
          </div>

          <div className="space-y-6">
            {SOURCES.map((s) => (
              <div key={s.stat} className="bg-white rounded-xl border border-slate-100 p-5 md:p-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-xl font-semibold text-[#0F172A]">{s.stat}</span>
                  <span className="text-[13px] text-[#64748B]">{s.context}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[13px] text-[#475569]">
                    <span className="font-medium">Source:</span>{" "}
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#1E6DF0] hover:text-[#3B82F6]">
                      {s.source}
                    </a>
                  </p>
                  <p className="text-[12px] text-[#94A3B8]">{s.citation}</p>
                  <p className="text-[12px] text-[#94A3B8]">Last verified: {s.updated}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-[#F8FAFC] rounded-xl border border-slate-100 p-5 md:p-6">
            <h2 className="text-[15px] font-semibold text-[#0F172A] mb-2">Update policy</h2>
            <p className="text-[13px] text-[#64748B] leading-relaxed">
              We review cited statistics annually and update them when new data is published by the source organisations.
              If you believe a figure is outdated or incorrect, please contact us at{" "}
              <a href="mailto:hello@whipspec.com" className="text-[#1E6DF0]">hello@whipspec.com</a>.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
