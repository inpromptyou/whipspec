"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

interface PlacementInfo {
  label: string;
  desc: string;
  floor: number;
}

export default function SponsorClient() {
  const { user, showAuthModal } = useAuth();
  const [prices, setPrices] = useState<Record<string, PlacementInfo>>({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [budget, setBudget] = useState("");
  const [budgetCap, setBudgetCap] = useState("");
  const [title, setTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // My active sponsorships
  const [mySponsorships, setMySponsorships] = useState<Array<Record<string, unknown>>>([]);

  useEffect(() => {
    fetch("/api/sponsorships?prices=1")
      .then((r) => r.json())
      .then((d) => setPrices(d.prices || {}))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (user) {
      fetch("/api/sponsorships")
        .then((r) => r.json())
        .then((d) => setMySponsorships(d.sponsorships || []))
        .catch(() => {});
    }
  }, [user]);

  const handleCreate = async () => {
    if (!user) { showAuthModal(); return; }
    if (!selected) return;
    const floor = prices[selected]?.floor ?? 5;
    const budgetNum = parseFloat(budget);
    if (!budgetNum || budgetNum < floor) {
      setMsg({ type: "err", text: `Minimum daily budget is $${floor.toFixed(2)}` });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const res = await fetch("/api/sponsorships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          placement: selected,
          daily_budget: budgetNum,
          title: title.trim() || null,
          link_url: linkUrl.trim() || null,
          budget_cap: budgetCap ? parseFloat(budgetCap) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMsg({ type: "ok", text: "Sponsorship created. You'll appear in that placement within minutes." });
      setSelected(null);
      setBudget("");
      setBudgetCap("");
      setTitle("");
      setLinkUrl("");

      // Refresh list
      const listRes = await fetch("/api/sponsorships");
      const listData = await listRes.json();
      setMySponsorships(listData.sponsorships || []);
    } catch (e: unknown) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed to create sponsorship" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async (id: number) => {
    await fetch(`/api/sponsorships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paused" }),
    });
    setMySponsorships((prev) => prev.map((s) => (s.id === id ? { ...s, status: "paused" } : s)));
  };

  const handleResume = async (id: number) => {
    await fetch(`/api/sponsorships/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "active" }),
    });
    setMySponsorships((prev) => prev.map((s) => (s.id === id ? { ...s, status: "active" } : s)));
  };

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse">
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-3" />
            <div className="h-3 bg-slate-50 rounded w-full mb-2" />
            <div className="h-8 bg-slate-100 rounded w-1/3 mt-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Placement cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {Object.entries(prices).map(([key, info]) => (
          <button
            key={key}
            onClick={() => { setSelected(key); setBudget(info.floor.toFixed(2)); }}
            className={`text-left bg-white rounded-xl border p-5 transition-all hover:shadow-lg ${
              selected === key
                ? "border-[#1E6DF0] shadow-md shadow-[#1E6DF0]/10"
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <h3 className="text-[14px] font-semibold text-[#0F172A] mb-1">{info.label}</h3>
            <p className="text-[12px] text-[#94A3B8] mb-4">{info.desc}</p>
            <div className="flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A]">${info.floor.toFixed(2)}</span>
              <span className="text-[12px] text-[#94A3B8]">/day min</span>
            </div>
          </button>
        ))}
      </div>

      {/* Create form */}
      {selected && (
        <div className="bg-white rounded-2xl border border-[#1E6DF0]/20 p-6 md:p-8 mb-10 shadow-sm">
          <h2 className="text-[17px] font-semibold text-[#0F172A] mb-1">
            Set up: {prices[selected]?.label}
          </h2>
          <p className="text-[13px] text-[#94A3B8] mb-6">
            Floor: ${prices[selected]?.floor.toFixed(2)}/day — set your budget above this.
          </p>

          {msg && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${
              msg.type === "ok" ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"
            }`}>
              {msg.text}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Daily Budget (AUD)</label>
              <div className="flex items-center">
                <span className="text-[#94A3B8] text-sm mr-1">$</span>
                <input
                  type="number"
                  step="0.01"
                  min={prices[selected]?.floor}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
                />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Budget Cap (optional)</label>
              <div className="flex items-center">
                <span className="text-[#94A3B8] text-sm mr-1">$</span>
                <input
                  type="number"
                  step="1"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(e.target.value)}
                  placeholder="No cap"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
                />
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Ad Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. ARB Summit Bull Bar"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Link URL</label>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://yoursite.com.au"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-[#0F172A] placeholder-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCreate}
              disabled={submitting}
              className="bg-[#0F172A] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Start sponsorship"}
            </button>
            <button
              onClick={() => setSelected(null)}
              className="text-sm text-[#94A3B8] hover:text-[#64748B] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* My sponsorships */}
      {user && mySponsorships.length > 0 && (
        <div>
          <h2 className="text-[17px] font-semibold text-[#0F172A] mb-4">Your Sponsorships</h2>
          <div className="space-y-3">
            {mySponsorships.map((s) => (
              <div key={s.id as number} className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[14px] font-semibold text-[#0F172A]">{(s.title as string) || (s.placement as string)}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      s.status === "active" ? "bg-green-50 text-green-600" : s.status === "paused" ? "bg-amber-50 text-amber-600" : "bg-slate-100 text-[#94A3B8]"
                    }`}>
                      {(s.status as string).toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#94A3B8]">
                    ${Number(s.daily_budget).toFixed(2)}/day
                    {s.budget_cap ? ` — $${Number(s.budget_cap).toFixed(2)} cap` : ""}
                    {" — "}{s.impressions as number} impressions, {s.clicks as number} clicks
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.status === "active" ? (
                    <button onClick={() => handlePause(s.id as number)} className="text-[12px] font-medium text-amber-600 hover:text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                      Pause
                    </button>
                  ) : s.status === "paused" ? (
                    <button onClick={() => handleResume(s.id as number)} className="text-[12px] font-medium text-green-600 hover:text-green-700 px-3 py-1.5 rounded-lg border border-green-200 hover:bg-green-50 transition-colors">
                      Resume
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
