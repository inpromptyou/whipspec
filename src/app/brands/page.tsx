"use client";

import { useState, useEffect } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { BrandCardSkeleton } from "@/components/Skeleton";

interface Brand {
  id: number; name: string; slug: string; description: string; category: string;
  website: string; logo_url: string; build_count: number;
}

function BrandLogo({ name, logoUrl }: { name: string; logoUrl?: string }) {
  const [failed, setFailed] = useState(false);
  if (logoUrl && !failed) {
    return (
      <img
        src={logoUrl}
        alt={name}
        className="w-10 h-10 rounded-lg object-contain bg-white border border-slate-100"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-[#64748B] text-sm font-bold border border-slate-100">
      {name.charAt(0)}
    </div>
  );
}

const CATEGORIES = ["All", "Protection", "Recovery", "Suspension", "Roof Racks", "Canopies", "Lighting", "Electrical", "Comms", "Intake", "Towing", "Touring", "Wheels", "Tyres", "Exhaust", "Tune"];

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("q", search);
    fetch(`/api/brands?${params}`)
      .then((r) => r.json())
      .then((d) => setBrands(d.brands || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search]);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">Brands</h1>
            <p className="text-[15px] text-[#64748B]">The parts and products behind the builds.</p>
          </div>

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

          {loading ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i) => <BrandCardSkeleton key={i} />)}</div>
          ) : brands.length === 0 ? (
            <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">No brands listed yet</h3>
              <p className="text-[14px] text-[#64748B] max-w-sm mx-auto">
                Brands appear when creators tag them on builds. The directory grows with every build spec published.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {brands.map((b) => (
                <div key={b.id} className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-slate-100/50 transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <BrandLogo name={b.name} logoUrl={b.logo_url} />
                    <div>
                      <h3 className="text-[14px] font-semibold text-[#0F172A]">{b.name}</h3>
                      {b.category && <p className="text-[11px] text-[#94A3B8]">{b.category}</p>}
                    </div>
                  </div>
                  {b.build_count > 0 && (
                    <p className="text-[12px] text-[#94A3B8]">Used in {b.build_count} build{b.build_count !== 1 ? "s" : ""}</p>
                  )}
                  {b.description && <p className="text-[12px] text-[#64748B] mb-1.5 line-clamp-2">{b.description}</p>}
                  {b.website && (
                    <a href={`https://${b.website.replace(/^https?:\/\//, "")}`} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#1E6DF0] hover:text-[#3B82F6] inline-block">{b.website.replace(/^https?:\/\//, "")}</a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
