"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code, Map, Film } from "lucide-react";
import {
  MapRenderer,
  useMapStream,
  AnimationPlayer,
  useAnimationStream,
  type MapSpec,
  type AnimationSpec,
  type AnimationPlayerHandle,
} from "json-maps";
import { ChatPanel, type ChatMessage } from "@/components/editor/chat-panel";
import { EmbedModal } from "@/components/editor/embed-modal";
import { AnimationControls } from "@/components/editor/animation-controls";
import { MapScreenshot } from "@/components/map-screenshot";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type EditorMode = "map" | "animation";

export default function EditorMapClient() {
  const params = useParams();
  const mapId = params.mapId as Id<"maps">;

  const existingMap = useQuery(api.maps.get, { mapId });
  const saveMap = useMutation(api.maps.save);

  const [mode, setMode] = useState<EditorMode>("map");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [needsScreenshot, setNeedsScreenshot] = useState(false);

  // Animation state
  const animationPlayerRef = useRef<AnimationPlayerHandle>(null);
  const [animIsPlaying, setAnimIsPlaying] = useState(false);
  const [animCurrentTime, setAnimCurrentTime] = useState(0);
  const [animSpeed, setAnimSpeed] = useState(1);

  // Map generation
  const {
    spec,
    isStreaming: mapIsStreaming,
    streamText: mapStreamText,
    toolCalls: mapToolCalls,
    send: mapSend,
    stop: mapStop,
    setSpec,
  } = useMapStream({
    api: "/api/generate",
    onComplete: async (completedSpec: MapSpec) => {
      setHasGenerated(true);
      try {
        await saveMap({
          mapId,
          name: existingMap?.name || "Untitled Map",
          spec: completedSpec,
        });
        setNeedsScreenshot(true);
      } catch {
        // Save failed silently
      }
    },
  });

  // Animation generation
  const {
    animationSpec,
    isStreaming: animIsStreaming,
    streamText: animStreamText,
    toolCalls: animToolCalls,
    send: animSend,
    stop: animStop,
  } = useAnimationStream({
    api: "/api/generate-animation",
    onComplete: () => {
      setHasGenerated(true);
      setTimeout(() => {
        animationPlayerRef.current?.play();
        setAnimIsPlaying(true);
      }, 500);
    },
  });

  // Derived state based on mode
  const isStreaming = mode === "map" ? mapIsStreaming : animIsStreaming;
  const streamText = mode === "map" ? mapStreamText : animStreamText;
  const toolCalls = mode === "map" ? mapToolCalls : animToolCalls;

  // Load existing map spec once
  useEffect(() => {
    if (existingMap?.spec && !loaded) {
      setSpec(existingMap.spec as MapSpec);
      setHasGenerated(true);
      setLoaded(true);
    }
  }, [existingMap, loaded, setSpec]);

  const handleSend = useCallback(
    async (prompt: string) => {
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);

      if (mode === "map") {
        const isRefinement = hasGenerated && Object.keys(spec).length > 0;
        await mapSend(prompt, isRefinement ? { previousSpec: spec } : undefined);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Map updated." },
        ]);
      } else {
        await animSend(prompt);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Animation created." },
        ]);
      }
    },
    [mode, mapSend, animSend, spec, hasGenerated],
  );

  const handleStop = useCallback(() => {
    if (mode === "map") mapStop();
    else animStop();
  }, [mode, mapStop, animStop]);

  const handleScreenshot = useCallback(
    async (dataUrl: string) => {
      setNeedsScreenshot(false);
      try {
        await saveMap({
          mapId,
          name: existingMap?.name || "Untitled Map",
          spec,
          thumbnail: dataUrl,
        });
      } catch {
        // Thumbnail save failed silently
      }
    },
    [saveMap, mapId, existingMap?.name, spec],
  );

  const handleAnimPlayPause = useCallback(() => {
    if (animIsPlaying) {
      animationPlayerRef.current?.pause();
      setAnimIsPlaying(false);
    } else {
      animationPlayerRef.current?.play();
      setAnimIsPlaying(true);
    }
  }, [animIsPlaying]);

  const handleAnimSeek = useCallback((time: number) => {
    animationPlayerRef.current?.seek(time);
    setAnimCurrentTime(time);
  }, []);

  if (existingMap === undefined) {
    return (
      <div className="h-screen flex items-center justify-center font-mono bg-[#f0f0e8]">
        <span className="text-[#888]">Loading map...</span>
      </div>
    );
  }

  if (existingMap === null) {
    return (
      <div className="h-screen flex items-center justify-center font-mono bg-[#f0f0e8]">
        <span className="text-[#888]">Map not found.</span>
      </div>
    );
  }

  const hasSpec = Object.keys(spec).length > 0;

  return (
    <div className="h-screen flex flex-col font-mono selection:bg-[#8b4513] selection:text-[#f0f0e8]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 py-3 border-b-2 border-[#1a1a1a] bg-[#f0f0e8] shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/maps"
            className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide hover:text-[#8b4513] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-xl font-black tracking-tighter">
            factmaps.
          </span>
          <span className="text-sm text-[#888] truncate max-w-[200px]">
            {existingMap.name}
          </span>

          {/* Mode toggle */}
          <div className="flex border-2 border-[#1a1a1a] bg-white">
            <button
              onClick={() => setMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                mode === "map"
                  ? "bg-[#1a1a1a] text-[#f0f0e8]"
                  : "text-[#888] hover:text-[#1a1a1a]"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              Map
            </button>
            <button
              onClick={() => setMode("animation")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                mode === "animation"
                  ? "bg-[#1a1a1a] text-[#f0f0e8]"
                  : "text-[#888] hover:text-[#1a1a1a]"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              Animate
            </button>
          </div>
        </div>

        {mode === "map" && (
          <button
            onClick={() => setEmbedOpen(true)}
            disabled={!hasSpec}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#8b4513] text-[#f0f0e8] border-2 border-[#1a1a1a] font-bold text-sm uppercase tracking-wide hover:bg-[#a0522d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#1a1a1a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_#1a1a1a]"
          >
            <Code className="w-4 h-4" />
            Embed
          </button>
        )}
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat sidebar */}
        <div className="w-full md:w-[380px] md:min-w-[380px] border-b-2 md:border-b-0 md:border-r-2 border-[#1a1a1a] h-[40vh] md:h-auto overflow-hidden">
          <ChatPanel
            messages={messages}
            isStreaming={isStreaming}
            streamText={streamText}
            toolCalls={toolCalls}
            onSend={handleSend}
            onStop={handleStop}
          />
        </div>

        {/* Preview panel */}
        <div className="flex-1 bg-[#1a1a1a] relative flex flex-col">
          {mode === "map" ? (
            <div className="flex-1 relative">
              {hasSpec ? (
                <MapRenderer spec={spec} className="w-full h-full">
                  {needsScreenshot && <MapScreenshot onCapture={handleScreenshot} />}
                </MapRenderer>
              ) : (
                <div className="flex items-center justify-center h-full text-[#888] text-center px-8">
                  <div>
                    <div className="text-6xl font-black tracking-tighter text-[#333] mb-4">
                      ?
                    </div>
                    <p className="text-sm font-medium">
                      Your map will appear here once you send a prompt.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="flex-1 relative">
                {animationSpec ? (
                  <AnimationPlayer
                    ref={animationPlayerRef}
                    mapSpec={{ basemap: "streets" }}
                    animationSpec={animationSpec}
                    className="w-full h-full"
                    speed={animSpeed}
                    onTimeUpdate={setAnimCurrentTime}
                    onComplete={() => setAnimIsPlaying(false)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[#888] text-center px-8">
                    <div>
                      <div className="text-5xl font-black tracking-tighter text-[#333] mb-4">
                        <Film className="w-12 h-12 mx-auto opacity-30" />
                      </div>
                      <p className="text-sm font-medium">
                        Describe an animation — fly between cities, zoom into a landmark, orbit a location.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {animationSpec && (
                <AnimationControls
                  playerRef={animationPlayerRef}
                  isPlaying={animIsPlaying}
                  currentTime={animCurrentTime}
                  duration={animationSpec.duration}
                  speed={animSpeed}
                  onSpeedChange={setAnimSpeed}
                  onPlayPause={handleAnimPlayPause}
                  onSeek={handleAnimSeek}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Embed modal */}
      <EmbedModal
        open={embedOpen}
        onClose={() => setEmbedOpen(false)}
        spec={spec}
      />
    </div>
  );
}
