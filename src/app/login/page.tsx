"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputClass = "w-full border border-white/[0.08] rounded-md px-3.5 py-2.5 text-sm bg-white/[0.03] text-white placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#1E6DF0]/40 focus:border-[#1E6DF0]/30 transition-all";

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <div className="p-5">
        <Link href="/"><Image src="/logo.png" alt="WhipSpec" width={36} height={22} /></Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-20">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-2xl text-white mb-1">Welcome back</h1>
          <p className="text-sm text-[#888] mb-8">Sign in to your account.</p>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-[12px] text-[#888] mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-[12px] text-[#888] mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className={inputClass} />
            </div>
            <button type="submit" className="w-full text-white font-medium bg-[#1E6DF0] hover:bg-[#3B82F6] py-2.5 rounded-md text-sm transition-colors">
              Sign in
            </button>
          </form>

          <p className="text-[13px] text-[#666] mt-6 text-center">
            No account? <Link href="/signup" className="text-[#1E6DF0] hover:text-[#3B82F6]">Get started</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
