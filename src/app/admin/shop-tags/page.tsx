"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

interface ShopTag {
  id: number;
  shop_name: string;
  address: string;
  phone: string;
  website: string;
  email: string;
  status: string;
  tagged_by_name: string;
  build_title: string;
  build_slug: string;
  invite_sent_at: string | null;
  created_at: string;
}

export default function AdminShopTags() {
  const [tags, setTags] = useState<ShopTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState<Record<number, string>>({});
  const [sending, setSending] = useState<number | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/shop-tags")
      .then((r) => r.json())
      .then((d) => { setTags(d.tags || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const sendInvite = async (tagId: number) => {
    const email = inviteEmail[tagId];
    if (!email) return;
    setSending(tagId);
    try {
      const res = await fetch("/api/shop-tags/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag_id: tagId, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(`Invite sent to ${email}`);
        setTags(tags.map((t) => t.id === tagId ? { ...t, status: "invited", invite_sent_at: new Date().toISOString() } : t));
      } else {
        setMsg(data.error || "Failed to send");
      }
    } catch { setMsg("Network error"); }
    setSending(null);
  };

  const inp = "border border-slate-200 rounded-lg px-3 py-2 text-[13px] bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40";

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-semibold text-[#0F172A]">Shop Tags</h1>
              <p className="text-[13px] text-[#64748B] mt-1">Shops tagged by creators that haven&apos;t claimed their profile yet</p>
            </div>
            <span className="text-[12px] font-medium text-[#94A3B8] bg-white border border-slate-100 px-3 py-1.5 rounded-lg">{tags.length} pending</span>
          </div>

          {msg && <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-600">{msg}</div>}

          {loading ? (
            <div className="text-center py-12 text-[#94A3B8]">Loading...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
              <p className="text-[#64748B]">No pending shop tags yet.</p>
              <p className="text-[13px] text-[#94A3B8] mt-1">When creators tag shops on their builds, they&apos;ll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tags.map((tag) => (
                <div key={tag.id} className="bg-white rounded-xl border border-slate-100 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-[15px] font-semibold text-[#0F172A]">{tag.shop_name}</h3>
                      {tag.address && <p className="text-[13px] text-[#64748B] mt-0.5">{tag.address}</p>}
                      <div className="flex flex-wrap gap-3 mt-2 text-[12px] text-[#94A3B8]">
                        {tag.phone && <span>{tag.phone}</span>}
                        {tag.website && <a href={tag.website} target="_blank" rel="noopener" className="text-[#1E6DF0] hover:underline">{tag.website}</a>}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center text-[11px] font-medium bg-slate-50 text-[#64748B] px-2 py-1 rounded">
                          Tagged by {tag.tagged_by_name}
                        </span>
                        <Link href={`/build/${tag.build_slug}`} className="inline-flex items-center text-[11px] font-medium bg-[#1E6DF0]/5 text-[#1E6DF0] px-2 py-1 rounded hover:bg-[#1E6DF0]/10">
                          {tag.build_title}
                        </Link>
                        <span className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded ${
                          tag.status === "invited" ? "bg-amber-50 text-amber-600" :
                          tag.status === "claimed" ? "bg-green-50 text-green-600" :
                          "bg-slate-50 text-slate-500"
                        }`}>
                          {tag.status}
                        </span>
                      </div>
                    </div>

                    {tag.status === "pending" && (
                      <div className="flex gap-2 items-center">
                        <input
                          type="email"
                          value={inviteEmail[tag.id] || tag.email || ""}
                          onChange={(e) => setInviteEmail({ ...inviteEmail, [tag.id]: e.target.value })}
                          placeholder="Shop email"
                          className={`${inp} w-48`}
                        />
                        <button
                          onClick={() => sendInvite(tag.id)}
                          disabled={sending === tag.id}
                          className="bg-[#0F172A] text-white text-[12px] font-medium px-4 py-2 rounded-lg hover:bg-[#1E293B] disabled:opacity-50 whitespace-nowrap"
                        >
                          {sending === tag.id ? "Sending..." : "Send invite"}
                        </button>
                      </div>
                    )}
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
