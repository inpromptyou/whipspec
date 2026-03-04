"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface SearchResults {
  builds: Array<{ id: number; title: string; slug: string; make: string; model: string; hero_image: string }>;
  shops: Array<{ id: number; name: string; slug: string; location: string }>;
  brands: Array<{ id: number; name: string; slug: string; category: string; logo_url: string }>;
  users: Array<{ id: number; name: string; username: string; avatar_url: string }>;
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (q.length < 2) { setResults(null); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
      } catch { setResults(null); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timerRef.current);
  }, [q]);

  const total = results ? results.builds.length + results.shops.length + results.brands.length + results.users.length : 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-slate-100 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
        aria-label="Search"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-[90vw] max-w-[420px] bg-white rounded-xl border border-slate-100 shadow-2xl z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" className="absolute left-3 top-1/2 -translate-y-1/2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search builds, shops, brands, people..."
                className="w-full pl-9 pr-3 py-2.5 text-[14px] bg-slate-50 rounded-lg border-0 text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading && <p className="text-center py-4 text-[12px] text-[#94A3B8]">Searching...</p>}

            {!loading && results && total === 0 && (
              <p className="text-center py-6 text-[13px] text-[#94A3B8]">No results for &ldquo;{q}&rdquo;</p>
            )}

            {results && results.users.length > 0 && (
              <div className="p-2">
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">People</p>
                {results.users.map((u) => (
                  <Link key={u.id} href={`/user/@${u.username}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E6DF0] to-[#3B82F6] flex items-center justify-center text-white text-[11px] font-semibold overflow-hidden">
                      {u.avatar_url ? <img src={u.avatar_url} alt={u.name} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0F172A]">{u.name}</p>
                      <p className="text-[11px] text-[#94A3B8]">@{u.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {results && results.builds.length > 0 && (
              <div className="p-2 border-t border-slate-50">
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">Builds</p>
                {results.builds.map((b) => (
                  <Link key={b.id} href={`/build/${b.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                      {b.hero_image ? <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full" />}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0F172A] line-clamp-1">{b.title}</p>
                      <p className="text-[11px] text-[#94A3B8]">{[b.make, b.model].filter(Boolean).join(" ")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {results && results.shops.length > 0 && (
              <div className="p-2 border-t border-slate-50">
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">Shops</p>
                {results.shops.map((s) => (
                  <Link key={s.id} href={`/shop/${s.slug}`} onClick={() => setOpen(false)} className="block px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <p className="text-[13px] font-medium text-[#0F172A]">{s.name}</p>
                    {s.location && <p className="text-[11px] text-[#94A3B8]">{s.location}</p>}
                  </Link>
                ))}
              </div>
            )}

            {results && results.brands.length > 0 && (
              <div className="p-2 border-t border-slate-50">
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">Brands</p>
                {results.brands.map((b) => (
                  <Link key={b.id} href="/brands" onClick={() => setOpen(false)} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {b.logo_url ? <img src={b.logo_url} alt={b.name} className="w-6 h-6 object-contain" /> : <span className="text-[11px] font-bold text-[#64748B]">{b.name.charAt(0)}</span>}
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-[#0F172A]">{b.name}</p>
                      {b.category && <p className="text-[11px] text-[#94A3B8]">{b.category}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
