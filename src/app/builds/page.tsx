"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Build {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; style: string; hero_image: string; creator_name: string; views: number; created_at: string;
}

export default function BuildsPage() {
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/builds?limit=100")
      .then((r) => r.json())
      .then((d) => setBuilds(d.builds || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-1">Builds</h1>
              <p className="text-[14px] text-[#64748B]">Every tagged build on WhipSpec.</p>
            </div>
            <Link href="/dashboard" className="hidden sm:inline-flex items-center bg-[#0F172A] text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
              Add your build
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-[#94A3B8] text-sm py-20">Loading...</p>
          ) : builds.length === 0 ? (
            <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">No builds published yet</h3>
              <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">
                Be the first to share your build on WhipSpec. Upload photos, tag your mods, and share your spec.
              </p>
              <Link href="/dashboard" className="inline-flex items-center bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
                Create a build
              </Link>
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
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-[11px] font-medium text-[#0F172A]">{b.style}</span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{b.title}</h3>
                      <p className="text-[13px] text-[#94A3B8] mt-1">
                        {[b.year, b.make, b.model].filter(Boolean).join(" ") || "Details pending"}
                        {b.creator_name && ` · ${b.creator_name}`}
                      </p>
                    </div>
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
