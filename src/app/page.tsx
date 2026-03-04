import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden">
          {/* Subtle radial glow — white/blue, not black */}
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#1E6DF0]/[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-28 pb-24 md:pt-40 md:pb-32 text-center">
            <p className="text-[12px] font-medium text-[#1E6DF0] tracking-[0.25em] uppercase mb-6">
              Coming Soon
            </p>
            <h1 className="font-serif text-[2.5rem] sm:text-[3.5rem] md:text-[4.25rem] text-white leading-[1.08] tracking-tight mb-6">
              Every build has a story.<br />
              <span className="text-[#666]">Now it has a spec sheet.</span>
            </h1>
            <p className="text-base md:text-[17px] text-[#888] leading-relaxed mb-10 max-w-xl mx-auto">
              The platform where Australian car builds get the full breakdown they deserve.
              Parts, shops, brands — attributed and discoverable.
            </p>
            <WaitlistForm />
          </div>
        </section>

        {/* ─── What WhipSpec Does ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="grid md:grid-cols-3 gap-10 md:gap-14">
              {[
                {
                  title: "For Creators",
                  desc: "Publish a premium build page with every mod listed. One link replaces a hundred 'what wheels?' DMs.",
                },
                {
                  title: "For Followers",
                  desc: "Find the exact parts, brands, and shops behind any build. No more digging through comment sections.",
                },
                {
                  title: "For Shops",
                  desc: "Get credited when your work shows up on a build. New customers find you through the cars you've touched.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-serif text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
            <p className="text-[11px] font-medium text-[#1E6DF0] tracking-[0.2em] uppercase mb-3">How it works</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight mb-14">
              Post it. Tag it. Get discovered.
            </h2>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  num: "01",
                  title: "Upload your build",
                  desc: "Add your car with photos. AI helps draft the mod list so you're not typing every part manually.",
                },
                {
                  num: "02",
                  title: "Tag parts and shops",
                  desc: "Attribute every modification — the brand, the product, and the shop that installed it. Everyone gets credit.",
                },
                {
                  num: "03",
                  title: "Share one link",
                  desc: "Drop your build spec in your bio. Followers get the full setup. Shops get the leads. You stop repeating yourself.",
                },
              ].map((item) => (
                <div key={item.num}>
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#1E6DF0]/20 text-[#1E6DF0] text-[11px] font-mono mb-4">
                    {item.num}
                  </span>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-[#888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── For Shops CTA ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="rounded-xl border border-white/[0.06] bg-[#111] p-8 md:p-12 text-center">
              <p className="text-[11px] font-medium text-[#1E6DF0] tracking-[0.2em] uppercase mb-3">Shops &amp; Brands</p>
              <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight mb-4">
                Your work deserves attribution.
              </h2>
              <p className="text-[14px] text-[#888] leading-relaxed mb-8 max-w-md mx-auto">
                When creators tag your shop on a build, you show up. New customers find you through
                the cars you&rsquo;ve worked on — not through paid ads.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-white font-medium bg-[#1E6DF0] hover:bg-[#3B82F6] px-6 py-2.5 rounded-md text-sm transition-colors"
              >
                Claim your shop page
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight mb-3">
              Join the waitlist.
            </h2>
            <p className="text-[14px] text-[#888] mb-8 max-w-sm mx-auto">
              We&rsquo;re launching soon. Early members get first access.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
