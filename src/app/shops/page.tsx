"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ShopCardSkeleton } from "@/components/Skeleton";
import AuthButton from "@/components/AuthButton";

interface Shop {
  id: number; name: string; slug: string; description: string; location: string;
  services: string[]; claimed: boolean; hero_image: string; build_count: number;
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    fetch(`/api/shops?${params}`)
      .then((r) => r.json())
      .then((d) => setShops(d.shops || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">Shops</h1>
            <p className="text-[15px] text-[#64748B] max-w-lg mx-auto">
              The workshops, installers, and specialists behind Australia&rsquo;s best builds.
            </p>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search shops by name or location..."
              className="w-full max-w-md mx-auto block border border-slate-200 rounded-lg px-4 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
            />
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{Array.from({length:6}).map((_,i) => <ShopCardSkeleton key={i} />)}</div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">No shops listed yet</h3>
              <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">
                Shops get added when creators tag them on builds. Know a great workshop? Tell them about WhipSpec.
              </p>
              <AuthButton href="/dashboard" className="inline-flex items-center bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
                Claim your shop
              </AuthButton>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shops.map((s) => (
                <Link key={s.id} href={`/shop/${s.slug}`} className="group">
                  <div className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[15px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{s.name}</h3>
                      {s.claimed && (
                        <span className="px-2 py-0.5 rounded-full bg-[#1E6DF0]/[0.08] text-[#1E6DF0] text-[10px] font-semibold shrink-0">Claimed</span>
                      )}
                    </div>
                    {s.location && <p className="text-[13px] text-[#94A3B8] mb-2">{s.location}</p>}
                    {s.services && s.services.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {s.services.slice(0, 4).map((sv) => (
                          <span key={sv} className="px-2 py-0.5 rounded-full bg-slate-50 text-[11px] text-[#64748B]">{sv}</span>
                        ))}
                        {s.services.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-50 text-[11px] text-[#94A3B8]">+{s.services.length - 4}</span>
                        )}
                      </div>
                    )}
                    {s.build_count > 0 && (
                      <p className="text-[12px] text-[#94A3B8]">Featured on {s.build_count} build{s.build_count !== 1 ? "s" : ""}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
