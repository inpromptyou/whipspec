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
      <p className="text-sm text-[#1E6DF0]">
        You&rsquo;re on the list. We&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm bg-white/[0.03] text-white placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#1E6DF0]/40 focus:border-[#1E6DF0]/30 transition-all"
      />
      <button
        type="submit"
        className="text-white font-medium bg-[#1E6DF0] hover:bg-[#3B82F6] px-5 py-2.5 rounded-md text-sm transition-colors shrink-0"
      >
        Join waitlist
      </button>
    </form>
  );
}
