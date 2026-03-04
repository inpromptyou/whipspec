"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Build {
  id: number; title: string; slug: string; make: string; model: string; year: number;
  description: string; style: string; location: string; hero_image: string;
  creator_name: string; creator_avatar: string; views: number; created_at: string;
}
interface Mod {
  id: number; category: string; brand: string; product_name: string;
  shop_name: string; shop_slug: string; shop_display_name: string; link: string; notes: string;
}

export default function BuildPage() {
  const { slug } = useParams<{ slug: string }>();
  const [build, setBuild] = useState<Build | null>(null);
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/builds/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setBuild(d.build); setMods(d.mods || []); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <><Nav /><div className="min-h-screen flex items-center justify-center"><p className="text-sm text-[#94A3B8]">Loading...</p></div></>
  );

  if (notFound || !build) return (
    <><Nav /><div className="min-h-screen flex items-center justify-center text-center px-5">
      <div><h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] mb-2">Build not found</h1>
      <p className="text-[14px] text-[#64748B] mb-6">This build may have been removed or the link is incorrect.</p>
      <Link href="/discover" className="text-[#1E6DF0] text-sm font-medium">Browse all builds</Link></div>
    </div><Footer /></>
  );

  const vehicle = [build.year, build.make, build.model].filter(Boolean).join(" ");
  const modCategories = [...new Set(mods.map((m) => m.category))];

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* Hero */}
        <div className="relative aspect-[21/9] max-h-[480px] bg-slate-100">
          {build.hero_image ? (
            <img src={build.hero_image} alt={build.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-20">
          {/* Title block */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 p-6 md:p-8 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#0F172A] tracking-tight">{build.title}</h1>
                {vehicle && <p className="text-[15px] text-[#64748B] mt-1">{vehicle}</p>}
              </div>
              <div className="flex gap-2">
                {build.style && (
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-[12px] font-medium text-[#64748B]">{build.style}</span>
                )}
                {build.location && (
                  <span className="px-3 py-1 rounded-full bg-slate-50 text-[12px] text-[#94A3B8]">{build.location}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 text-[13px] text-[#94A3B8]">
              <span>by {build.creator_name}</span>
              <span>{build.views} views</span>
            </div>

            {build.description && (
              <p className="text-[14px] text-[#475569] leading-relaxed mt-4 border-t border-slate-100 pt-4">{build.description}</p>
            )}
          </div>

          {/* Mods */}
          {mods.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
              <h2 className="text-[17px] font-semibold text-[#0F172A] mb-5">Build Spec</h2>
              {modCategories.map((cat) => (
                <div key={cat} className="mb-6 last:mb-0">
                  <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.15em] mb-3">{cat}</h3>
                  <div className="space-y-2">
                    {mods.filter((m) => m.category === cat).map((m) => (
                      <div key={m.id} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-[14px] text-[#0F172A]">
                            {m.brand && <span className="font-medium">{m.brand} </span>}
                            {m.product_name}
                          </p>
                          {(m.shop_display_name || m.shop_name) && (
                            <p className="text-[12px] text-[#94A3B8] mt-0.5">
                              Installed by{" "}
                              {m.shop_slug ? (
                                <Link href={`/shop/${m.shop_slug}`} className="text-[#1E6DF0] hover:text-[#3B82F6]">
                                  {m.shop_display_name || m.shop_name}
                                </Link>
                              ) : (
                                m.shop_display_name || m.shop_name
                              )}
                            </p>
                          )}
                          {m.notes && <p className="text-[12px] text-[#94A3B8] mt-0.5">{m.notes}</p>}
                        </div>
                        {m.link && (
                          <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-[12px] text-[#1E6DF0] hover:text-[#3B82F6] font-medium shrink-0 ml-4">
                            View part
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 p-8 text-center mb-6">
              <p className="text-[14px] text-[#64748B]">No mods tagged yet. The creator will add the full spec soon.</p>
            </div>
          )}

          {/* Share */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
            <p className="text-[13px] text-[#64748B] mb-3">Share this build spec</p>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-[#0F172A] text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Copy link
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
