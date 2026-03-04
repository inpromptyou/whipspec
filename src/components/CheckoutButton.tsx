"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function CheckoutButton({ plan, label, className }: { plan: string; label: string; className?: string }) {
  const { user, showAuthModal } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!user) { showAuthModal(); return; }

    // Free plan — just go to dashboard
    if (plan === "creator_free") {
      window.location.href = "/dashboard";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Network error");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={className || "block w-full text-center text-sm font-medium py-2.5 rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors disabled:opacity-50"}
    >
      {loading ? "Loading..." : label}
    </button>
  );
}
