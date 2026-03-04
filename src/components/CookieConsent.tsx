"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { grantAnalyticsConsent } from "./Analytics";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("ws-cookie-consent");
    if (!consent) {
      // Show after a short delay so it doesn't flash
      setTimeout(() => setVisible(true), 1500);
    } else if (consent === "accepted") {
      grantAnalyticsConsent();
    }
  }, []);

  const accept = () => {
    localStorage.setItem("ws-cookie-consent", "accepted");
    grantAnalyticsConsent();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("ws-cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-200 shadow-xl shadow-slate-200/50 p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-[13px] text-[#475569] leading-relaxed">
            We use cookies for analytics to improve your experience.{" "}
            <Link href="/privacy" className="text-[#1E6DF0] hover:text-[#3B82F6]">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={decline}
            className="text-[12px] text-[#94A3B8] hover:text-[#475569] px-3 py-1.5 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-[12px] font-medium text-white bg-[#0F172A] hover:bg-[#1E293B] px-4 py-1.5 rounded-lg transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
