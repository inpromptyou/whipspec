export const ds = {
  colors: {
    bg: "#0A0A0A",
    surface: "#111111",
    surfaceHover: "#1A1A1A",
    card: "#141414",
    cardHover: "#1C1C1C",
    border: "#222222",
    borderLight: "#2A2A2A",

    text: "#FFFFFF",
    textBody: "#E0E0E0",
    textSecondary: "#888888",
    textMuted: "#555555",

    // Cyan accent — matches the WS logo gradient
    accent: "#00B4D8",
    accentHover: "#00D4FF",
    accentDim: "#00B4D840",
    accentGlow: "#00B4D820",

    // Secondary blue for gradients
    blue: "#0077B6",
    blueLight: "#48CAE4",

    white: "#FFFFFF",
    black: "#000000",
  },
  fonts: {
    display: "var(--font-bebas)",
    sans: "var(--font-inter)",
  },
} as const;
