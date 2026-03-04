"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm font-medium text-[#1E6DF0]">
        You&rsquo;re on the list. We&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all"
      />
      <button
        type="submit"
        className="text-white font-medium bg-[#0F172A] hover:bg-[#1E293B] px-5 py-2.5 rounded-lg text-sm transition-colors shrink-0"
      >
        Join waitlist
      </button>
    </form>
  );
}
