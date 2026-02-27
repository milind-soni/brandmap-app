"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Code } from "lucide-react";
import { MapRenderer, useMapStream, type MapSpec } from "json-maps";
import { ChatPanel, type ChatMessage } from "@/components/editor/chat-panel";
import { EmbedModal } from "@/components/editor/embed-modal";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function EditorMapPage() {
  const params = useParams();
  const mapId = params.mapId as Id<"maps">;

  const existingMap = useQuery(api.maps.get, { mapId });
  const saveMap = useMutation(api.maps.save);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const { spec, isStreaming, streamText, toolCalls, send, stop, setSpec } =
    useMapStream({
      api: "/api/generate",
      onComplete: async (completedSpec: MapSpec) => {
        setHasGenerated(true);
        try {
          await saveMap({
            mapId,
            name: existingMap?.name || "Untitled Map",
            spec: completedSpec,
          });
        } catch {
          // Save failed silently
        }
      },
    });

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
            <MapRenderer spec={spec} className="w-full h-full" />
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
