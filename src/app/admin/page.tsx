"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Stats {
  totalUsers: number;
  creators: number;
  shops: number;
  totalBuilds: number;
  totalViews: number;
  pendingTags: number;
  claimedShops: number;
  proSubscribers: number;
  featuredShops: number;
  proMRR: number;
  featuredMRR: number;
  totalMRR: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <>
      <Nav />
      <main className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-5 text-center py-20 text-[#94A3B8]">Loading...</div>
      </main>
    </>
  );

  if (!stats) return (
    <>
      <Nav />
      <main className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-5 text-center py-20 text-red-500">Failed to load admin stats. Are you an admin?</div>
      </main>
    </>
  );

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#0F172A]">Admin Dashboard</h1>
              <p className="text-[13px] text-[#64748B] mt-1">WhipSpec platform overview</p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/shop-tags" className="text-[12px] font-medium bg-white border border-slate-200 text-[#0F172A] px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
                Shop Tags ({stats.pendingTags})
              </Link>
              <Link href="/admin/featured" className="text-[12px] font-medium bg-[#1E6DF0] text-white px-4 py-2 rounded-lg hover:bg-[#1557CC] transition-colors">
                Featured Shops
              </Link>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-4">Monthly Recurring Revenue</h2>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-semibold text-white">${stats.totalMRR.toFixed(2)}</p>
                <p className="text-[12px] text-[#64748B] mt-1">Total MRR</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">${stats.proMRR.toFixed(2)}</p>
                <p className="text-[12px] text-[#64748B] mt-1">Creator Plus ({stats.proSubscribers} subs)</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-white">${stats.featuredMRR.toFixed(2)}</p>
                <p className="text-[12px] text-[#64748B] mt-1">Featured Shops ({stats.featuredShops})</p>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Users", value: stats.totalUsers, color: "text-[#0F172A]" },
              { label: "Creators", value: stats.creators, color: "text-[#1E6DF0]" },
              { label: "Claimed Shops", value: stats.claimedShops, color: "text-green-600" },
              { label: "Total Builds", value: stats.totalBuilds, color: "text-[#0F172A]" },
              { label: "Total Build Views", value: stats.totalViews.toLocaleString(), color: "text-[#0F172A]" },
              { label: "Pending Shop Tags", value: stats.pendingTags, color: stats.pendingTags > 0 ? "text-amber-600" : "text-[#94A3B8]" },
              { label: "Pro Subscribers", value: stats.proSubscribers, color: "text-[#1E6DF0]" },
              { label: "Featured Shops", value: stats.featuredShops, color: "text-[#1E6DF0]" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-slate-100 p-4">
                <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-[#94A3B8] mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/shop-tags" className="bg-white rounded-xl border border-slate-100 p-5 hover:border-[#1E6DF0]/20 transition-colors">
              <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Review Shop Tags</h3>
              <p className="text-[12px] text-[#64748B]">{stats.pendingTags} shops waiting for outreach</p>
            </Link>
            <Link href="/admin/featured" className="bg-white rounded-xl border border-slate-100 p-5 hover:border-[#1E6DF0]/20 transition-colors">
              <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Manage Featured</h3>
              <p className="text-[12px] text-[#64748B]">{stats.featuredShops} featured shop listings active</p>
            </Link>
            <a href="/api/admin/export?type=shops" className="bg-white rounded-xl border border-slate-100 p-5 hover:border-[#1E6DF0]/20 transition-colors">
              <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">Export CSV</h3>
              <p className="text-[12px] text-[#64748B]">Download shop data for invoicing</p>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
