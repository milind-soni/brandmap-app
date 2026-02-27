import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title =
    searchParams.get("title") || "Beautiful maps created with AI.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: "#1a1a1a",
          fontFamily: "monospace",
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.08,
            backgroundImage:
              "linear-gradient(#f0f0e8 1px, transparent 1px), linear-gradient(90deg, #f0f0e8 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#8b4513",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "60px 70px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Map pin icon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#8b4513",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              📍
            </div>
          </div>

          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: "#f0f0e8",
            }}
          >
            factmaps.
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              marginTop: 20,
              color: "#cd8c52",
              maxWidth: 800,
              lineHeight: 1.3,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 500,
              marginTop: 16,
              color: "#666",
            }}
          >
            One prompt. Embed anywhere. No code.
          </div>
        </div>

        {/* Corner decoration */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 70,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 16,
              color: "#555",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            factmaps.io
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
