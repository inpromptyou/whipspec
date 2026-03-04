import Link from "next/link";
import Nav from "@/components/Nav";
import CheckoutButton from "@/components/CheckoutButton";
import Footer from "@/components/Footer";

const TIERS = [
  {
    name: "Shop Pro",
    price: "$79",
    period: "/mo",
    desc: "For workshops and installers",
    features: ["Enhanced shop profile", "Inquiry form with notifications", "Analytics dashboard", "Priority in search results", "Gallery with up to 20 images"],
  },
  {
    name: "Shop Featured",
    price: "$249",
    period: "/mo",
    desc: "Maximum visibility",
    features: ["Everything in Pro", "Top placement on relevant builds", "Featured partner badge", "Sponsored build slots", "Category page promotion", "Creator campaign eligibility"],
    highlight: true,
  },
  {
    name: "Brand Sponsor",
    price: "Custom",
    period: "",
    desc: "For parts brands and retailers",
    features: ["'Used on this build' sponsorship", "Category sponsorships", "Custom campaign packages", "Performance reporting", "Dedicated account manager"],
  },
];

export default function AdvertisePage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Pricing</p>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-4">
              Reach the people who<br /><em className="italic">actually buy parts.</em>
            </h1>
            <p className="text-[15px] text-[#64748B] max-w-lg mx-auto">
              WhipSpec users are actively researching parts, comparing builds, and looking for shops.
              Put your business where purchase intent is highest.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 ${
                  tier.highlight
                    ? "border-[#1E6DF0]/30 bg-[#1E6DF0]/[0.02] shadow-lg shadow-[#1E6DF0]/[0.05]"
                    : "border-slate-100 bg-white"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#1E6DF0] text-white text-[10px] font-semibold mb-4">Most Popular</span>
                )}
                <h3 className="text-[17px] font-semibold text-[#0F172A] mb-1">{tier.name}</h3>
                <p className="text-[13px] text-[#94A3B8] mb-4">{tier.desc}</p>
                <p className="mb-5">
                  <span className="font-[family-name:var(--font-playfair)] text-3xl text-[#0F172A]">{tier.price}</span>
                  <span className="text-[13px] text-[#94A3B8]">{tier.period}</span>
                </p>
                <ul className="space-y-2.5 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[13px] text-[#475569]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="2" className="mt-0.5 shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {tier.price === "Custom" ? (
                  <Link
                    href="/contact"
                    className="block text-center text-sm font-medium py-2.5 rounded-lg bg-slate-50 text-[#0F172A] hover:bg-slate-100 transition-colors"
                  >
                    Contact sales
                  </Link>
                ) : (
                  <CheckoutButton
                    plan={tier.name === "Shop Pro" ? "shop_pro" : "shop_featured"}
                    label="Get started"
                    className={`block w-full text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
                      tier.highlight
                        ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                        : "bg-slate-50 text-[#0F172A] hover:bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-[#F8FAFC] rounded-2xl border border-slate-100 p-8 md:p-10 text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] tracking-tight mb-8">
              The Australian aftermarket
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { value: "$58B", label: "Industry contribution to the economy" },
                { value: "50K+", label: "Automotive businesses" },
                { value: "300K", label: "Industry professionals" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-[family-name:var(--font-playfair)] text-3xl text-[#0F172A]">{s.value}</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
