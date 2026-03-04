"use client";

import { useState } from "react";
import type { BrandRow } from "@/lib/queries";

const CATEGORIES = ["All", "Protection", "Recovery", "Suspension", "Roof Racks", "Canopies", "Lighting", "Electrical", "Comms", "Intake", "Towing", "Touring", "Wheels", "Tyres", "Exhaust", "Tune"];

function BrandLogo({ name, logoUrl, website }: { name: string; logoUrl?: string; website?: string }) {
  const [attempt, setAttempt] = useState(0);

  // Try: 1) Clearbit logo, 2) Google S2 favicon, 3) initials fallback
  const domain = website?.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const sources = [
    logoUrl,
    domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null,
  ].filter(Boolean) as string[];

  if (attempt < sources.length) {
    return (
      <img
        src={sources[attempt]}
        alt={name}
        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100 p-0.5"
        onError={() => setAttempt(a => a + 1)}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F172A] to-[#1E293B] flex items-center justify-center text-white text-sm font-bold border border-slate-100">
      {name.charAt(0)}
    </div>
  );
}

export default function BrandsClient({ initialBrands }: { initialBrands: BrandRow[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = initialBrands.filter((b) => {
    const matchCat = category === "All" || b.category === category;
    const matchSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || (b.description && b.description.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brands..."
          className="w-full max-w-md mx-auto block border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
        />
        <div className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-[13px] transition-all ${
                category === c
                  ? "bg-[#0F172A] text-white"
                  : "bg-slate-100 text-[#64748B] hover:bg-slate-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-slate-100">
          <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
            {initialBrands.length === 0 ? "No brands listed yet" : "No brands match your filter"}
          </h3>
          <p className="text-[14px] text-[#64748B] max-w-sm mx-auto">
            {initialBrands.length === 0
              ? "Brands appear when creators tag them on builds. The directory grows with every build spec published."
              : "Try a different search or category."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <BrandLogo name={b.name} logoUrl={b.logo_url} website={b.website} />
                <div>
                  <h3 className="text-[14px] font-semibold text-[#0F172A]">{b.name}</h3>
                  {b.category && <p className="text-[11px] text-[#94A3B8]">{b.category}</p>}
                </div>
              </div>
              {b.description && <p className="text-[12px] text-[#64748B] mb-1.5 line-clamp-2">{b.description}</p>}
              {b.website && (
                <a href={`https://${b.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#1E6DF0] hover:text-[#3B82F6] inline-block">{b.website.replace(/^https?:\/\//, "")}</a>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
