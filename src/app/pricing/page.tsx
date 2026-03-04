import Link from "next/link";
import Nav from "@/components/Nav";
import CheckoutButton from "@/components/CheckoutButton";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Pricing — WhipSpec",
  description: "Free for creators. Affordable for shops. Simple pricing with no surprises.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Pricing</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-4">
              Three plans.<br />Pick yours.
            </h1>
            <p className="text-[15px] text-[#64748B] max-w-md mx-auto">
              Free to post builds. Upgrade when you need more. Shops pay to get discovered.
            </p>
          </div>

          {/* Plans */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {/* Free */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-1">Free</h3>
              <p className="text-[13px] text-[#94A3B8] mb-4">For car enthusiasts</p>
              <p className="mb-5">
                <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#0F172A]">$0</span>
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Publish up to 3 builds",
                  "Public profile page",
                  "Tag shops and brands",
                  "Share link for each build",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan="creator_free"
                label="Get started"
                className="block w-full text-center text-sm font-medium py-2.5 rounded-lg bg-slate-50 text-[#0F172A] hover:bg-slate-100 transition-colors"
              />
            </div>

            {/* Creator Plus */}
            <div className="rounded-2xl border border-[#1E6DF0]/30 bg-[#1E6DF0]/[0.02] shadow-lg shadow-[#1E6DF0]/[0.05] p-6 relative">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1E6DF0] text-white text-[10px] font-semibold mb-4">Popular</span>
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-1">Creator Plus</h3>
              <p className="text-[13px] text-[#94A3B8] mb-4">For serious builders</p>
              <p className="mb-5">
                <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#0F172A]">$4.99</span>
                <span className="text-[13px] text-[#94A3B8]">/mo</span>
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Everything in Free",
                  "Unlimited builds",
                  "Build analytics (views, clicks)",
                  "Priority in discover",
                  "HD photo gallery (30 images)",
                  "Founding Creator badge",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan="creator_plus"
                label="Upgrade"
                className="block w-full text-center text-sm font-medium py-2.5 rounded-lg bg-[#0F172A] text-white hover:bg-[#1E293B] transition-colors"
              />
            </div>

            {/* Shop */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6">
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-1">Shop</h3>
              <p className="text-[13px] text-[#94A3B8] mb-4">For workshops and brands</p>
              <p className="mb-5">
                <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#0F172A]">$79</span>
                <span className="text-[13px] text-[#94A3B8]">/mo</span>
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Claimed shop profile",
                  "Inquiry form + notifications",
                  "Linked to every tagged build",
                  "Analytics dashboard",
                  "Priority in search",
                  "Featured placement available",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-[#475569]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <CheckoutButton
                plan="shop_pro"
                label="Get started"
                className="block w-full text-center text-sm font-medium py-2.5 rounded-lg bg-slate-50 text-[#0F172A] hover:bg-slate-100 transition-colors"
              />
            </div>
          </div>

          {/* Enterprise / Brand callout */}
          <div className="bg-[#0F172A] rounded-2xl p-8 md:p-10 text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-white tracking-tight mb-3">
              Brands and larger shops
            </h2>
            <p className="text-[14px] text-[#94A3B8] max-w-md mx-auto mb-6">
              Need featured placement, sponsored builds, or custom campaigns? We work with brands and multi-location shops directly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-[#0F172A] text-[13px] font-medium px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Talk to us
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
