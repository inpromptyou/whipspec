"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  children: React.ReactNode;
  href?: string; // if logged in, go here
  className?: string;
  onClick?: () => void;
}

export default function AuthButton({ children, href, className, onClick }: AuthButtonProps) {
  const { user, requireAuth } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!requireAuth()) return; // shows auth modal if not logged in
    if (onClick) {
      onClick();
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
