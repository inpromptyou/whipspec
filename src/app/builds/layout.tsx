import type { Metadata } from "next";
export const metadata: Metadata = { title: "Builds - WhipSpec", description: "Every tagged build on WhipSpec." };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
