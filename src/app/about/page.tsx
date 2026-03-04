import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
          <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">About</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-[2.75rem] text-[#0F172A] tracking-tight leading-tight mb-6">
            Cars are taste.<br /><em className="italic">We built the spec sheet.</em>
          </h1>

          <div className="space-y-6 text-[15px] text-[#475569] leading-relaxed">
            <p>
              WhipSpec exists because automotive discovery is broken. Every day, creators post builds
              and get flooded with the same questions: &ldquo;What wheels?&rdquo; &ldquo;Who did the wrap?&rdquo;
              &ldquo;Where did you get that?&rdquo; The answers get buried in comments and DMs. Parts go
              unattributed. Shops miss out on leads. Followers give up searching.
            </p>
            <p>
              We&rsquo;re building the missing layer between social content and the $58 billion
              Australian automotive aftermarket. A platform where every build gets a proper spec sheet —
              with every part, every brand, and every shop attributed and discoverable.
            </p>
            <p>
              For <strong className="text-[#0F172A]">creators</strong>, WhipSpec replaces repetitive DMs
              with a single link. Upload your build, tag the mods, and let your spec sheet do the talking.
            </p>
            <p>
              For <strong className="text-[#0F172A]">followers</strong>, it&rsquo;s the fastest way to
              find the exact parts and workshops behind the builds you love. No more guessing, no more
              digging through comment sections.
            </p>
            <p>
              For <strong className="text-[#0F172A]">shops and brands</strong>, it&rsquo;s attribution
              that actually works. When your work shows up on a build, you get credited. New customers
              find you through the cars you&rsquo;ve touched — not through paid ads.
            </p>
            <p>
              WhipSpec is built in Australia, for the Australian car scene. We&rsquo;re starting with the
              community that knows its cars best.
            </p>
          </div>

          {/* How it works */}
          <div className="mt-16 pt-12 border-t border-slate-100">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-[#0F172A] tracking-tight mb-8">How it works</h2>
            <div className="space-y-8">
              {[
                { num: "01", title: "Upload your build", desc: "Add photos and basic details about your car. We help draft the mod list so you're not typing every part manually." },
                { num: "02", title: "Tag parts and shops", desc: "Attribute every modification — the brand, the specific product, and the shop that installed it. Everyone gets proper credit." },
                { num: "03", title: "Share your spec", desc: "Drop the link in your bio. Followers get the full breakdown. Shops get the leads. You stop answering the same questions." },
              ].map((step) => (
                <div key={step.num} className="flex gap-4">
                  <span className="text-[12px] font-mono text-[#1E6DF0] mt-0.5">{step.num}</span>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A] mb-1">{step.title}</h3>
                    <p className="text-[14px] text-[#64748B] leading-relaxed">{step.desc}</p>
                  </div>
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
