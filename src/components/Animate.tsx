"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface AnimateProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-in" | "blur-in";
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
}

export default function Animate({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  duration = 600,
  threshold = 0.15,
  once = true,
}: AnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const baseStyles: Record<string, { from: React.CSSProperties; to: React.CSSProperties }> = {
    "fade-up": {
      from: { opacity: 0, transform: "translateY(24px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
    "fade-in": {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    "fade-left": {
      from: { opacity: 0, transform: "translateX(-24px)" },
      to: { opacity: 1, transform: "translateX(0)" },
    },
    "fade-right": {
      from: { opacity: 0, transform: "translateX(24px)" },
      to: { opacity: 1, transform: "translateX(0)" },
    },
    "scale-in": {
      from: { opacity: 0, transform: "scale(0.95)" },
      to: { opacity: 1, transform: "scale(1)" },
    },
    "blur-in": {
      from: { opacity: 0, filter: "blur(8px)" },
      to: { opacity: 1, filter: "blur(0)" },
    },
  };

  const style = baseStyles[animation];
  const currentStyle = visible ? style.to : style.from;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...currentStyle,
        transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </div>
  );
}

// Stagger helper — wraps children with incremental delays
export function AnimateStagger({
  children,
  className = "",
  animation = "fade-up" as AnimateProps["animation"],
  staggerMs = 80,
  baseDelay = 0,
}: {
  children: ReactNode[];
  className?: string;
  animation?: AnimateProps["animation"];
  staggerMs?: number;
  baseDelay?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <Animate key={i} animation={animation} delay={baseDelay + i * staggerMs}>
          {child}
        </Animate>
      ))}
    </div>
  );
}
