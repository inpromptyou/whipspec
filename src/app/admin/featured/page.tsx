"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Shop {
  id: number;
  name: string;
  slug: string;
  location: string;
  claimed: boolean;
  verified: boolean;
  featured_until: string | null;
  user_id: number;
}

export default function AdminFeatured() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/shops")
      .then((r) => r.json())
      .then((d) => { setShops(d.shops || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleFeatured = async (shopId: number, featured: boolean) => {
    try {
      const res = await fetch("/api/admin/shops", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop_id: shopId,
          verified: featured,
          featured_until: featured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShops(shops.map((s) => s.id === shopId ? { ...s, verified: featured } : s));
        setMsg(featured ? "Shop marked as Featured" : "Featured status removed");
      } else {
        setMsg(data.error || "Failed");
      }
    } catch { setMsg("Network error"); }
  };

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#0F172A]">Featured Shops</h1>
              <p className="text-[13px] text-[#64748B] mt-1">Manage featured shop listings ($49.99/mo each)</p>
            </div>
            <Link href="/admin" className="text-[12px] font-medium text-[#64748B] hover:text-[#0F172A]">Back to admin</Link>
          </div>

          {msg && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-600">{msg}</div>}

          {loading ? (
            <div className="text-center py-12 text-[#94A3B8]">Loading...</div>
          ) : shops.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-[#64748B]">No claimed shops yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shops.map((shop) => (
                <div key={shop.id} className={`bg-white rounded-xl border p-5 ${shop.verified ? "border-[#1E6DF0]/30" : "border-slate-100"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/shop/${shop.slug}`} className="text-[15px] font-semibold text-[#0F172A] hover:text-[#1E6DF0]">
                          {shop.name}
                        </Link>
                        {shop.verified && (
                          <span className="text-[10px] font-semibold bg-[#1E6DF0] text-white px-2 py-0.5 rounded-full">FEATURED</span>
                        )}
                        {shop.claimed && (
                          <span className="text-[10px] font-medium bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Claimed</span>
                        )}
                      </div>
                      {shop.location && <p className="text-[13px] text-[#64748B] mt-0.5">{shop.location}</p>}
                    </div>
                    <button
                      onClick={() => toggleFeatured(shop.id, !shop.verified)}
                      className={`text-[12px] font-medium px-4 py-2 rounded-lg transition-colors ${
                        shop.verified
                          ? "bg-red-50 text-red-600 hover:bg-red-100"
                          : "bg-[#1E6DF0] text-white hover:bg-[#1557CC]"
                      }`}
                    >
                      {shop.verified ? "Remove Featured" : "Mark Featured"}
                    </button>
                  </div>
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
