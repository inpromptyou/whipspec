"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface Shop {
  id: number; name: string; slug: string; description: string; location: string;
  services: string[]; phone: string; email: string; instagram: string; website: string;
  hero_image: string; claimed: boolean; verified: boolean;
}
interface Build {
  id: number; title: string; slug: string; make: string; model: string; year: number; hero_image: string; style: string;
}

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<Shop | null>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Inquiry form
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryCar, setInquiryCar] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryBudget, setInquiryBudget] = useState("");
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/shops/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d) => { setShop(d.shop); setBuilds(d.builds || []); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const sendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryLoading(true);
    try {
      const res = await fetch(`/api/shops/${slug}/inquire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inquiryName, email: inquiryEmail, phone: inquiryPhone, car_details: inquiryCar, message: inquiryMessage, budget: inquiryBudget }),
      });
      if (res.ok) setInquirySent(true);
    } catch { /* ignore */ }
    setInquiryLoading(false);
  };

  const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  if (loading) return <><Nav /><div className="min-h-screen flex items-center justify-center"><p className="text-sm text-[#94A3B8]">Loading...</p></div></>;
  if (notFound || !shop) return (
    <><Nav /><div className="min-h-screen flex items-center justify-center text-center px-5">
      <div><h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] mb-2">Shop not found</h1>
      <Link href="/shops" className="text-[#1E6DF0] text-sm font-medium">Browse all shops</Link></div>
    </div><Footer /></>
  );

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Shop header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 p-6 md:p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-[family-name:var(--font-playfair)] text-2xl md:text-3xl text-[#0F172A] tracking-tight">{shop.name}</h1>
                  {shop.verified && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1E6DF0"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  )}
                </div>
                {shop.location && <p className="text-[14px] text-[#64748B] mt-1">{shop.location}</p>}
              </div>
              {shop.claimed ? (
                <span className="px-3 py-1 rounded-full bg-[#1E6DF0]/[0.08] text-[#1E6DF0] text-[11px] font-semibold">Claimed</span>
              ) : (
                <Link href="/signup" className="px-3 py-1.5 rounded-lg bg-[#0F172A] text-white text-[12px] font-medium hover:bg-[#1E293B] transition-colors">
                  Claim this page
                </Link>
              )}
            </div>

            {shop.description && (
              <p className="text-[14px] text-[#475569] leading-relaxed mb-5">{shop.description}</p>
            )}

            {/* Services */}
            {shop.services && shop.services.length > 0 && (
              <div className="mb-5">
                <h3 className="text-[12px] font-semibold text-[#94A3B8] uppercase tracking-[0.15em] mb-2">Services</h3>
                <div className="flex flex-wrap gap-1.5">
                  {shop.services.map((s) => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-slate-50 text-[12px] text-[#475569]">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
              {shop.phone && (
                <a href={`tel:${shop.phone}`} className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  {shop.phone}
                </a>
              )}
              {shop.instagram && (
                <a href={`https://instagram.com/${shop.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors">
                  Instagram
                </a>
              )}
              {shop.website && (
                <a href={shop.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] text-[#64748B] hover:text-[#0F172A] transition-colors">
                  Website
                </a>
              )}
              <button
                onClick={() => setShowInquiry(!showInquiry)}
                className="inline-flex items-center gap-1.5 bg-[#0F172A] text-white text-[13px] font-medium px-4 py-1.5 rounded-lg hover:bg-[#1E293B] transition-colors ml-auto"
              >
                Send inquiry
              </button>
            </div>
          </div>

          {/* Inquiry form */}
          {showInquiry && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-6">
              {inquirySent ? (
                <div className="text-center py-4">
                  <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">Inquiry sent</h3>
                  <p className="text-[14px] text-[#64748B]">The shop will receive your message and get back to you.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-[17px] font-semibold text-[#0F172A] mb-5">Send an inquiry to {shop.name}</h2>
                  <form onSubmit={sendInquiry} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Name *</label>
                        <input type="text" value={inquiryName} onChange={(e) => setInquiryName(e.target.value)} required className={inputClass} placeholder="Your name" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Email *</label>
                        <input type="email" value={inquiryEmail} onChange={(e) => setInquiryEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Phone</label>
                        <input type="tel" value={inquiryPhone} onChange={(e) => setInquiryPhone(e.target.value)} className={inputClass} placeholder="04XX XXX XXX" />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Budget range</label>
                        <select value={inquiryBudget} onChange={(e) => setInquiryBudget(e.target.value)} className={inputClass}>
                          <option value="">Select...</option>
                          <option value="Under $500">Under $500</option>
                          <option value="$500 - $2,000">$500 - $2,000</option>
                          <option value="$2,000 - $5,000">$2,000 - $5,000</option>
                          <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                          <option value="$10,000+">$10,000+</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Your car</label>
                      <input type="text" value={inquiryCar} onChange={(e) => setInquiryCar(e.target.value)} className={inputClass} placeholder="e.g. 2019 Toyota 86 GTS" />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Message *</label>
                      <textarea value={inquiryMessage} onChange={(e) => setInquiryMessage(e.target.value)} required rows={4} className={inputClass} placeholder="What work are you looking to get done?" />
                    </div>
                    <button type="submit" disabled={inquiryLoading} className="w-full bg-[#0F172A] text-white font-medium py-2.5 rounded-lg text-sm hover:bg-[#1E293B] disabled:opacity-50 transition-colors">
                      {inquiryLoading ? "Sending..." : "Send inquiry"}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

          {/* Featured builds */}
          {builds.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
              <h2 className="text-[17px] font-semibold text-[#0F172A] mb-5">Featured on these builds</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {builds.map((b) => (
                  <Link key={b.id} href={`/build/${b.slug}`} className="group flex gap-3 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-16 h-12 rounded-lg bg-slate-100 shrink-0 overflow-hidden">
                      {b.hero_image && <img src={b.hero_image} alt={b.title} className="w-full h-full object-cover" />}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">{b.title}</p>
                      <p className="text-[12px] text-[#94A3B8]">{[b.year, b.make, b.model].filter(Boolean).join(" ")}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
