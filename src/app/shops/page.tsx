import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import WaitlistForm from "@/components/WaitlistForm";

export default function ShopsPage() {
  return (
    <>
      <Nav />
      <main>
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pt-24 pb-20 md:pt-32 md:pb-28 text-center">
          <p className="text-[12px] font-medium text-[#1E6DF0] tracking-[0.25em] uppercase mb-4">Coming Soon</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white tracking-tight mb-4">Shops</h1>
          <p className="text-[15px] text-[#888] leading-relaxed mb-10 max-w-md mx-auto">Find the workshops and installers behind the builds. This page is launching soon.</p>
          <WaitlistForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
