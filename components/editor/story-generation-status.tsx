"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";

interface ToolCall {
  toolName: string;
  args: Record<string, unknown>;
  result: unknown;
}

interface StoryGenerationStatusProps {
  toolCalls: ToolCall[];
  streamText: string;
  isNew?: boolean;
}

const VISIBLE_LINES = 18;

export function StoryGenerationStatus({
  toolCalls,
  streamText,
}: StoryGenerationStatusProps) {
  // Only show the last N lines — text appears to stream in from bottom
  const tailText = useMemo(() => {
    if (!streamText) return " ";
    const lines = streamText.split("\n");
    return lines.slice(-VISIBLE_LINES).join("\n");
  }, [streamText]);

  const completedLocations = toolCalls.filter((tc) => tc.result != null);
  const pendingLocations = toolCalls.filter((tc) => tc.result == null);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* Geocode status — top-left absolute */}
      {(completedLocations.length > 0 || pendingLocations.length > 0) && (
        <div className="absolute top-4 left-4 z-20 space-y-1.5">
          {completedLocations.map((tc, i) => {
            const query = (tc.args as { query?: string })?.query ?? "Unknown";
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-xs font-mono"
                style={{ animation: `fade-in 0.3s ease-out ${i * 0.1}s both` }}
              >
                <Check className="w-3 h-3 text-green-500 shrink-0" />
                <span className="text-[#888]">{query}</span>
              </div>
            );
          })}
          {pendingLocations.map((tc, i) => {
            const query = (tc.args as { query?: string })?.query ?? "...";
            return (
              <div
                key={`p-${i}`}
                className="flex items-center gap-2 text-xs font-mono"
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse shrink-0" />
                <span className="text-[#666]">{query}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Constrained center box — fixed size, no scroll */}
      <div className="relative max-w-md w-full overflow-hidden">
        {/* Top fade — strong, hides older lines */}
        <div
          className="absolute inset-x-0 top-0 h-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #1a1a1a 20%, transparent)" }}
        />

        {/* Streaming JSON — only tail lines, no scroll */}
        <pre className="px-4 py-6 text-[11px] leading-relaxed font-mono text-[#333] whitespace-pre-wrap break-all select-none">
          {tailText}
        </pre>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #1a1a1a 10%, transparent)" }}
        />
      </div>
    </div>
  );
}
