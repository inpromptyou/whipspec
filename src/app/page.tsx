import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

const SAMPLE_BUILDS = [
  { car: "R34 GT-R", owner: "@nismo_jay", tags: ["Rays TE37", "KW V3", "Craft Square", "HKS Exhaust"] },
  { car: "E46 M3", owner: "@m3culture", tags: ["BBS LM", "Ohlins Road & Track", "CSL Airbox"] },
  { car: "GR Yaris", owner: "@yaris.au", tags: ["Enkei NT03", "Whiteline Sway Bars", "Invidia N1"] },
  { car: "S15 Silvia", owner: "@silvia.spec", tags: ["Work Meister", "BC Racing", "Yashio Factory"] },
  { car: "FK8 Civic Type R", owner: "@fk8daily", tags: ["Volk CE28N", "Tein Flex Z", "Spoon Sports"] },
  { car: "A90 Supra", owner: "@mkv.aus", tags: ["Advan GT", "KW HAS", "Akrapovic Evo"] },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero ─── */}
        <section className="relative">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28">
            <div className="max-w-2xl">
              <h1 className="font-serif text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] text-[#1A1A1A] leading-[1.05] tracking-tight mb-5">
                Every build has<br />a story.
              </h1>
              <p className="text-base md:text-lg text-[#4A4A4A] leading-relaxed mb-8 max-w-lg">
                The platform where Australia&rsquo;s best builds get the credit they deserve.
                Parts, shops, brands &mdash; all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center text-white bg-[#2D5A3D] hover:bg-[#3A7A52] px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
                >
                  Explore Builds
                </Link>
                <Link
                  href="/shops"
                  className="inline-flex items-center justify-center text-[#2D5A3D] hover:text-[#3A7A52] px-6 py-2.5 rounded-md text-sm font-medium transition-colors border border-[#2D5A3D]/20 hover:border-[#2D5A3D]/40"
                >
                  List Your Shop
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── The Problem ─── */}
        <section className="border-y border-[#E8E6E1]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-widest mb-3">The problem</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tight">
                The specs always get lost.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  question: "&ldquo;What wheels are those?&rdquo;",
                  desc: "Every car post. Every comment section. The same question, buried in replies that never get answered.",
                },
                {
                  question: "&ldquo;Who wrapped it?&rdquo;",
                  desc: "Great shops do incredible work but rarely get credited. Their best marketing disappears into someone else's feed.",
                },
                {
                  question: "&ldquo;Where did they get that done?&rdquo;",
                  desc: "Followers want to build something similar but have no way to find the businesses behind the builds they love.",
                },
              ].map((item) => (
                <div key={item.question} className="text-center">
                  <h3
                    className="font-serif text-xl text-[#1A1A1A] mb-3"
                    dangerouslySetInnerHTML={{ __html: item.question }}
                  />
                  <p className="text-[13px] text-[#4A4A4A] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section>
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="text-center mb-14">
              <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-widest mb-3">How it works</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tight">
                Three steps. Full credit.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  step: "01",
                  title: "Create Your Build",
                  desc: "Add your car — make, model, year. Upload photos. This is your build page, your portfolio piece.",
                },
                {
                  step: "02",
                  title: "Tag Your Setup",
                  desc: "List every mod with the brand and shop that did the work. Wheels, suspension, wrap, exhaust — everything gets attributed.",
                },
                {
                  step: "03",
                  title: "Get Discovered",
                  desc: "Your build becomes searchable. Shops get credited. Followers find exactly what they're looking for.",
                },
              ].map((item) => (
                <div key={item.step}>
                  <span className="text-[11px] font-mono text-[#2D5A3D] tracking-wider">{item.step}</span>
                  <h3 className="text-base font-semibold text-[#1A1A1A] mt-1 mb-2">{item.title}</h3>
                  <p className="text-[13px] text-[#4A4A4A] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Featured Builds ─── */}
        <section className="border-y border-[#E8E6E1] bg-[#F5F4F0]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-widest mb-3">Featured</p>
                <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tight">
                  Builds worth knowing.
                </h2>
              </div>
              <Link href="/discover" className="hidden sm:inline-flex text-[13px] text-[#2D5A3D] hover:text-[#3A7A52] font-medium transition-colors">
                View all
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SAMPLE_BUILDS.map((build) => (
                <div
                  key={build.car}
                  className="bg-white rounded-lg border border-[#E8E6E1] overflow-hidden hover:shadow-sm transition-shadow cursor-pointer group"
                >
                  {/* Image placeholder */}
                  <div className="aspect-[16/10] bg-[#E8E6E1] relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#B5B3AE]">
                        <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#2D5A3D] transition-colors">
                        {build.car}
                      </h3>
                      <span className="text-[11px] text-[#9A9A9A]">{build.owner}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {build.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-[#2D5A3D] bg-[#2D5A3D]/[0.06] px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="sm:hidden mt-6 text-center">
              <Link href="/discover" className="text-[13px] text-[#2D5A3D] font-medium">View all builds</Link>
            </div>
          </div>
        </section>

        {/* ─── For Shops ─── */}
        <section>
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-widest mb-3">For shops &amp; brands</p>
              <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tight mb-4">
                Your work, credited properly.
              </h2>
              <p className="text-[13px] text-[#4A4A4A] leading-relaxed mb-8 max-w-md mx-auto">
                When a build tags your shop, you show up on their page. Every wrap, every install, every set of wheels &mdash;
                linked back to you. Discovery without the ad spend.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {[
                  { metric: "Attribution", desc: "Get credited every time your work appears on a build" },
                  { metric: "Discovery", desc: "New customers find you through the builds they love" },
                  { metric: "Credibility", desc: "A portfolio of tagged builds speaks louder than any ad" },
                ].map((item) => (
                  <div key={item.metric} className="text-center">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1">{item.metric}</h3>
                    <p className="text-[12px] text-[#9A9A9A] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/shops"
                className="inline-flex items-center justify-center text-white bg-[#2D5A3D] hover:bg-[#3A7A52] px-6 py-2.5 rounded-md text-sm font-medium transition-colors"
              >
                List Your Shop
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="border-t border-[#E8E6E1] bg-[#F5F4F0]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-20 md:py-24 text-center">
            <h2 className="font-serif text-2xl md:text-3xl text-[#1A1A1A] tracking-tight mb-3">
              The builds you love.<br />
              <span className="text-[#9A9A9A]">The specs you need.</span>
            </h2>
            <p className="text-[13px] text-[#4A4A4A] mb-8 max-w-sm mx-auto">
              Be the first to know when WhipSpec launches. Early members get priority access.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
