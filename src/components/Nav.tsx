"use client";

import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E8E6E1]/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-serif text-xl text-[#1A1A1A] tracking-tight">
            WhipSpec
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/discover" className="text-[13px] text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">
              Discover
            </Link>
            <Link href="/shops" className="text-[13px] text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">
              Shops
            </Link>
            <Link href="/about" className="text-[13px] text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">
              About
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] text-[#4A4A4A] hover:text-[#1A1A1A] transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-[13px] font-medium text-white bg-[#2D5A3D] hover:bg-[#3A7A52] px-4 py-1.5 rounded-md transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-1 text-[#4A4A4A]"
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-[#E8E6E1]/60 mt-1 pt-3">
            <div className="flex flex-col gap-3">
              <Link href="/discover" className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A]">Discover</Link>
              <Link href="/shops" className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A]">Shops</Link>
              <Link href="/about" className="text-sm text-[#4A4A4A] hover:text-[#1A1A1A]">About</Link>
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="text-sm text-[#4A4A4A]">Sign in</Link>
                <Link href="/signup" className="text-sm font-medium text-white bg-[#2D5A3D] px-4 py-1.5 rounded-md">Get started</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
