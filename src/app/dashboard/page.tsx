"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface User { id: number; name: string; email: string; account_type: string; }
interface Build { id: number; title: string; slug: string; make: string; model: string; year: number; views: number; style: string; status: string; }

const STYLES = ["Stance", "Track", "Street", "4WD / Touring", "Show", "Drift", "Daily"];
const MOD_CATEGORIES = ["Wheels", "Suspension", "Exhaust", "Aero", "Lighting", "Interior", "Tune", "Wrap / Paint", "4WD Accessories", "Audio", "Brakes", "Drivetrain", "Other"];

interface Mod {
  category: string; brand: string; product_name: string; shop_name: string; link: string; notes: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"builds" | "create">("builds");

  // Create form
  const [title, setTitle] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [location, setLocation] = useState("");
  const [mods, setMods] = useState<Mod[]>([{ category: "", brand: "", product_name: "", shop_name: "", link: "", notes: "" }]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => { setUser(d.user); return fetch("/api/builds?limit=100"); })
      .then((r) => r.json())
      .then((d) => setBuilds((d.builds || []).filter((b: Build & { user_id?: number }) => b.user_id === user?.id) || d.builds || []))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/");
  };

  const addMod = () => setMods([...mods, { category: "", brand: "", product_name: "", shop_name: "", link: "", notes: "" }]);
  const removeMod = (i: number) => setMods(mods.filter((_, idx) => idx !== i));
  const updateMod = (i: number, field: keyof Mod, value: string) => {
    const updated = [...mods];
    updated[i] = { ...updated[i], [field]: value };
    setMods(updated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim()) return setError("Build title is required");

    setCreating(true);
    try {
      const validMods = mods.filter((m) => m.category && (m.brand || m.product_name));
      const res = await fetch("/api/builds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(), make: make.trim() || null, model: model.trim() || null,
          year: year ? parseInt(year) : null, description: description.trim() || null,
          style: style || null, location: location.trim() || null,
          mods: validMods,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to create");
      router.push(`/build/${data.build.slug}`);
    } catch { setError("Network error"); }
    setCreating(false);
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><p className="text-sm text-[#94A3B8]">Loading...</p></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-[60px]">
          <Link href="/"><Image src="/logo.png" alt="WhipSpec" width={44} height={28} /></Link>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#64748B]">{user.name}</span>
            <button onClick={handleLogout} className="text-[13px] text-[#94A3B8] hover:text-[#0F172A]">Log out</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-6 mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A]">Dashboard</h1>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => setTab("builds")} className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors ${tab === "builds" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"}`}>
              My Builds
            </button>
            <button onClick={() => setTab("create")} className={`px-4 py-1.5 rounded-md text-[13px] font-medium transition-colors ${tab === "create" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"}`}>
              New Build
            </button>
          </div>
        </div>

        {tab === "builds" && (
          <>
            {builds.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#1E6DF0]/[0.06] flex items-center justify-center mx-auto mb-5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
                </div>
                <h2 className="text-[17px] font-semibold text-[#0F172A] mb-2">No builds yet</h2>
                <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">Create your first build spec and share it with your followers.</p>
                <button onClick={() => setTab("create")} className="bg-[#0F172A] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1E293B]">
                  Create a build
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {builds.map((b) => (
                  <Link key={b.id} href={`/build/${b.slug}`} className="block bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[15px] font-semibold text-[#0F172A]">{b.title}</h3>
                        <p className="text-[13px] text-[#94A3B8] mt-0.5">{[b.year, b.make, b.model].filter(Boolean).join(" ")} {b.style && `· ${b.style}`}</p>
                      </div>
                      <span className="text-[12px] text-[#94A3B8]">{b.views} views</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "create" && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            <h2 className="text-[17px] font-semibold text-[#0F172A] mb-6">Create a new build</h2>

            {error && <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Build title *</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Daily Driver 86" className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Make</label>
                  <input type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Model</label>
                  <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="86 GTS" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Year</label>
                  <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2019" className={inputClass} />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Style</label>
                  <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Perth, WA" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Tell the story of this build..." className={inputClass} />
              </div>

              {/* Mods */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[12px] font-medium text-[#64748B]">Modifications</label>
                  <button type="button" onClick={addMod} className="text-[12px] text-[#1E6DF0] hover:text-[#3B82F6] font-medium">+ Add mod</button>
                </div>
                <div className="space-y-3">
                  {mods.map((mod, i) => (
                    <div key={i} className="bg-[#F8FAFC] rounded-xl border border-slate-100 p-4">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[11px] font-semibold text-[#94A3B8]">MOD {i + 1}</span>
                        {mods.length > 1 && (
                          <button type="button" onClick={() => removeMod(i)} className="text-[11px] text-red-400 hover:text-red-500">Remove</button>
                        )}
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <select value={mod.category} onChange={(e) => updateMod(i, "category", e.target.value)} className={inputClass}>
                          <option value="">Category...</option>
                          {MOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input type="text" value={mod.brand} onChange={(e) => updateMod(i, "brand", e.target.value)} placeholder="Brand" className={inputClass} />
                        <input type="text" value={mod.product_name} onChange={(e) => updateMod(i, "product_name", e.target.value)} placeholder="Product name" className={inputClass} />
                        <input type="text" value={mod.shop_name} onChange={(e) => updateMod(i, "shop_name", e.target.value)} placeholder="Shop that installed it" className={inputClass} />
                        <input type="url" value={mod.link} onChange={(e) => updateMod(i, "link", e.target.value)} placeholder="Product link (optional)" className={inputClass} />
                        <input type="text" value={mod.notes} onChange={(e) => updateMod(i, "notes", e.target.value)} placeholder="Notes (optional)" className={inputClass} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={creating} className="w-full bg-[#0F172A] text-white font-medium py-3 rounded-lg text-sm hover:bg-[#1E293B] disabled:opacity-50 transition-colors">
                {creating ? "Publishing..." : "Publish build"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
