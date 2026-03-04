"use client";

import { useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const inputClass = "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to API
    setSent(true);
  };

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Contact</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-3">Get in touch</h1>
            <p className="text-[15px] text-[#64748B]">
              Partnerships, press, shop enquiries, or just want to chat.
            </p>
          </div>

          {sent ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <h2 className="text-[17px] font-semibold text-[#0F172A] mb-2">Message sent</h2>
              <p className="text-[14px] text-[#64748B]">We&rsquo;ll get back to you as soon as we can.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your name" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">I&rsquo;m reaching out about</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                    <option value="">Select...</option>
                    <option value="partnership">Partnership / Sponsorship</option>
                    <option value="shop">Shop listing / Claim</option>
                    <option value="brand">Brand collaboration</option>
                    <option value="press">Press / Media</option>
                    <option value="feedback">Feedback / Feature request</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5} placeholder="What's on your mind?" className={inputClass} />
                </div>
                <button type="submit" className="w-full bg-[#0F172A] text-white font-medium py-2.5 rounded-lg text-sm hover:bg-[#1E293B] transition-colors">
                  Send message
                </button>
              </form>
            </div>
          )}

          <div className="mt-10 text-center space-y-2">
            <p className="text-[13px] text-[#94A3B8]">
              Or email us directly at{" "}
              <a href="mailto:hello@whipspec.com" className="text-[#1E6DF0] hover:text-[#3B82F6]">hello@whipspec.com</a>
            </p>
            <div className="flex justify-center gap-4">
              <a href="https://x.com/whipspec" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] text-[13px]">X</a>
              <a href="https://www.instagram.com/whipspec/" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] text-[13px]">Instagram</a>
              <a href="https://www.tiktok.com/@whipspec" target="_blank" rel="noopener noreferrer" className="text-[#94A3B8] hover:text-[#0F172A] text-[13px]">TikTok</a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
