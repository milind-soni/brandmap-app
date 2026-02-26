"use client";

import { useEffect, useRef, useState } from "react";

export function HeroMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let animationId: number;

    import("maplibre-gl").then(({ Map }) => {
      if (!containerRef.current || mapRef.current) return;

      const map = new Map({
        container: containerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap",
            },
          },
          layers: [
            {
              id: "osm",
              type: "raster",
              source: "osm",
            },
          ],
        },
        center: [-73.985, 40.748],
        zoom: 13,
        pitch: 45,
        bearing: -17.6,
        interactive: false,
        attributionControl: false,
      });

      mapRef.current = map;

      let bearing = -17.6;
      const animate = () => {
        bearing += 0.008;
        map.setBearing(bearing);
        animationId = requestAnimationFrame(animate);
      };

      map.on("load", () => {
        setLoaded(true);
        animate();
      });
    });

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/maplibre-gl@5.19.0/dist/maplibre-gl.css"
      />
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          filter:
            "saturate(0) brightness(0.4) sepia(0.4) hue-rotate(-10deg)",
          opacity: loaded ? 1 : 0,
          transition: "opacity 1.5s ease-in",
        }}
      />
    </>
  );
}
