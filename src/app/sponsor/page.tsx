import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SponsorClient from "./SponsorClient";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sponsor — WhipSpec",
  description: "Put your brand in front of Australia's most engaged automotive audience. Dynamic pricing based on real platform engagement.",
};

export default function SponsorPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Sponsor</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-4">
              Put your gear where<br />builders are looking.
            </h1>
            <p className="text-[15px] text-[#64748B] max-w-lg mx-auto">
              Sponsor placements on WhipSpec. Minimum daily spend adjusts automatically based on platform engagement — more eyeballs, higher floor.
            </p>
          </div>

          <SponsorClient />

          {/* How dynamic pricing works */}
          <div className="mt-16 bg-[#F8FAFC] rounded-2xl border border-slate-100 p-8 md:p-10">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] tracking-tight mb-6">
              How pricing works
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Dynamic floor</h3>
                <p className="text-[13px] text-[#64748B]">
                  Every placement has a minimum daily spend. This floor rises as the platform grows — early sponsors lock in the lowest rates.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12l2 2 4-4"/></svg>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Pay what you set</h3>
                <p className="text-[13px] text-[#64748B]">
                  Set a daily budget above the floor. Higher budgets get more impressions. No lock-in — pause or cancel anytime.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
                </div>
                <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Real metrics</h3>
                <p className="text-[13px] text-[#64748B]">
                  Track impressions, clicks, and spend in real time. Floor prices are recalculated daily based on actual platform engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
