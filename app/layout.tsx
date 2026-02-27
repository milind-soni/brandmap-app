import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "factmaps — Beautiful maps created with AI",
  description:
    "Create beautiful embeddable maps with AI. One prompt, embed anywhere. Custom colors, no code, flat pricing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
