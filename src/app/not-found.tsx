import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center max-w-md">
          <Image src="/logo.png" alt="WhipSpec" width={56} height={36} className="object-contain mx-auto mb-6" />
          <h1 className="font-[family-name:var(--font-playfair)] text-[4rem] text-[#0F172A] tracking-tight leading-none mb-2">404</h1>
          <p className="text-[17px] font-semibold text-[#0F172A] mb-2">Page not found</p>
          <p className="text-[14px] text-[#64748B] mb-8">
            This page doesn&apos;t exist or has been moved. Check the URL or head back to discover builds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="inline-flex items-center justify-center bg-[#0F172A] text-white text-[13px] font-medium px-6 py-2.5 rounded-lg hover:bg-[#1E293B] transition-colors">
              Go home
            </Link>
            <Link href="/discover" className="inline-flex items-center justify-center border border-slate-200 text-[#0F172A] text-[13px] font-medium px-6 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
              Discover builds
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
