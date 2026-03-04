"use client";

import { useAuth } from "@/lib/auth-context";
import HomeFeed from "./HomeFeed";
import Nav from "./Nav";
import Footer from "./Footer";

export default function HomeRouter({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen" />
      </>
    );
  }

  if (user) {
    return (
      <>
        <Nav />
        <HomeFeed />
        <Footer />
      </>
    );
  }

  // Not logged in — show the marketing homepage (children)
  return <>{children}</>;
}
