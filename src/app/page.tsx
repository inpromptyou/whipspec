import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

const FEATURED_BUILDS = [
  {
    car: "Nissan R34 GT-R",
    owner: "@nismo_jay",
    image: "https://images.unsplash.com/photo-1630046029586-dbe94f891617?w=600&h=400&fit=crop",
    tags: ["Rays TE37", "KW V3", "HKS GT-SS Turbo", "Craft Square"],
  },
  {
    car: "BMW E46 M3",
    owner: "@m3culture",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&h=400&fit=crop",
    tags: ["BBS LM", "Ohlins R&T", "CSL Airbox"],
  },
  {
    car: "Toyota GR Yaris",
    owner: "@yaris.aus",
    image: "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=600&h=400&fit=crop",
    tags: ["Enkei NT03", "Whiteline", "Invidia N1"],
  },
  {
    car: "Nissan S15 Silvia",
    owner: "@silvia.spec",
    image: "https://images.unsplash.com/photo-1580274455191-1c62238ce452?w=600&h=400&fit=crop",
    tags: ["Work Meister", "BC Racing", "Yashio Factory"],
  },
  {
    car: "Honda FK8 Type R",
    owner: "@fk8daily",
    image: "https://images.unsplash.com/photo-1679239872433-81e0e1e4fb48?w=600&h=400&fit=crop",
    tags: ["Volk CE28N", "Tein Flex Z", "Spoon Sports"],
  },
  {
    car: "Toyota A90 Supra",
    owner: "@mkv.aus",
    image: "https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=600&h=400&fit=crop",
    tags: ["Advan GT", "KW HAS", "Akrapovic Evo"],
  },
];

const BRANDS = [
  "Rays", "Work Wheels", "BBS", "Enkei", "Volk Racing", "Advan",
  "KW Suspension", "Ohlins", "BC Racing", "Tein", "HKS", "Akrapovic",
];

const SHOP_FEATURES = [
  {
    title: "Get Tagged",
    desc: "When a build credits your shop, your name appears on their spec sheet. Automatic attribution for every install.",
  },
  {
    title: "Get Found",
    desc: "New customers discover you through the builds they see online. No ad spend, no cold DMs. Just great work.",
  },
  {
    title: "Build Credibility",
    desc: "A portfolio of real tagged builds speaks louder than any ad. Show the work. Let the cars do the talking.",
  },
];

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00B4D8]/[0.04] to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00B4D8]/[0.06] blur-[120px] rounded-full" />

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-16 md:pt-36 md:pb-24">
            <div className="max-w-3xl">
              <p className="text-[12px] font-medium text-[#00B4D8] uppercase tracking-[0.2em] mb-4">
                Australia&rsquo;s Build Platform
              </p>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-white leading-[0.95] tracking-wide mb-6">
                KNOW WHAT<br />
                YOU&rsquo;RE<br />
                LOOKING AT.
              </h1>
              <p className="text-base md:text-lg text-[#888] leading-relaxed mb-8 max-w-md">
                Every part. Every shop. Every brand. The full spec sheet behind the builds you see online.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center text-black font-medium bg-[#00B4D8] hover:bg-[#00D4FF] px-7 py-3 rounded text-sm transition-colors"
                >
                  Explore Builds
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center text-white hover:text-[#00B4D8] px-7 py-3 rounded text-sm font-medium transition-colors border border-white/[0.12] hover:border-[#00B4D8]/40"
                >
                  Add Your Build
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Featured Builds ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-[11px] font-medium text-[#00B4D8] uppercase tracking-[0.15em] mb-1">Featured</p>
                <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">TRENDING BUILDS</h2>
              </div>
              <Link href="/discover" className="hidden sm:inline-flex text-[13px] text-[#00B4D8] hover:text-[#00D4FF] font-medium transition-colors">
                View all
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURED_BUILDS.map((build) => (
                <div
                  key={build.car}
                  className="group bg-[#111] rounded-lg border border-white/[0.06] overflow-hidden hover:border-[#00B4D8]/20 transition-all cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={build.image}
                      alt={build.car}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white group-hover:text-[#00B4D8] transition-colors">{build.car}</h3>
                      <span className="text-[11px] text-[#555]">{build.owner}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {build.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium text-[#00B4D8] bg-[#00B4D8]/[0.08] px-2 py-0.5 rounded"
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
              <Link href="/discover" className="text-[13px] text-[#00B4D8] font-medium">View all builds</Link>
            </div>
          </div>
        </section>

        {/* ─── Brands ─── */}
        <section className="border-t border-white/[0.06] bg-[#080808]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14">
            <p className="text-center text-[11px] font-medium text-[#555] uppercase tracking-[0.15em] mb-8">
              Brands on WhipSpec
            </p>
            <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
              {BRANDS.map((brand) => (
                <span key={brand} className="text-[13px] text-[#555] hover:text-[#00B4D8] transition-colors cursor-pointer font-medium">
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── How It Works ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <p className="text-[11px] font-medium text-[#00B4D8] uppercase tracking-[0.15em] mb-1">How it works</p>
              <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">THREE STEPS. FULL SPEC.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create Your Build",
                  desc: "Add your car. Upload the shots. This is your build page — your portfolio piece for the car scene.",
                },
                {
                  step: "02",
                  title: "Tag Every Part",
                  desc: "Wheels, suspension, wrap, exhaust, interior — tag the brand and the shop that did the work. Everything gets credited.",
                },
                {
                  step: "03",
                  title: "Get Discovered",
                  desc: "Your build becomes searchable. Shops get found. Followers find exactly what they need to build their own.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[#00B4D8]/20 text-[#00B4D8] text-[12px] font-mono mb-4">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-[#888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── For Shops ─── */}
        <section className="border-t border-white/[0.06] bg-[#080808]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="text-center mb-12">
              <p className="text-[11px] font-medium text-[#00B4D8] uppercase tracking-[0.15em] mb-1">For shops & brands</p>
              <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide">YOUR WORK. YOUR CREDIT.</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {SHOP_FEATURES.map((item) => (
                <div key={item.title} className="bg-[#111] rounded-lg border border-white/[0.06] p-6">
                  <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[13px] text-[#888] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/shops"
                className="inline-flex items-center justify-center text-black font-medium bg-[#00B4D8] hover:bg-[#00D4FF] px-7 py-3 rounded text-sm transition-colors"
              >
                List Your Shop
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Advertise ─── */}
        <section className="border-t border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="bg-gradient-to-r from-[#00B4D8]/[0.08] to-[#0077B6]/[0.08] rounded-xl border border-[#00B4D8]/10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <p className="text-[11px] font-medium text-[#00B4D8] uppercase tracking-[0.15em] mb-1">Advertise</p>
                  <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide mb-3">REACH THE SCENE</h2>
                  <p className="text-[13px] text-[#888] leading-relaxed mb-6 max-w-md">
                    Put your brand in front of Australia&rsquo;s most engaged automotive audience.
                    Featured placements, sponsored builds, and brand showcases.
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center text-[#00B4D8] hover:text-[#00D4FF] px-5 py-2 rounded text-sm font-medium transition-colors border border-[#00B4D8]/20 hover:border-[#00B4D8]/40"
                  >
                    Get in touch
                  </Link>
                </div>
                <div className="flex gap-4 text-center">
                  {[
                    { stat: "50K+", label: "Monthly views" },
                    { stat: "12K+", label: "Builds listed" },
                    { stat: "800+", label: "Tagged shops" },
                  ].map((s) => (
                    <div key={s.label}>
                      <span className="font-display text-2xl text-[#00B4D8] block">{s.stat}</span>
                      <span className="text-[10px] text-[#555]">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="border-t border-white/[0.06] bg-[#080808]">
          <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-20 text-center">
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-wide mb-2">
              THE BUILDS YOU LOVE.
            </h2>
            <p className="font-display text-3xl md:text-4xl text-[#555] tracking-wide mb-6">
              THE SPECS YOU NEED.
            </p>
            <p className="text-[13px] text-[#888] mb-8 max-w-sm mx-auto">
              Be first to know when WhipSpec launches. Early members get priority access.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
