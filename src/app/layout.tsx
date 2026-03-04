import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WhipSpec — Every Build Has a Story",
  description:
    "Australia's automotive build showcase. Discover the exact parts, shops, and brands behind the builds you love.",
  metadataBase: new URL("https://whipspec.com"),
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "WhipSpec — Every Build Has a Story",
    description:
      "Parts, shops, brands — attributed and discoverable.",
    url: "https://whipspec.com",
    siteName: "WhipSpec",
    locale: "en_AU",
    type: "website",
  },
  twitter: { card: "summary_large_image", site: "@whipspec" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-white text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
