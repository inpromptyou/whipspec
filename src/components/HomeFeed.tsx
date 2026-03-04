"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface Build {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; style: string; hero_image: string; creator_name: string;
  creator_avatar: string; views: number; created_at: string;
}

const TABS = ["Latest Builds", "Most Popular", "Trending This Week", "4WD / Touring", "Street", "Stance", "Show"];

const BRAND_CHIPS = [
  "ARB", "STEDI", "Redarc", "Old Man Emu", "Rhino-Rack", "BFGoodrich",
  "Method", "Tough Dog", "Ironman 4x4", "Lightforce", "Maxtrax",
  "Bilstein", "Darche", "Engel", "WARN", "Mickey Thompson",
];

export default function HomeFeed() {
  const { user } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Latest Builds");
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fetch("/api/auth/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (data.avatar_url) setAvatarUrl(data.avatar_url);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // Load avatar from user if available
    if (user) {
      fetch("/api/auth/me").then(r => r.json()).then(d => {
        if (d.user?.avatar_url) setAvatarUrl(d.user.avatar_url);
      }).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams();
    // Map tabs to API params
    if (activeTab === "Most Popular") params.set("sort", "views");
    if (activeTab === "4WD / Touring") params.set("style", "4WD / Touring");
    if (activeTab === "Street") params.set("style", "Street");
    if (activeTab === "Stance") params.set("style", "Stance");
    if (activeTab === "Show") params.set("style", "Show");

    setLoading(true);
    fetch(`/api/builds?${params}`)
      .then((r) => r.json())
      .then((d) => setBuilds(d.builds || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTab]);

  const toggleBrand = (brand: string) => {
    setActiveBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Profile section */}
      <div className="text-center pt-20 sm:pt-28 pb-6 sm:pb-8 border-b border-slate-100 px-4">
        <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        <button
          onClick={() => avatarInputRef.current?.click()}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-3 sm:mb-4 group"
          title="Change profile photo"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#1E6DF0] to-[#3B82F6] flex items-center justify-center text-white text-xl sm:text-2xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </button>
        <p className="text-[14px] text-[#64748B]">
          Built by
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-[#0F172A] tracking-tight mt-0.5">
          {(user as unknown as { username?: string }).username
            ? `@${(user as unknown as { username?: string }).username}`
            : user.name
          }
        </h1>
        <div className="flex items-center justify-center gap-3 mt-4">
          <Link
            href="/dashboard"
            className="inline-block border border-[#0F172A] text-[#0F172A] text-[12px] font-semibold uppercase tracking-[0.15em] px-5 py-2 hover:bg-[#0F172A] hover:text-white transition-colors"
          >
            My Dashboard
          </Link>
          {(user as unknown as { username?: string }).username && (
            <button
              onClick={() => navigator.clipboard.writeText(`https://whipspec.com/@${(user as unknown as { username?: string }).username}`)}
              className="inline-flex items-center gap-1.5 border border-slate-200 text-[#64748B] text-[12px] font-semibold uppercase tracking-[0.15em] px-4 py-2 hover:border-[#1E6DF0] hover:text-[#1E6DF0] transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
              Share Profile
            </button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-3 sm:px-5">
          <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto py-2.5 sm:py-3 -mb-px scrollbar-hide">
            <div className="shrink-0 pr-2 sm:pr-3 border-r border-slate-200 mr-2 sm:mr-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[12px] sm:text-[13px] whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab
                    ? "border-[#0F172A] text-[#0F172A] font-medium"
                    : "border-transparent text-[#94A3B8] hover:text-[#475569]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Brand chips - scrollable */}
      <div className="border-b border-slate-100 bg-[#FAFBFC]">
        <div className="max-w-6xl mx-auto px-3 sm:px-5">
          <div ref={chipScrollRef} className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 sm:py-3 scrollbar-hide">
            {BRAND_CHIPS.map((brand) => {
              const active = activeBrands.includes(brand);
              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    active
                      ? "bg-[#0F172A] text-white"
                      : "bg-white border border-slate-200 text-[#475569] hover:border-slate-300"
                  }`}
                >
                  {brand}
                  {active && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  )}
                </button>
              );
            })}
            <button className="shrink-0 text-[12px] text-[#1E6DF0] font-medium px-2 hover:text-[#1557CC]">
              Show All
            </button>
          </div>
        </div>
      </div>

      {/* Build grid */}
      <div className="max-w-6xl mx-auto px-3 sm:px-5 py-5 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-slate-100 rounded-lg" />
                <div className="mt-2 space-y-1.5">
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                  <div className="h-2.5 bg-slate-50 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : builds.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">No builds yet</h3>
            <p className="text-[14px] text-[#64748B] max-w-md mx-auto mb-6">
              Be the first to share a build. Your spec sheet will appear right here in the feed.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors"
            >
              Create a build
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {builds.map((b) => (
              <Link key={b.id} href={`/build/${b.slug}`} className="group">
                <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                  {b.hero_image ? (
                    <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                    </div>
                  )}
                  {b.style && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-[#0F172A]">
                      {b.style}
                    </span>
                  )}
                </div>
                <div className="mt-2.5">
                  <h3 className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors line-clamp-1">
                    {b.title}
                  </h3>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">
                    {[b.year, b.make, b.model].filter(Boolean).join(" ")}
                  </p>
                  {b.creator_name && (
                    <p className="text-[11px] text-[#CBD5E1] mt-0.5">
                      by {b.creator_name}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
