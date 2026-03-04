"use client";

// Homepage always shows the marketing page regardless of auth state.
// Logged-in users get HomeFeed via /dashboard.
export default function HomeRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
