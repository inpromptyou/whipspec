"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

interface Build {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; views: number; style: string; status: string; hero_image: string;
  description: string; location: string; created_at: string;
}

interface Mod {
  category: string; brand: string; product_name: string; shop_name: string; link: string; notes: string;
}

const STYLES = ["Stance", "Track", "Street", "4WD / Touring", "Show", "Drift", "Daily"];
const MOD_CATEGORIES = [
  "Wheels", "Tyres", "Suspension", "Exhaust", "Protection", "Lighting",
  "Electrical", "Roof Racks", "Canopies", "Intake", "Towing", "Touring",
  "Interior", "Tune", "Wrap / Paint", "Audio", "Brakes", "Drivetrain", "Other"
];

const TABS = [
  { id: "overview", label: "Overview", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "builds", label: "My Builds", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { id: "create", label: "New Build", icon: "M12 4v16m8-8H4" },
  { id: "saved", label: "Saved", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
  { id: "settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

// Placeholder car images for empty states and templates
const TEMPLATE_BUILDS = [
  { title: "200 Series LandCruiser — Touring", make: "Toyota", model: "LandCruiser 200", year: 2019, style: "4WD / Touring", img: "/hero-3.jpg" },
  { title: "N80 HiLux — Daily Driver", make: "Toyota", model: "HiLux SR5", year: 2022, style: "4WD / Touring", img: "/hero-4.jpg" },
  { title: "Ford Ranger Raptor — Weekend", make: "Ford", model: "Ranger Raptor", year: 2023, style: "4WD / Touring", img: "/hero-5.jpg" },
  { title: "VE SS Ute — Street Build", make: "Holden", model: "Commodore VE SS", year: 2011, style: "Street", img: "/hero-10.jpg" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");

  // Create form state
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

  // Settings state
  const [settingsName, setSettingsName] = useState("");
  const [settingsLocation, setSettingsLocation] = useState("");
  const [settingsBio, setSettingsBio] = useState("");
  const [settingsInstagram, setSettingsInstagram] = useState("");
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState("");

  const fetchBuilds = useCallback(() => {
    fetch("/api/builds?mine=1")
      .then((r) => r.json())
      .then((d) => setBuilds(d.builds || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/"); return; }
    fetchBuilds();
    setSettingsName(user.name || "");
  }, [user, authLoading, router, fetchBuilds]);

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
          style: style || null, location: location.trim() || null, mods: validMods,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to create");
      router.push(`/build/${data.build.slug}`);
    } catch { setError("Network error"); }
    setCreating(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsMsg("");
    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settingsName.trim(),
          location: settingsLocation.trim() || null,
          bio: settingsBio.trim() || null,
          instagram: settingsInstagram.trim() || null,
        }),
      });
      if (res.ok) setSettingsMsg("Profile updated");
      else setSettingsMsg("Failed to update");
    } catch { setSettingsMsg("Network error"); }
    setSettingsSaving(false);
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  if (authLoading || loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-[#F8FAFC] pt-28 flex items-center justify-center">
          <div className="animate-pulse space-y-3 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 mx-auto" />
            <p className="text-sm text-[#94A3B8]">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }
  if (!user) return null;

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-[#F8FAFC] pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Dashboard header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#0F172A] tracking-tight">
                Welcome back, {user.name.split(" ")[0]}
              </h1>
              <p className="text-[14px] text-[#64748B] mt-1">
                {user.account_type === "shop" ? "Manage your shop and track inquiries" : "Build, share, and get discovered"}
              </p>
            </div>
            <button
              onClick={() => setTab("create")}
              className="inline-flex items-center gap-2 bg-[#1E6DF0] text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-[#1557CC] transition-colors shadow-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
              New Build
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-slate-100 rounded-xl p-1 mb-8 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap ${
                  tab === t.id
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={t.icon} />
                </svg>
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── OVERVIEW TAB ─── */}
          {tab === "overview" && (
            <div className="space-y-8">
              {/* Stats cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                  <p className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-wider">My Builds</p>
                  <p className="text-3xl font-semibold text-[#0F172A] mt-1">{builds.length}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                  <p className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-wider">Total Views</p>
                  <p className="text-3xl font-semibold text-[#0F172A] mt-1">{builds.reduce((sum, b) => sum + (b.views || 0), 0)}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-5">
                  <p className="text-[12px] font-medium text-[#94A3B8] uppercase tracking-wider">Account Type</p>
                  <p className="text-3xl font-semibold text-[#0F172A] mt-1 capitalize">{user.account_type}</p>
                </div>
              </div>

              {/* Quick actions */}
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A] mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button onClick={() => setTab("create")} className="bg-white rounded-xl border border-slate-100 p-5 text-left hover:shadow-md hover:border-[#1E6DF0]/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3 group-hover:bg-[#1E6DF0]/[0.12] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-[#0F172A]">Create a build</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">Share your spec sheet</p>
                  </button>
                  <Link href="/discover" className="bg-white rounded-xl border border-slate-100 p-5 text-left hover:shadow-md hover:border-[#1E6DF0]/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3 group-hover:bg-[#1E6DF0]/[0.12] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-[#0F172A]">Discover builds</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">Browse the community</p>
                  </Link>
                  <Link href="/shops" className="bg-white rounded-xl border border-slate-100 p-5 text-left hover:shadow-md hover:border-[#1E6DF0]/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3 group-hover:bg-[#1E6DF0]/[0.12] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-[#0F172A]">Find shops</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">Workshops near you</p>
                  </Link>
                  <Link href="/brands" className="bg-white rounded-xl border border-slate-100 p-5 text-left hover:shadow-md hover:border-[#1E6DF0]/20 transition-all group">
                    <div className="w-10 h-10 rounded-lg bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3 group-hover:bg-[#1E6DF0]/[0.12] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-[#0F172A]">Browse brands</p>
                    <p className="text-[12px] text-[#94A3B8] mt-0.5">Parts and products</p>
                  </Link>
                </div>
              </div>

              {/* Recent builds or templates */}
              {builds.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-[15px] font-semibold text-[#0F172A]">Your Builds</h2>
                    <button onClick={() => setTab("builds")} className="text-[13px] text-[#1E6DF0] hover:text-[#1557CC] font-medium">View all</button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {builds.slice(0, 3).map((b) => (
                      <Link key={b.id} href={`/build/${b.slug}`} className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                        <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                          {b.hero_image ? (
                            <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1"><path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{b.title}</h3>
                          <p className="text-[12px] text-[#94A3B8] mt-0.5">{[b.year, b.make, b.model].filter(Boolean).join(" ")}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] text-[#94A3B8]">{b.views || 0} views</span>
                            {b.style && <span className="text-[11px] text-[#1E6DF0] bg-[#1E6DF0]/[0.06] px-2 py-0.5 rounded-full">{b.style}</span>}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-[15px] font-semibold text-[#0F172A] mb-2">Get Inspired</h2>
                  <p className="text-[13px] text-[#64748B] mb-4">Popular build styles from the community. Start one of your own.</p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {TEMPLATE_BUILDS.map((t) => (
                      <button
                        key={t.title}
                        onClick={() => {
                          setTab("create");
                          setMake(t.make);
                          setModel(t.model);
                          setYear(String(t.year));
                          setStyle(t.style);
                          setTitle("");
                        }}
                        className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all text-left"
                      >
                        <div className="aspect-[16/10] relative overflow-hidden">
                          <img src={t.img} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-[12px] font-semibold text-white">{t.title}</p>
                            <p className="text-[11px] text-white/70">{t.style}</p>
                          </div>
                        </div>
                        <div className="p-3 flex items-center justify-between">
                          <span className="text-[11px] text-[#1E6DF0] font-medium">Use as template</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── MY BUILDS TAB ─── */}
          {tab === "builds" && (
            <div>
              {builds.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#1E6DF0]/[0.06] flex items-center justify-center mx-auto mb-5">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M12 4v16m8-8H4"/></svg>
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#0F172A] mb-2">No builds yet</h2>
                  <p className="text-[14px] text-[#64748B] max-w-md mx-auto mb-6">
                    Create your first build spec. Upload photos, tag your mods and shops, then share a single link that replaces every "what wheels?" DM.
                  </p>
                  <button onClick={() => setTab("create")} className="bg-[#1E6DF0] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1557CC] transition-colors">
                    Create your first build
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {builds.map((b) => (
                    <Link key={b.id} href={`/build/${b.slug}`} className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all">
                      <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden">
                        {b.hero_image ? (
                          <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {b.status || "published"}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-[14px] font-semibold text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{b.title}</h3>
                        <p className="text-[12px] text-[#94A3B8] mt-0.5">{[b.year, b.make, b.model].filter(Boolean).join(" ")}</p>
                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
                          <span className="text-[11px] text-[#94A3B8]">{b.views || 0} views</span>
                          {b.style && <span className="text-[11px] text-[#1E6DF0] bg-[#1E6DF0]/[0.06] px-2 py-0.5 rounded-full">{b.style}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {/* Add new build card */}
                  <button onClick={() => setTab("create")} className="bg-white rounded-xl border-2 border-dashed border-slate-200 hover:border-[#1E6DF0]/40 transition-colors flex flex-col items-center justify-center min-h-[260px] group">
                    <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-[#1E6DF0]/[0.06] flex items-center justify-center mb-3 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" className="group-hover:stroke-[#1E6DF0] transition-colors"><path d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <p className="text-[13px] font-medium text-[#94A3B8] group-hover:text-[#1E6DF0] transition-colors">Add new build</p>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── CREATE TAB ─── */}
          {tab === "create" && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#1E6DF0] to-[#3B82F6] px-6 md:px-8 py-5">
                  <h2 className="text-[17px] font-semibold text-white">Create a new build</h2>
                  <p className="text-[13px] text-white/70 mt-0.5">Fill in the details and publish your spec sheet</p>
                </div>

                <div className="p-6 md:p-8">
                  {error && <div className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>}

                  <form onSubmit={handleCreate} className="space-y-6">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Build title *</label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. The Weekend Warrior N80" className={inputClass} />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Make</label>
                        <input type="text" value={make} onChange={(e) => setMake(e.target.value)} placeholder="Toyota" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Model</label>
                        <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="HiLux SR5" className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Year</label>
                        <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" className={inputClass} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Style</label>
                        <select value={style} onChange={(e) => setStyle(e.target.value)} className={inputClass}>
                          <option value="">Select a style...</option>
                          {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Perth, WA" className={inputClass} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Description</label>
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Tell the story of this build..." className={inputClass} />
                    </div>

                    {/* Mods */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wider">Modifications</label>
                        <button type="button" onClick={addMod} className="inline-flex items-center gap-1 text-[12px] text-[#1E6DF0] hover:text-[#1557CC] font-medium">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                          Add mod
                        </button>
                      </div>
                      <div className="space-y-3">
                        {mods.map((mod, i) => (
                          <div key={i} className="bg-[#F8FAFC] rounded-xl border border-slate-100 p-4">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Mod {i + 1}</span>
                              {mods.length > 1 && (
                                <button type="button" onClick={() => removeMod(i)} className="text-[11px] text-red-400 hover:text-red-500 font-medium">Remove</button>
                              )}
                            </div>
                            <div className="grid sm:grid-cols-2 gap-3">
                              <select value={mod.category} onChange={(e) => updateMod(i, "category", e.target.value)} className={inputClass}>
                                <option value="">Category...</option>
                                {MOD_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                              </select>
                              <input type="text" value={mod.brand} onChange={(e) => updateMod(i, "brand", e.target.value)} placeholder="Brand (e.g. ARB)" className={inputClass} />
                              <input type="text" value={mod.product_name} onChange={(e) => updateMod(i, "product_name", e.target.value)} placeholder="Product name" className={inputClass} />
                              <input type="text" value={mod.shop_name} onChange={(e) => updateMod(i, "shop_name", e.target.value)} placeholder="Shop that installed it" className={inputClass} />
                              <input type="url" value={mod.link} onChange={(e) => updateMod(i, "link", e.target.value)} placeholder="Product link (optional)" className={inputClass} />
                              <input type="text" value={mod.notes} onChange={(e) => updateMod(i, "notes", e.target.value)} placeholder="Notes (optional)" className={inputClass} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button type="submit" disabled={creating} className="w-full bg-[#1E6DF0] text-white font-medium py-3 rounded-lg text-sm hover:bg-[#1557CC] disabled:opacity-50 transition-colors shadow-sm">
                      {creating ? "Publishing..." : "Publish build"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ─── SAVED TAB ─── */}
          {tab === "saved" && (
            <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1E6DF0]/[0.06] flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
              </div>
              <h2 className="font-[family-name:var(--font-playfair)] text-xl text-[#0F172A] mb-2">No saved builds yet</h2>
              <p className="text-[14px] text-[#64748B] max-w-md mx-auto mb-6">
                When you find a build you love, save it here for easy reference. Browse the community to get started.
              </p>
              <Link href="/discover" className="inline-flex items-center bg-[#1E6DF0] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1557CC] transition-colors">
                Discover builds
              </Link>
            </div>
          )}

          {/* ─── SETTINGS TAB ─── */}
          {tab === "settings" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-slate-100">
                  <h2 className="text-[17px] font-semibold text-[#0F172A]">Profile Settings</h2>
                  <p className="text-[13px] text-[#64748B] mt-0.5">Update your profile and preferences</p>
                </div>

                <div className="p-6 md:p-8">
                  {settingsMsg && (
                    <div className={`mb-5 px-4 py-3 rounded-lg text-sm ${settingsMsg.includes("updated") ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"}`}>
                      {settingsMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Name</label>
                      <input type="text" value={settingsName} onChange={(e) => setSettingsName(e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Email</label>
                      <input type="email" value={user.email} disabled className={`${inputClass} bg-slate-50 text-[#94A3B8] cursor-not-allowed`} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Location</label>
                      <input type="text" value={settingsLocation} onChange={(e) => setSettingsLocation(e.target.value)} placeholder="Perth, WA" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Bio</label>
                      <textarea value={settingsBio} onChange={(e) => setSettingsBio(e.target.value)} rows={3} placeholder="Tell us about your builds..." className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-semibold text-[#475569] uppercase tracking-wider mb-1.5">Instagram</label>
                      <input type="text" value={settingsInstagram} onChange={(e) => setSettingsInstagram(e.target.value)} placeholder="@yourusername" className={inputClass} />
                    </div>
                    <div className="pt-2">
                      <button type="submit" disabled={settingsSaving} className="bg-[#1E6DF0] text-white font-medium text-sm px-6 py-2.5 rounded-lg hover:bg-[#1557CC] disabled:opacity-50 transition-colors">
                        {settingsSaving ? "Saving..." : "Save changes"}
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="text-[14px] font-semibold text-[#0F172A] mb-2">Account</h3>
                    <p className="text-[13px] text-[#64748B] mb-3">Account type: <span className="font-medium capitalize text-[#0F172A]">{user.account_type}</span></p>
                    <button
                      onClick={() => { logout(); router.push("/"); }}
                      className="text-[13px] text-red-500 hover:text-red-600 font-medium"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
