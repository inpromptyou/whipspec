import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

const GRID_IMAGES = [
  { id: 1, src: "/hero-3.jpg", alt: "HiLux beach build" },
  { id: 2, src: "/hero-4.jpg", alt: "HiLux sunset" },
  { id: 3, src: "/hero-5.jpg", alt: "LandCruiser and Raptor" },
  { id: 4, src: "/hero-6.jpg", alt: "Twin HiLux builds" },
  { id: 5, src: "/hero-7.jpg", alt: "Twin HiLux on the sand" },
  { id: 6, src: "/hero-8.jpg", alt: "VZ Ute slammed by the river" },
  { id: 7, src: "/hero-9.jpg", alt: "VE Ute colour-shift teal" },
  { id: 8, src: "/hero-10.jpg", alt: "Red VE SS Ute at Shell" },
];

const STATS = [
  { value: "$58B", label: "Australian aftermarket industry", source: "AAAA" },
  { value: "50K+", label: "Automotive businesses", source: "AAAA" },
  { value: "19.7M", label: "Vehicles on Australian roads", source: "BITRE" },
  { value: "300K", label: "Industry professionals", source: "AAAA" },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero: ShopMy-style image grid with overlaid text ─── */}
        <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
          {/* Image grid background */}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-2 gap-[2px]">
            {GRID_IMAGES.map((img) => (
              <div key={img.id} className="relative bg-slate-900">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A]/70 via-[#0F172A]/50 to-[#0F172A]/70" />

          {/* Hero content */}
          <div className="relative z-10 max-w-4xl mx-auto px-5 text-center">
            <h1 className="font-[family-name:var(--font-playfair)] text-[2.75rem] sm:text-[3.75rem] md:text-[5rem] text-white leading-[1.05] tracking-tight mb-6">
              Built by the{" "}
              <em className="italic">obsessed,</em>
              <br />
              not the algorithm.
            </h1>
            <p className="text-base md:text-lg text-white/70 max-w-lg mx-auto mb-8 leading-relaxed">
              Discover the exact parts, shops, and brands behind
              Australia&rsquo;s best car builds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center bg-white text-[#0F172A] font-medium text-sm px-7 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center border border-white/30 text-white font-medium text-sm px-7 py-3 rounded-lg hover:bg-white/10 transition-colors"
              >
                Explore Builds
              </Link>
            </div>
          </div>

          {/* Bottom fade to white */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* ─── Stats Bar ─── */}
        <section className="relative -mt-8 z-10">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-[12px] text-[#94A3B8] mt-1.5 tracking-wide uppercase">
                      {stat.label}
                    </p>
                    <p className="text-[10px] text-[#CBD5E1] mt-0.5">
                      Source: {stat.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── What is WhipSpec ─── */}
        <section className="pt-24 pb-20 md:pt-32 md:pb-28">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.2em] uppercase mb-3">
                The Platform
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight">
                Every build deserves a<br />
                <em className="italic">proper spec sheet.</em>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  ),
                  title: "For Creators",
                  desc: "Publish a premium build page with every mod listed. One link in your bio replaces a hundred 'what wheels?' DMs.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                    </svg>
                  ),
                  title: "For Followers",
                  desc: "Find the exact parts, brands, and workshops behind any build. No more digging through comments or sending DMs.",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E6DF0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  ),
                  title: "For Shops",
                  desc: "Get credited every time your work appears on a build. New customers find you through the cars you've touched.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="bg-[#F8FAFC] rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1E6DF0]/[0.08] flex items-center justify-center mb-5">
                    {card.icon}
                  </div>
                  <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="py-20 md:py-28 bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.2em] uppercase mb-3">
              How It Works
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-16">
              Three steps. One link.
            </h2>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              {[
                {
                  num: "01",
                  title: "Upload your build",
                  desc: "Add photos of your car. We help draft the mod list — you confirm and refine.",
                },
                {
                  num: "02",
                  title: "Tag parts and shops",
                  desc: "Attribute every modification. The brand, the product, the shop that installed it. Everyone gets credit.",
                },
                {
                  num: "03",
                  title: "Share your spec",
                  desc: "One link in your bio. Followers get the full breakdown. Shops get the leads. You stop repeating yourself.",
                },
              ].map((step) => (
                <div key={step.num}>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-[12px] font-mono text-[#1E6DF0] mb-5 shadow-sm">
                    {step.num}
                  </div>
                  <h3 className="text-[16px] font-semibold text-[#0F172A] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[#64748B] leading-relaxed max-w-[280px] mx-auto">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Social Proof / Industry ─── */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.2em] uppercase mb-3">
              The Opportunity
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl md:text-[2.25rem] text-[#0F172A] tracking-tight leading-tight mb-6">
              Automotive discovery is broken.
            </h2>
            <p className="text-[15px] text-[#64748B] leading-relaxed max-w-2xl mx-auto mb-14">
              Every day, creators post builds and get flooded with the same questions: &ldquo;What wheels?&rdquo;
              &ldquo;Who did the wrap?&rdquo; &ldquo;Where can I get that?&rdquo; The answers get buried in
              comments and DMs. Parts go unattributed. Shops miss out on leads. Followers give up searching.
            </p>

            <div className="grid sm:grid-cols-3 gap-8">
              {[
                {
                  stat: "15%",
                  label: "Of Australian vehicles are modified after purchase",
                  source: "AAAA Consumer Insights",
                },
                {
                  stat: "71%",
                  label: "Of consumers trust their local mechanic",
                  source: "AAAA Industry Report",
                },
                {
                  stat: "$10B",
                  label: "Annual service and repair expenditure",
                  source: "AAAA Market Data",
                },
              ].map((item) => (
                <div key={item.stat} className="text-center">
                  <p className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl text-[#0F172A] tracking-tight">
                    {item.stat}
                  </p>
                  <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-1">{item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── For Shops CTA ─── */}
        <section className="py-20 md:py-28">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E6DF0] via-[#3B82F6] to-[#06B6D4] p-10 md:p-16">
              {/* Subtle geometric pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.03] rounded-full translate-y-1/3 -translate-x-1/4" />

              <div className="relative z-10 max-w-xl">
                <p className="text-[11px] font-semibold text-white/60 tracking-[0.2em] uppercase mb-3">
                  For Shops &amp; Brands
                </p>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-white tracking-tight leading-tight mb-4">
                  Your work deserves
                  <br />
                  <em className="italic">attribution.</em>
                </h2>
                <p className="text-[15px] text-white/70 leading-relaxed mb-8">
                  When creators tag your shop on a build, you show up.
                  New customers discover you through the cars you&rsquo;ve worked on — not through paid ads.
                  Claim your page, showcase your work, receive inquiries.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center bg-white text-[#0F172A] font-medium text-sm px-7 py-3 rounded-lg hover:bg-white/90 transition-colors"
                >
                  Claim Your Shop Page
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-20 md:py-28 bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-4">
              Get early access.
            </h2>
            <p className="text-[15px] text-[#64748B] mb-8 max-w-md mx-auto">
              WhipSpec is in early access. Create your account now and get founding member status.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
