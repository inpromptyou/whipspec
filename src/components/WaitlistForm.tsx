"use client";

import { useState } from "react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    // TODO: wire to API
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-[#2D5A3D] font-medium">
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
        className="flex-1 border border-[#E8E6E1] rounded-md px-3.5 py-2.5 text-sm bg-white text-[#1A1A1A] placeholder-[#B5B3AE] focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 focus:border-[#2D5A3D]/40"
      />
      <button
        type="submit"
        className="text-white bg-[#2D5A3D] hover:bg-[#3A7A52] px-5 py-2.5 rounded-md text-sm font-medium transition-colors shrink-0"
      >
        Join the waitlist
      </button>
    </form>
  );
}
