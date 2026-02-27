import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Beautiful maps created with AI.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "60px",
          backgroundColor: "#1a1a1a",
          color: "#f0f0e8",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          factmaps.
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            marginTop: 24,
            color: "#cd8c52",
            maxWidth: 800,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            marginTop: 16,
            color: "#888",
          }}
        >
          One prompt. Embed anywhere. $5/mo.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
