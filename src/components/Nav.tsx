"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="WhipSpec" width={44} height={28} className="object-contain" />
            <span className="font-display text-xl tracking-wider text-white hidden sm:block">WHIPSPEC</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            <Link href="/discover" className="text-[13px] text-[#888] hover:text-white transition-colors">Discover</Link>
            <Link href="/builds" className="text-[13px] text-[#888] hover:text-white transition-colors">Builds</Link>
            <Link href="/shops" className="text-[13px] text-[#888] hover:text-white transition-colors">Shops</Link>
            <Link href="/brands" className="text-[13px] text-[#888] hover:text-white transition-colors">Brands</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-[#888] hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-medium text-black bg-[#00B4D8] hover:bg-[#00D4FF] px-4 py-1.5 rounded transition-colors"
            >
              Get started
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1 text-[#888]" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.06] mt-1 pt-3 flex flex-col gap-3">
            <Link href="/discover" className="text-sm text-[#888] hover:text-white">Discover</Link>
            <Link href="/builds" className="text-sm text-[#888] hover:text-white">Builds</Link>
            <Link href="/shops" className="text-sm text-[#888] hover:text-white">Shops</Link>
            <Link href="/brands" className="text-sm text-[#888] hover:text-white">Brands</Link>
            <div className="flex gap-3 pt-2">
              <Link href="/login" className="text-sm text-[#888]">Sign in</Link>
              <Link href="/signup" className="text-sm font-medium text-black bg-[#00B4D8] px-4 py-1.5 rounded">Get started</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
