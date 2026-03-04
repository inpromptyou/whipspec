"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

const MENUS = [
  {
    label: "For Creators",
    items: [
      { href: "/builds", title: "Build Pages", desc: "Publish your full spec sheet" },
      { href: "/discover", title: "Discover", desc: "Browse builds and get inspired" },
      { href: "/about", title: "How It Works", desc: "Upload, tag, share" },
    ],
  },
  {
    label: "For Shops",
    items: [
      { href: "/shops", title: "Shop Pages", desc: "Get credited for your work" },
      { href: "/advertise", title: "Advertise", desc: "Reach Australia's car scene" },
      { href: "/contact", title: "Partner With Us", desc: "Featured placement and leads" },
    ],
  },
  {
    label: "For Brands",
    items: [
      { href: "/brands", title: "Brand Directory", desc: "Be discovered through builds" },
      { href: "/advertise", title: "Sponsorships", desc: "Sponsor builds and categories" },
      { href: "/contact", title: "Contact Sales", desc: "Custom campaigns" },
    ],
  },
];

function Dropdown({
  menu,
  open,
  onToggle,
  isScrolled,
}: {
  menu: (typeof MENUS)[0];
  open: boolean;
  onToggle: () => void;
  isScrolled: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onToggle();
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onToggle]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 text-[13px] tracking-[-0.01em] px-3 py-1.5 rounded-md transition-colors ${
          isScrolled
            ? "text-[#475569] hover:text-[#0F172A] hover:bg-slate-50"
            : "text-white/80 hover:text-white hover:bg-white/10"
        }`}
      >
        {menu.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path d="M2.5 3.75L5 6.25L7.5 3.75" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-[260px] bg-white rounded-xl shadow-xl shadow-black/[0.08] border border-slate-100 p-2 z-50">
          {menu.items.map((item) => (
            <Link
              key={item.href + item.title}
              href={item.href}
              className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              <span className="block text-[13px] font-medium text-[#0F172A] group-hover:text-[#1E6DF0] transition-colors">
                {item.title}
              </span>
              <span className="block text-[12px] text-[#94A3B8] mt-0.5">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Nav() {
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[64px]">
          {/* Logo — bigger */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="WhipSpec"
              width={52}
              height={34}
              className="object-contain"
              priority
            />
          </Link>

          {/* Center nav — dropdowns */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {MENUS.map((menu, i) => (
              <Dropdown
                key={menu.label}
                menu={menu}
                open={openMenu === i}
                onToggle={() => setOpenMenu(openMenu === i ? null : i)}
                isScrolled={scrolled}
              />
            ))}
          </nav>

          {/* Right */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={`text-[13px] tracking-[-0.01em] px-3 py-1.5 rounded-md transition-colors ${
                scrolled
                  ? "text-[#475569] hover:text-[#0F172A]"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className={`text-[13px] font-medium px-4 py-2 rounded-lg transition-all ${
                scrolled
                  ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                  : "bg-white text-[#0F172A] hover:bg-white/90"
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden p-2 -mr-2 ${scrolled ? "text-[#475569]" : "text-white"}`}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-slate-100">
            {MENUS.map((menu) => (
              <div key={menu.label} className="mb-4">
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-[0.15em] px-1 mb-2">
                  {menu.label}
                </p>
                {menu.items.map((item) => (
                  <Link
                    key={item.href + item.title}
                    href={item.href}
                    className="block text-sm text-[#475569] hover:text-[#0F172A] py-1.5 px-1"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <Link href="/login" className="text-sm text-[#475569]">Log In</Link>
              <Link href="/signup" className="text-sm font-medium bg-[#0F172A] text-white px-4 py-2 rounded-lg">Sign Up</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
