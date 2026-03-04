"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"creator" | "shop" | null>(null);

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <div className="p-5">
        <Link href="/">
          <Image src="/logo.png" alt="WhipSpec" width={44} height={28} />
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-5 pb-20">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 p-8">
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] mb-1">
              Create your account
            </h1>
            <p className="text-sm text-[#64748B] mb-6">
              Join WhipSpec. Free to start.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-2">
                  I am a...
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAccountType("creator")}
                    className={`py-3 rounded-lg border text-sm transition-all ${
                      accountType === "creator"
                        ? "border-[#1E6DF0]/40 bg-[#1E6DF0]/[0.04] text-[#0F172A] ring-2 ring-[#1E6DF0]/20"
                        : "border-slate-200 text-[#64748B] hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-medium">Creator</span>
                    <span className="block text-[11px] text-[#94A3B8] mt-0.5">
                      Share my builds
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType("shop")}
                    className={`py-3 rounded-lg border text-sm transition-all ${
                      accountType === "shop"
                        ? "border-[#1E6DF0]/40 bg-[#1E6DF0]/[0.04] text-[#0F172A] ring-2 ring-[#1E6DF0]/20"
                        : "border-slate-200 text-[#64748B] hover:border-slate-300"
                    }`}
                  >
                    <span className="block font-medium">Shop / Brand</span>
                    <span className="block text-[11px] text-[#94A3B8] mt-0.5">
                      Get discovered
                    </span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white font-medium bg-[#0F172A] hover:bg-[#1E293B] py-2.5 rounded-lg text-sm transition-colors"
              >
                Create account
              </button>
            </form>

            <p className="text-[13px] text-[#94A3B8] mt-6 text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#1E6DF0] hover:text-[#3B82F6] font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
