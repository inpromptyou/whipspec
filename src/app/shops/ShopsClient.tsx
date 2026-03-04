"use client";

import { useState } from "react";
import Link from "next/link";
import AuthButton from "@/components/AuthButton";
import type { ShopRow } from "@/lib/queries";

export default function ShopsClient({ initialShops }: { initialShops: ShopRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = initialShops.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.location && s.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search shops by name or location..."
          className="w-full max-w-md mx-auto block border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-slate-100">
          <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
            {initialShops.length === 0 ? "No shops listed yet" : "No shops match your search"}
          </h3>
          <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">
            {initialShops.length === 0
              ? "Shops get added when creators tag them on builds. Know a great workshop? Tell them about WhipSpec."
              : "Try a different search term."}
          </p>
          {initialShops.length === 0 && (
            <AuthButton href="/dashboard" className="inline-flex items-center bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
              Claim your shop
            </AuthButton>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Link key={s.id} href={`/shop/${s.slug}`} className="group">
              <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{s.name}</h3>
                    {s.location && <p className="text-[13px] text-[#94A3B8] mt-0.5">{s.location}</p>}
                  </div>
                  {s.claimed && (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                      Claimed
                    </span>
                  )}
                </div>
                {s.description && <p className="text-[13px] text-[#64748B] line-clamp-2 mb-3">{s.description}</p>}
                {s.services && s.services.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.services.slice(0, 3).map((svc) => (
                      <span key={svc} className="text-[11px] text-[#64748B] bg-slate-50 px-2 py-0.5 rounded-full">{svc}</span>
                    ))}
                  </div>
                )}
                {s.build_count > 0 && (
                  <p className="text-[11px] text-[#94A3B8] mt-3">Featured on {s.build_count} build{s.build_count !== 1 ? "s" : ""}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
