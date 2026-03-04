import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSql } from "@/lib/db";
import ProfileActions from "./ProfileActions";

interface UserProfile {
  id: number; name: string; username: string; account_type: string;
  avatar_url: string | null; bio: string | null; location: string | null;
  instagram: string | null; tiktok: string | null; facebook: string | null;
  snapchat: string | null; youtube: string | null; twitter: string | null;
  website: string | null; created_at: string;
}
interface Build {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; style: string; hero_image: string; views: number;
}

const STARTER_TEMPLATES = [
  { title: "Daily Build", style: "Daily", gradient: "from-slate-800 to-slate-900", img: "/hero-3.jpg" },
  { title: "4WD Touring Rig", style: "4WD / Touring", gradient: "from-emerald-800 to-emerald-900", img: "/hero-4.jpg" },
  { title: "Track Weapon", style: "Track", gradient: "from-red-800 to-red-900", img: "/hero-5.jpg" },
  { title: "Street Machine", style: "Street", gradient: "from-blue-800 to-blue-900", img: "/hero-10.jpg" },
  { title: "Show Build", style: "Show", gradient: "from-purple-800 to-purple-900", img: "/hero-6.jpg" },
  { title: "Overlander", style: "4WD / Touring", gradient: "from-amber-800 to-amber-900", img: "/hero-7.jpg" },
];

async function getProfile(raw: string): Promise<{ user: UserProfile; builds: Build[] } | null> {
  const username = decodeURIComponent(raw).replace(/^@/, "");
  if (!username || username.length < 2) return null;

  try {
    const sql = getSql();
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} LIMIT 1
    `;
    if (users.length === 0) return null;

    const user = users[0] as unknown as UserProfile;
    const builds = await sql`
      SELECT id, title, slug, make, model, year, style, hero_image, views
      FROM builds WHERE user_id = ${user.id} AND status = 'published'
      ORDER BY created_at DESC LIMIT 50
    `;

    return { user, builds: builds as unknown as Build[] };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const data = await getProfile(username);
  if (!data) return { title: "Not Found — WhipSpec" };

  const { user } = data;
  const title = `@${user.username} — ${user.name} | WhipSpec`;
  const desc = user.bio || `Check out ${user.name}'s builds on WhipSpec.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://whipspec.com/user/@${user.username}`,
      type: "profile",
      images: [{ url: `/api/og?title=${encodeURIComponent(`@${user.username}`)}&subtitle=${encodeURIComponent(desc)}&type=profile`, width: 1200, height: 630 }],
    },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getProfile(username);
  if (!data) notFound();

  const { user, builds } = data;
  const profileUrl = `https://whipspec.com/user/@${user.username}`;
  const joinDate = new Date(user.created_at);
  const joinLabel = joinDate.toLocaleDateString("en-AU", { month: "long", year: "numeric" });

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Profile header */}
          <div className="text-center py-8 sm:py-12">
            <ProfileActions userId={user.id} avatarUrl={user.avatar_url} name={user.name} username={user.username} profileUrl={profileUrl} />

            <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-[#0F172A] tracking-tight mt-4">
              {user.name}
            </h1>
            <p className="text-[14px] text-[#1E6DF0] font-medium mt-1">
              @{user.username}
            </p>

            {user.location && (
              <p className="text-[13px] text-[#94A3B8] mt-1.5 flex items-center justify-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {user.location}
              </p>
            )}

            {user.bio ? (
              <p className="text-[14px] text-[#475569] max-w-md mx-auto mt-3 leading-relaxed">
                {user.bio}
              </p>
            ) : (
              <p className="text-[13px] text-[#CBD5E1] mt-2">Joined {joinLabel}</p>
            )}

            {/* Social links */}
            <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Instagram">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {user.tiktok && (
                <a href={`https://tiktok.com/@${user.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="TikTok">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.84 4.84 0 01-3.77-1.55V6.69h3.77z"/></svg>
                </a>
              )}
              {user.facebook && (
                <a href={`https://facebook.com/${user.facebook.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Facebook">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {user.snapchat && (
                <a href={`https://snapchat.com/add/${user.snapchat.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Snapchat">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.959-.289.046-.023.094-.042.142-.042.132 0 .293.074.339.222.08.254-.053.458-.205.58-.385.31-.834.468-1.148.558-.046.012-.09.023-.132.035l-.065.018a.515.515 0 00-.143.072c-.073.078-.09.196-.064.319.194.81.659 1.541 1.16 2.127.188.22.382.417.579.593a3.73 3.73 0 00.49.378c.207.132.455.212.682.252.169.03.283.078.349.178.086.132.029.296-.036.385-.187.253-.492.399-.738.491-.159.06-.31.098-.447.137-.105.03-.202.058-.279.09-.122.054-.164.106-.146.232.027.183.036.294-.173.424a1.43 1.43 0 01-.655.151c-.137 0-.284-.02-.434-.06a3.3 3.3 0 00-.588-.07c-.182 0-.378.019-.582.07-1.046.254-1.848 1.123-2.727 1.123h-.048c-.879 0-1.681-.869-2.727-1.123a2.44 2.44 0 00-.582-.07c-.198 0-.393.028-.588.07-.15.04-.297.06-.434.06a1.43 1.43 0 01-.655-.151c-.209-.13-.2-.241-.173-.424.018-.126-.024-.178-.146-.232-.077-.032-.174-.06-.279-.09a4.8 4.8 0 01-.447-.137c-.246-.092-.551-.238-.738-.491-.065-.089-.122-.253-.036-.385.066-.1.18-.148.349-.178.227-.04.475-.12.682-.252a3.73 3.73 0 00.49-.378c.197-.176.391-.373.579-.593.501-.586.966-1.317 1.16-2.127.026-.123.009-.241-.064-.319a.515.515 0 00-.143-.072l-.065-.018c-.042-.012-.086-.023-.132-.035-.314-.09-.763-.248-1.148-.558-.152-.122-.285-.326-.205-.58.046-.148.207-.222.339-.222.048 0 .096.019.142.042.3.169.659.273.959.289.198 0 .326-.045.401-.09-.008-.165-.018-.33-.03-.51l-.003-.06c-.104-1.628-.23-3.654.299-4.847C7.859 1.069 11.216.793 12.206.793z"/></svg>
                </a>
              )}
              {user.youtube && (
                <a href={`https://youtube.com/@${user.youtube.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="YouTube">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {user.twitter && (
                <a href={`https://x.com/${user.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="X">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {user.website && (
                <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors" aria-label="Website">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                </a>
              )}
            </div>

            {/* Stats bar */}
            <div className="flex items-center justify-center gap-5 mt-5 text-[13px]">
              <span className="text-[#0F172A] font-semibold">{builds.length}<span className="text-[#94A3B8] font-normal ml-1">build{builds.length !== 1 ? "s" : ""}</span></span>
              <span className="text-[#0F172A] font-semibold">{builds.reduce((sum, b) => sum + (b.views || 0), 0)}<span className="text-[#94A3B8] font-normal ml-1">views</span></span>
            </div>
          </div>

          {/* Builds grid */}
          {builds.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {builds.map((b) => (
                <Link key={b.id} href={`/build/${b.slug}`} className="group">
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative">
                    {b.hero_image ? (
                      <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                    {b.style && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-md text-[10px] font-medium text-[#0F172A]">{b.style}</span>
                    )}
                  </div>
                  <div className="mt-2">
                    <h3 className="text-[13px] font-medium text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors line-clamp-1">{b.title}</h3>
                    <p className="text-[11px] text-[#94A3B8]">{[b.year, b.make, b.model].filter(Boolean).join(" ")}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty state — cool profile template */
            <div className="space-y-8">
              {/* Status card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 sm:p-8 text-center">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#1E6DF0] rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#3B82F6] rounded-full blur-3xl" />
                </div>
                <div className="relative">
                  <p className="text-[#64748B] text-[13px] mb-2">@{user.username}&apos;s garage</p>
                  <h3 className="text-white text-[20px] sm:text-[24px] font-semibold mb-2">No builds yet</h3>
                  <p className="text-[#94A3B8] text-[13px] max-w-sm mx-auto">
                    This profile is fresh. Follow @{user.username} to see their builds when they drop.
                  </p>
                </div>
              </div>

              {/* Build idea cards with images */}
              <div>
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-[0.15em] mb-3 text-center">What will @{user.username} build?</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                  {STARTER_TEMPLATES.map((t) => (
                    <div key={t.title} className="group relative aspect-[4/3] rounded-xl overflow-hidden">
                      <img src={t.img} alt={t.style} className="absolute inset-0 w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${t.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                        <img src="/logo.png" alt="WhipSpec" className="w-6 h-6 object-contain opacity-60 mb-1" />
                        <p className="text-white text-[12px] sm:text-[13px] font-semibold text-center leading-tight">{t.title}</p>
                        <p className="text-white/60 text-[10px] mt-0.5">{t.style}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="text-center">
                <p className="text-[13px] text-[#64748B] mb-3">Got a build? Show the scene what you&apos;re running.</p>
                <a href="/dashboard" className="inline-flex items-center gap-2 bg-[#0F172A] text-white text-[13px] font-medium px-5 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16m8-8H4"/></svg>
                  Drop your first build
                </a>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
