import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getSql } from "@/lib/db";
import ProfileCopyLink from "./ProfileCopyLink";

interface UserProfile {
  id: number; name: string; username: string; account_type: string;
  avatar_url: string | null; bio: string | null; location: string | null;
  instagram: string | null; tiktok: string | null; website: string | null;
  created_at: string;
}
interface Build {
  id: number; title: string; slug: string; make: string; model: string;
  year: number; style: string; hero_image: string; views: number;
}

// Known static routes to skip
const STATIC_ROUTES = new Set([
  "discover", "builds", "shops", "brands", "about", "contact",
  "pricing", "advertise", "privacy", "terms", "sources", "dashboard",
  "login", "signup", "api", "build", "shop",
]);

async function getProfile(username: string): Promise<{ user: UserProfile; builds: Build[] } | null> {
  // Strip @ prefix if present
  const clean = username.startsWith("@") ? username.slice(1) : username;

  if (STATIC_ROUTES.has(clean)) return null;
  if (!clean || clean.length < 2) return null;

  try {
    const sql = getSql();
    const users = await sql`
      SELECT id, name, username, account_type, avatar_url, bio, location,
             instagram, tiktok, website, created_at
      FROM users WHERE username = ${clean} LIMIT 1
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
  const desc = user.bio || `${user.name}'s builds on WhipSpec.`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `https://whipspec.com/@${user.username}`,
      type: "profile",
    },
  };
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const data = await getProfile(username);
  if (!data) notFound();

  const { user, builds } = data;
  const profileUrl = `https://whipspec.com/@${user.username}`;

  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Profile header */}
          <div className="text-center py-8 sm:py-12">
            {/* Avatar */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#1E6DF0] to-[#3B82F6] mx-auto mb-4 flex items-center justify-center text-white text-3xl sm:text-4xl font-semibold shadow-lg shadow-[#1E6DF0]/20">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <h1 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-[#0F172A] tracking-tight">
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

            {user.bio && (
              <p className="text-[14px] text-[#475569] max-w-md mx-auto mt-3 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Social links */}
            <div className="flex items-center justify-center gap-4 mt-4">
              {user.instagram && (
                <a href={`https://instagram.com/${user.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {user.tiktok && (
                <a href={`https://tiktok.com/@${user.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.84 4.84 0 01-3.77-1.55V6.69h3.77z"/></svg>
                </a>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                </a>
              )}
            </div>

            {/* Copy link + stats */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <ProfileCopyLink url={profileUrl} />
              <span className="text-[12px] text-[#CBD5E1]">|</span>
              <span className="text-[13px] text-[#94A3B8]">{builds.length} build{builds.length !== 1 ? "s" : ""}</span>
              <span className="text-[13px] text-[#94A3B8]">{builds.reduce((sum, b) => sum + (b.views || 0), 0)} views</span>
            </div>
          </div>

          {/* Builds grid */}
          {builds.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {builds.map((b) => (
                <Link key={b.id} href={`/build/${b.slug}`} className="group">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                    {b.hero_image ? (
                      <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                      </div>
                    )}
                    {b.style && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-[#0F172A]">{b.style}</span>
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
            <div className="text-center py-16 bg-[#F8FAFC] rounded-2xl border border-slate-100">
              <p className="text-[14px] text-[#64748B]">No builds published yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
