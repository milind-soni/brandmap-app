import type { Metadata } from "next";
import EditorMapClient from "./editor-map-client";

type Props = {
  params: Promise<{ mapId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { mapId } = await params;
  const ogUrl = `/api/og?title=${encodeURIComponent("Map on factmaps")}`;

  return {
    title: `Map — factmaps`,
    openGraph: {
      title: "Map on factmaps",
      description: "Interactive map created with AI on factmaps.io",
      url: `https://factmaps.io/editor/${mapId}`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Map on factmaps",
      description: "Interactive map created with AI on factmaps.io",
      images: [ogUrl],
    },
  };
}

export default function EditorMapPage() {
  return <EditorMapClient />;
}
