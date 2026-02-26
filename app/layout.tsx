import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "brandmap — Beautiful branded maps for your website",
  description:
    "Create embeddable maps that match your brand. Custom colors, no code, flat pricing. Stop using ugly Google Maps embeds.",
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
