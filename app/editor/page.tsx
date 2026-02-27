"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";
import { MapRenderer, useMapStream, type MapSpec } from "json-maps";
import { ChatPanel, type ChatMessage } from "@/components/editor/chat-panel";
import { EmbedModal } from "@/components/editor/embed-modal";
import { MapScreenshot } from "@/components/map-screenshot";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

function deriveMapName(prompt: string): string {
  if (!prompt) return "Untitled Map";
  const truncated = prompt.slice(0, 50);
  return (
    truncated.charAt(0).toUpperCase() +
    truncated.slice(1) +
    (prompt.length > 50 ? "..." : "")
  );
}

export default function EditorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const lastPromptRef = useRef("");
  const savedMapIdRef = useRef<Id<"maps"> | null>(null);
  const [needsScreenshot, setNeedsScreenshot] = useState(false);

  const saveMap = useMutation(api.maps.save);

  const { spec, isStreaming, streamText, toolCalls, send, stop, setSpec } = useMapStream({
    api: "/api/generate",
    onComplete: async (completedSpec: MapSpec) => {
      setHasGenerated(true);
      try {
        const mapId = await saveMap({
          name: deriveMapName(lastPromptRef.current),
          spec: completedSpec,
          prompt: lastPromptRef.current,
        });
        savedMapIdRef.current = mapId;
        setNeedsScreenshot(true);
        window.history.replaceState(null, "", `/editor/${mapId}`);
      } catch {
        // Save failed silently — map still visible in editor
      }
    },
  });

  // Show a default street map on load
  useEffect(() => {
    setSpec({ basemap: "streets" } as MapSpec);
  }, [setSpec]);

  const handleSend = useCallback(
    async (prompt: string) => {
      lastPromptRef.current = prompt;
      setMessages((prev) => [...prev, { role: "user", content: prompt }]);

      const isRefinement = hasGenerated && Object.keys(spec).length > 0;

      await send(prompt, isRefinement ? { previousSpec: spec } : undefined);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Map updated." },
      ]);
    },
    [send, spec, hasGenerated],
  );

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  const handleScreenshot = useCallback(
    async (dataUrl: string) => {
      setNeedsScreenshot(false);
      const mapId = savedMapIdRef.current;
      if (!mapId) return;
      try {
        await saveMap({
          mapId,
          name: deriveMapName(lastPromptRef.current),
          spec,
          thumbnail: dataUrl,
        });
      } catch {
        // Thumbnail save failed silently
      }
    },
    [saveMap, spec],
  );

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
        </div>
        <button
          onClick={() => setEmbedOpen(true)}
          disabled={!hasSpec}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#8b4513] text-[#f0f0e8] border-2 border-[#1a1a1a] font-bold text-sm uppercase tracking-wide hover:bg-[#a0522d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-[3px_3px_0px_0px_#1a1a1a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[2px_2px_0px_0px_#1a1a1a]"
        >
          <Code className="w-4 h-4" />
          Embed
        </button>
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

        {/* Map preview */}
        <div className="flex-1 bg-[#1a1a1a] relative">
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
