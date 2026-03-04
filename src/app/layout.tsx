import type { Metadata } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhipSpec — Every Build Has a Story",
  description: "Australia's automotive build showcase. Discover the exact parts, shops, and brands behind the builds you love.",
  metadataBase: new URL("https://whipspec.com"),
  openGraph: {
    title: "WhipSpec — Every Build Has a Story",
    description: "Australia's automotive build showcase. Parts, shops, brands — all in one place.",
    url: "https://whipspec.com",
    siteName: "WhipSpec",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@whipspec",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-[#EDEDED]">{children}</body>
    </html>
  );
}
