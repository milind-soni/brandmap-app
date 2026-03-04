import type { Metadata } from "next";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { PostHogProvider } from "@/components/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "factmaps — Beautiful maps created with AI",
  description:
    "Create beautiful embeddable maps with AI. One prompt, embed anywhere. Custom colors, no code, flat pricing.",
  metadataBase: new URL("https://factmaps.io"),
  openGraph: {
    title: "factmaps — Beautiful maps created with AI",
    description:
      "Create beautiful embeddable maps with AI. One prompt, embed anywhere. $5/mo.",
    url: "https://factmaps.io",
    siteName: "factmaps",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "factmaps - Beautiful maps created with AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "factmaps — Beautiful maps created with AI",
    description:
      "One prompt. Embed anywhere. Custom colors, no code, $5/mo.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-website-id="dfid_UGOD26GZoKOkpDsbjO8BH"
          data-domain="www.factmaps.io"
          data-allow-localhost="true"
          src="https://datafa.st/js/script.js"
        />
      </head>
      <body>
        <ConvexClientProvider>
          <PostHogProvider>{children}</PostHogProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
