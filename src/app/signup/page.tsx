"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<"creator" | "shop" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (!accountType) return setError("Please select an account type");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, accountType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

            {error && (
              <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                disabled={loading}
                className="w-full text-white font-medium bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed py-2.5 rounded-lg text-sm transition-colors"
              >
                {loading ? "Creating account..." : "Create account"}
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
