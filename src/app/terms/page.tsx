import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

export default function TermsofServicePage() {
  return (
    <>
      <Nav />
      <main>
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-32 pb-20 md:pt-40 md:pb-28 text-center">
          <p className="text-[11px] font-semibold text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Coming Soon</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl text-[#0F172A] tracking-tight mb-4">Terms of Service</h1>
          <p className="text-[15px] text-[#64748B] leading-relaxed mb-10 max-w-md mx-auto">Terms for using WhipSpec. This page is launching soon.</p>
          <WaitlistForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
