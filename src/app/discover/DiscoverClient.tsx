"use client";

import { useState } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import type { BuildRow } from "@/lib/queries";

const STYLES = ["All", "Stance", "Track", "Street", "4WD / Touring", "Show", "Drift", "Daily"];

export default function DiscoverClient({ initialBuilds }: { initialBuilds: BuildRow[] }) {
  const [builds, setBuilds] = useState(initialBuilds);
  const [search, setSearch] = useState("");
  const [style, setStyle] = useState("All");
  const [loading, setLoading] = useState(false);

  const handleFilter = (newStyle: string) => {
    setStyle(newStyle);
    fetchFiltered(newStyle, search);
  };

  const handleSearch = (q: string) => {
    setSearch(q);
    fetchFiltered(style, q);
  };

  const fetchFiltered = (s: string, q: string) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (s !== "All") params.set("style", s);
    if (q) params.set("q", q);
    fetch(`/api/builds?${params}`)
      .then((r) => r.json())
      .then((d) => setBuilds(d.builds || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  return (
    <>
      {/* Search + Filters */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search builds, makes, models..."
          className="w-full max-w-md mx-auto block border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
        />
        <div className="flex flex-wrap justify-center gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => handleFilter(s)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all ${
                style === s
                  ? "bg-[#0F172A] text-white"
                  : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 overflow-hidden animate-pulse">
              <div className="aspect-[16/10] bg-slate-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-50 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : builds.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl bg-[#1E6DF0]/[0.06] flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          </div>
          <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">No builds yet</h3>
          <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">
            Be the first to publish a build spec on WhipSpec.
          </p>
          <AuthButton href="/dashboard" className="inline-flex items-center justify-center bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
            Create a build
          </AuthButton>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {builds.map((b) => (
            <Link key={b.id} href={`/build/${b.slug}`} className="group">
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-100/50 transition-all">
                <div className="aspect-[16/10] bg-slate-100 relative">
                  {b.hero_image ? (
                    <img src={b.hero_image} alt={b.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#CBD5E1]">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                  )}
                  {b.style && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-medium text-[#0F172A]">
                      {b.style}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-[15px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">
                    {b.title}
                  </h3>
                  <p className="text-[13px] text-[#94A3B8] mt-1">
                    {[b.year, b.make, b.model].filter(Boolean).join(" ") || "Vehicle details pending"}
                    {b.creator_name && ` · by ${b.creator_name}`}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
