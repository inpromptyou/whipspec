import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "WhipSpec";
  const subtitle = searchParams.get("subtitle") || "The automotive build platform for Australia";
  const type = searchParams.get("type") || "default";

  // Fetch the logo image as base64 for embedding
  const logoUrl = new URL("/og-logo.jpg", req.url).toString();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F172A",
          padding: "60px",
        }}
      >
        {/* Blue glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,109,240,0.3) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* WS Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoUrl}
          alt="WhipSpec"
          width={120}
          height={68}
          style={{ objectFit: "contain", marginBottom: "24px" }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: type === "profile" ? "48px" : "56px",
            fontWeight: 700,
            color: "white",
            textAlign: "center" as const,
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#94A3B8",
            marginTop: "16px",
            textAlign: "center" as const,
            maxWidth: "700px",
          }}
        >
          {subtitle}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#64748B" }}>whipspec.com</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
