"use client";

import { useState, useEffect, useRef } from "react";

interface TaggedShop {
  shop_name: string;
  address: string;
  phone: string;
  website: string;
  shop_id?: number;
  google_place_id?: string;
}

interface ExistingShop {
  id: number;
  name: string;
  slug: string;
  location: string;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export default function ShopTagger({
  shops,
  onChange,
  inputClass,
}: {
  shops: TaggedShop[];
  onChange: (shops: TaggedShop[]) => void;
  inputClass: string;
}) {
  const addShop = () => onChange([...shops, { shop_name: "", address: "", phone: "", website: "" }]);
  const removeShop = (i: number) => onChange(shops.filter((_, j) => j !== i));
  const updateShop = (i: number, field: string, val: string | number) => {
    const updated = [...shops];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (updated[i] as any)[field] = val;
    onChange(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider">Tag shops</label>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Credit the shops that did the work. They&apos;ll be invited to claim their profile.</p>
        </div>
        <button type="button" onClick={addShop} className="inline-flex items-center gap-1 text-[12px] font-medium text-[#1E6DF0] hover:text-[#1557CC]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
          Tag a shop
        </button>
      </div>
      {shops.map((shop, i) => (
        <ShopTagCard
          key={i}
          index={i}
          shop={shop}
          onUpdate={(field, val) => updateShop(i, field, val)}
          onRemove={() => removeShop(i)}
          inputClass={inputClass}
        />
      ))}
    </div>
  );
}

function ShopTagCard({
  index,
  shop,
  onUpdate,
  onRemove,
  inputClass,
}: {
  index: number;
  shop: TaggedShop;
  onUpdate: (field: keyof TaggedShop, val: string | number) => void;
  onRemove: () => void;
  inputClass: string;
}) {
  const [query, setQuery] = useState(shop.shop_name);
  const [results, setResults] = useState<ExistingShop[]>([]);
  const [placesResults, setPlacesResults] = useState<PlacePrediction[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults([]); setPlacesResults([]); return; }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setSearching(true);

      // Search existing registered shops
      try {
        const res = await fetch(`/api/shops?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.shops?.slice(0, 5) || []);
      } catch { setResults([]); }

      // Search Google Places (if API key configured)
      try {
        const res = await fetch(`/api/places/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setPlacesResults(data.predictions?.slice(0, 5) || []);
      } catch { setPlacesResults([]); }

      setSearching(false);
      setShowDropdown(true);
    }, 400);
    return () => clearTimeout(timerRef.current);
  }, [query]);

  const selectExistingShop = (s: ExistingShop) => {
    setQuery(s.name);
    onUpdate("shop_name", s.name);
    onUpdate("shop_id", s.id);
    onUpdate("address", s.location || "");
    setShowDropdown(false);
  };

  const selectPlace = async (p: PlacePrediction) => {
    setQuery(p.structured_formatting.main_text);
    onUpdate("shop_name", p.structured_formatting.main_text);
    onUpdate("google_place_id", p.place_id);
    setShowDropdown(false);

    // Fetch place details
    try {
      const res = await fetch(`/api/places/details?place_id=${p.place_id}`);
      const data = await res.json();
      if (data.result) {
        if (data.result.formatted_address) onUpdate("address", data.result.formatted_address);
        if (data.result.formatted_phone_number) onUpdate("phone", data.result.formatted_phone_number);
        if (data.result.website) onUpdate("website", data.result.website);
      }
    } catch { /* place details optional */ }
  };

  const hasResults = results.length > 0 || placesResults.length > 0;

  return (
    <div className="bg-[#F8FAFC] rounded-xl border border-slate-100 p-4 mb-3">
      <div className="flex justify-between items-center mb-3">
        <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Shop {index + 1}</span>
        <button type="button" onClick={onRemove} className="text-[11px] text-red-400 hover:text-red-500 font-medium">Remove</button>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {/* Shop name with autocomplete */}
        <div className="relative sm:col-span-2" ref={wrapRef}>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); onUpdate("shop_name", e.target.value); }}
            placeholder="Search shop name..."
            className={inputClass}
          />
          {searching && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#1E6DF0] border-t-transparent rounded-full animate-spin" />}

          {showDropdown && hasResults && (
            <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
              {results.length > 0 && (
                <div className="p-1.5">
                  <p className="text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">On WhipSpec</p>
                  {results.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectExistingShop(s)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <p className="text-[13px] font-medium text-[#0F172A]">{s.name}</p>
                      {s.location && <p className="text-[11px] text-[#94A3B8]">{s.location}</p>}
                    </button>
                  ))}
                </div>
              )}
              {placesResults.length > 0 && (
                <div className="p-1.5 border-t border-slate-50">
                  <p className="text-[9px] font-semibold text-[#94A3B8] uppercase tracking-wider px-2 mb-1">From Google Maps</p>
                  {placesResults.map((p) => (
                    <button
                      key={p.place_id}
                      type="button"
                      onClick={() => selectPlace(p)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <p className="text-[13px] font-medium text-[#0F172A]">{p.structured_formatting.main_text}</p>
                      <p className="text-[11px] text-[#94A3B8]">{p.structured_formatting.secondary_text}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <input type="text" value={shop.address} onChange={(e) => onUpdate("address", e.target.value)} placeholder="Address / suburb" className={inputClass} />
        <input type="text" value={shop.phone} onChange={(e) => onUpdate("phone", e.target.value)} placeholder="Phone (optional)" className={inputClass} />
        <input type="text" value={shop.website} onChange={(e) => onUpdate("website", e.target.value)} placeholder="Website (optional)" className={inputClass} />
      </div>

      {shop.shop_id && (
        <p className="text-[10px] text-green-600 mt-2 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          Registered shop — will be linked directly
        </p>
      )}
      {shop.google_place_id && !shop.shop_id && (
        <p className="text-[10px] text-[#1E6DF0] mt-2 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z"/></svg>
          From Google Maps — details auto-filled
        </p>
      )}
    </div>
  );
}
