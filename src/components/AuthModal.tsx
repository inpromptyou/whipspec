"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";
type AccountType = "buyer" | "creator" | "shop";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [accountType, setAccountType] = useState<AccountType | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40 transition-all";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required");
    if (!password) return setError("Password is required");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Invalid credentials");
      onClose();
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Name is required");
    if (!email.trim()) return setError("Email is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");
    if (!accountType) return setError("Please select what describes you best");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          accountType: accountType === "buyer" ? "creator" : accountType,
        }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || "Something went wrong");
      onClose();
      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[400px] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] transition-colors z-10"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="p-7">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="WhipSpec" width={56} height={36} className="object-contain" />
          </div>

          {/* Tab switcher */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 mb-6">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${
                mode === "login" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setMode("signup"); setError(""); }}
              className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-all ${
                mode === "signup" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
              {error}
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              {/* Google OAuth */}
              <a
                href="/api/auth/google?accountType=creator"
                className="flex items-center justify-center gap-2.5 w-full border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </a>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] text-[#94A3B8]">or</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className="w-full text-white font-medium bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 py-2.5 rounded-lg text-sm transition-colors">
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account type first for Google OAuth */}
              <div>
                <label className="block text-[12px] font-medium text-[#64748B] mb-2">I am a...</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "buyer" as AccountType, label: "Buyer", desc: "Discover builds" },
                    { value: "creator" as AccountType, label: "Creator", desc: "Share my builds" },
                    { value: "shop" as AccountType, label: "Shop / Brand", desc: "Get discovered" },
                  ]).map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAccountType(opt.value)}
                      className={`py-2.5 rounded-lg border text-center transition-all ${
                        accountType === opt.value
                          ? "border-[#1E6DF0]/40 bg-[#1E6DF0]/[0.04] ring-2 ring-[#1E6DF0]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className={`block text-[13px] font-medium ${accountType === opt.value ? "text-[#0F172A]" : "text-[#64748B]"}`}>
                        {opt.label}
                      </span>
                      <span className="block text-[10px] text-[#94A3B8] mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Google OAuth */}
              <a
                href={`/api/auth/google?accountType=${accountType || "creator"}`}
                className={`flex items-center justify-center gap-2.5 w-full border border-slate-200 rounded-lg py-2.5 text-sm font-medium text-[#0F172A] hover:bg-slate-50 transition-colors ${!accountType ? "opacity-40 pointer-events-none" : ""}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </a>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[11px] text-[#94A3B8]">or</span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#64748B] mb-1.5">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" className={inputClass} />
                </div>
                <button type="submit" disabled={loading || !accountType} className="w-full text-white font-medium bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 py-2.5 rounded-lg text-sm transition-colors">
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
