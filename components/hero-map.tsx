"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const DARK_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "brandmap-hero",
  sources: {
    carto: {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "&copy; CARTO &copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "carto-tiles",
      type: "raster",
      source: "carto",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
  // Tint the whole map with a warm tone via the background
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
};

export function HeroMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: DARK_STYLE,
      center: [-73.985, 40.748], // Manhattan
      zoom: 13.5,
      pitch: 45,
      bearing: -17.6,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
    });

    mapRef.current = map;

    // Slow auto-pan
    let animationId: number;
    let bearing = -17.6;

    const animate = () => {
      bearing += 0.01;
      map.setBearing(bearing);
      animationId = requestAnimationFrame(animate);
    };

    map.on("load", () => {
      animate();
    });

    return () => {
      cancelAnimationFrame(animationId);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      style={{
        filter: "sepia(0.3) saturate(1.2) hue-rotate(-15deg) brightness(0.4)",
      }}
    />
  );
}
