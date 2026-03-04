"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

function ResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const inp = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E6DF0]/20 focus:border-[#1E6DF0]/40";

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setMsg({ type: "err", text: "Password must be 8+ characters" });
    if (password !== confirm) return setMsg({ type: "err", text: "Passwords don't match" });
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      setMsg(res.ok ? { type: "ok", text: data.message } : { type: "err", text: data.error });
    } catch { setMsg({ type: "err", text: "Network error" }); }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center py-20">
        <h2 className="text-[17px] font-semibold text-[#0F172A] mb-2">Invalid reset link</h2>
        <p className="text-[14px] text-[#64748B]">This link is missing or malformed. Request a new one from the login screen.</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto">
      <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] text-center mb-2">Reset password</h1>
      <p className="text-[14px] text-[#64748B] text-center mb-6">Enter your new password.</p>
      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm ${msg.type === "ok" ? "bg-green-50 border border-green-100 text-green-600" : "bg-red-50 border border-red-100 text-red-600"}`}>{msg.text}</div>
      )}
      {msg?.type !== "ok" && (
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-[#64748B] mb-1">New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8+ characters" className={inp} />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-[#64748B] mb-1">Confirm password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm" className={inp} />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#0F172A] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1E293B] disabled:opacity-50">
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-20 min-h-screen">
        <Suspense fallback={<div className="text-center py-20 text-[#94A3B8]">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
