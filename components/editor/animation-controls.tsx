"use client";

import { useCallback } from "react";
import { Play, Pause, RotateCcw, Download } from "lucide-react";
import type { AnimationPlayerHandle } from "json-maps";

interface AnimationControlsProps {
  playerRef: React.RefObject<AnimationPlayerHandle | null>;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onExport?: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.5, 1, 1.5, 2];

export function AnimationControls({
  isPlaying,
  currentTime,
  duration,
  speed,
  onSpeedChange,
  onPlayPause,
  onSeek,
  onExport,
}: AnimationControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleScrub = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      onSeek(Math.max(0, Math.min(1, x)) * duration);
    },
    [duration, onSeek],
  );

  const handleRestart = useCallback(() => {
    onSeek(0);
  }, [onSeek]);

  const cycleSpeed = useCallback(() => {
    const idx = SPEEDS.indexOf(speed);
    const next = SPEEDS[(idx + 1) % SPEEDS.length]!;
    onSpeedChange(next);
  }, [speed, onSpeedChange]);

  return (
    <div className="bg-[#1a1a1a] border-t-2 border-[#333] px-4 py-3 font-mono">
      {/* Scrubber */}
      <div
        className="w-full h-2 bg-[#333] cursor-pointer mb-3 group relative"
        onClick={handleScrub}
      >
        <div
          className="h-full bg-[#8b4513] transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#f0f0e8] border-2 border-[#8b4513] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Restart */}
          <button
            onClick={handleRestart}
            className="text-[#888] hover:text-[#f0f0e8] transition-colors p-1"
            title="Restart"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="bg-[#8b4513] text-[#f0f0e8] p-2 hover:bg-[#a0522d] transition-colors"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>

          {/* Time */}
          <span className="text-[#888] text-xs tabular-nums ml-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Speed */}
          <button
            onClick={cycleSpeed}
            className="text-[#888] hover:text-[#f0f0e8] text-xs font-bold transition-colors px-2 py-1 border border-[#333] hover:border-[#888]"
            title="Playback speed"
          >
            {speed}x
          </button>

          {/* Export */}
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 text-[#f0f0e8] bg-[#8b4513] hover:bg-[#a0522d] text-xs font-bold px-3 py-1.5 transition-colors"
              title="Export video"
            >
              <Download className="w-3.5 h-3.5" />
              Export
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
