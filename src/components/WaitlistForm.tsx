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
      <p className="text-sm text-[#00B4D8] font-medium">
        You&rsquo;re on the list. We&rsquo;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 border border-white/[0.08] rounded px-3.5 py-2.5 text-sm bg-white/[0.04] text-white placeholder-[#555] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/20 focus:border-[#00B4D8]/40"
      />
      <button
        type="submit"
        className="text-black font-medium bg-[#00B4D8] hover:bg-[#00D4FF] px-5 py-2.5 rounded text-sm transition-colors shrink-0"
      >
        Join the waitlist
      </button>
    </form>
  );
}
