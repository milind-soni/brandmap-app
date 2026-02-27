"use client";

import { useEffect, useRef } from "react";
import { useMap } from "json-maps";

export function MapScreenshot({
  onCapture,
}: {
  onCapture: (dataUrl: string) => void;
}) {
  const { map, isLoaded } = useMap();
  const capturedRef = useRef(false);

  useEffect(() => {
    if (!map || !isLoaded || capturedRef.current) return;

    const capture = () => {
      // Force a repaint, then capture on the next render frame
      map.triggerRepaint();
      map.once("render", () => {
        try {
          const canvas = map.getCanvas();
          const dataUrl = canvas.toDataURL("image/webp", 0.6);
          // Sanity check: skip if the image is too small (likely blank/black)
          if (dataUrl.length < 1000) return;
          capturedRef.current = true;
          onCapture(dataUrl);
        } catch {
          // Canvas capture can fail due to tainted canvas (CORS tiles)
        }
      });
    };

    // Wait for map to be fully idle (tiles loaded + rendered)
    const waitAndCapture = () => {
      // Extra delay after idle to let all tile textures upload to GPU
      setTimeout(capture, 1500);
    };

    if (map.areTilesLoaded() && map.isStyleLoaded()) {
      waitAndCapture();
    } else {
      map.once("idle", waitAndCapture);
    }
  }, [map, isLoaded, onCapture]);

  return null;
}
