import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image src="/logo.png" alt="WhipSpec" width={36} height={22} className="object-contain" />
            </Link>
            <p className="text-[12px] text-[#666] leading-relaxed max-w-[180px]">
              Australia&rsquo;s automotive build showcase.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-medium text-[#555] uppercase tracking-[0.15em] mb-3">Platform</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/discover" className="text-[#777] hover:text-white transition-colors">Discover</Link></li>
              <li><Link href="/builds" className="text-[#777] hover:text-white transition-colors">Builds</Link></li>
              <li><Link href="/shops" className="text-[#777] hover:text-white transition-colors">Shops</Link></li>
              <li><Link href="/brands" className="text-[#777] hover:text-white transition-colors">Brands</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium text-[#555] uppercase tracking-[0.15em] mb-3">Company</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/about" className="text-[#777] hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-[#777] hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/advertise" className="text-[#777] hover:text-white transition-colors">Advertise</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium text-[#555] uppercase tracking-[0.15em] mb-3">Legal</h4>
            <ul className="space-y-2.5 text-[13px]">
              <li><Link href="/privacy" className="text-[#777] hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-[#777] hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-medium text-[#555] uppercase tracking-[0.15em] mb-3">Social</h4>
            <div className="flex items-center gap-4">
              <a href="https://x.com/whipspec" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://www.instagram.com/whipspec/" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@whipspec" target="_blank" rel="noopener noreferrer" className="text-[#555] hover:text-white transition-colors" aria-label="TikTok">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13a8.28 8.28 0 005.58 2.17V11.7a4.84 4.84 0 01-3.77-1.55V6.69h3.77z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.06]">
          <p className="text-[11px] text-[#444]">&copy; 2026 WhipSpec Pty Ltd. Made in Australia.</p>
        </div>
      </div>
    </footer>
  );
}
