"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  account_type: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/login", { method: "DELETE" }).catch(() => {});
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-sm text-[#94A3B8]">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-[60px]">
          <Link href="/">
            <Image src="/logo.png" alt="WhipSpec" width={44} height={28} />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-[#64748B]">{user.name}</span>
            <button
              onClick={handleLogout}
              className="text-[13px] text-[#94A3B8] hover:text-[#0F172A] transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] mb-1">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-[#64748B]">
            {user.account_type === "shop"
              ? "Manage your shop page and see how builds are driving customers to you."
              : "Your build specs, all in one place."}
          </p>
        </div>

        {/* Empty state */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1E6DF0]/[0.06] flex items-center justify-center mx-auto mb-5">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h2 className="text-[17px] font-semibold text-[#0F172A] mb-2">
            {user.account_type === "shop"
              ? "Your shop page is being set up"
              : "No builds yet"}
          </h2>
          <p className="text-[14px] text-[#64748B] max-w-sm mx-auto mb-6">
            {user.account_type === "shop"
              ? "We're getting everything ready. You'll be able to manage your profile, services, and gallery soon."
              : "When you publish your first build spec, it will appear here. Build pages are launching soon."}
          </p>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#1E6DF0]/[0.06] text-[#1E6DF0] text-[12px] font-medium">
            Coming soon
          </span>
        </div>
      </main>
    </div>
  );
}
