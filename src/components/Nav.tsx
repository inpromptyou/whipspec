"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/discover", label: "Discover" },
  { href: "/builds", label: "Builds" },
  { href: "/shops", label: "Shops" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06]" style={{ backgroundColor: "rgba(10,10,10,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[60px]">
          {/* Logo only — no text */}
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="WhipSpec" width={40} height={26} className="object-contain" />
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[#999] hover:text-white px-3 py-1.5 rounded-md hover:bg-white/[0.04] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/login" className="text-[13px] text-[#999] hover:text-white px-3 py-1.5 rounded-md hover:bg-white/[0.04] transition-all">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-medium text-white bg-[#1E6DF0] hover:bg-[#3B82F6] px-4 py-1.5 rounded-md transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Mobile */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 -mr-2 text-[#999] hover:text-white" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-5 pt-2 border-t border-white/[0.06] space-y-1">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block text-sm text-[#999] hover:text-white py-2 px-1">
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 border-t border-white/[0.06] mt-2">
              <Link href="/login" className="text-sm text-[#999] hover:text-white py-2">Sign in</Link>
              <Link href="/signup" className="text-sm font-medium text-white bg-[#1E6DF0] px-4 py-2 rounded-md">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
