import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhipSpec — Know What You're Looking At",
  description: "Australia's automotive build showcase. Discover the exact parts, shops, and brands behind the builds you love.",
  metadataBase: new URL("https://whipspec.com"),
  openGraph: {
    title: "WhipSpec — Know What You're Looking At",
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
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-[#0A0A0A] text-white">{children}</body>
    </html>
  );
}
