"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Square, Loader2 } from "lucide-react";
import type { ToolCall } from "json-maps";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamText: string;
  toolCalls: ToolCall[];
  onSend: (prompt: string) => void;
  onStop: () => void;
}

export function ChatPanel({
  messages,
  isStreaming,
  streamText,
  toolCalls,
  onSend,
  onStop,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamText, toolCalls]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    onSend(trimmed);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0e8]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-4xl font-black tracking-tighter mb-3">
              factmaps.
            </div>
            <p className="text-sm text-[#888] font-medium max-w-[280px]">
              Describe the map you want to create. Location, style, data — we
              handle the rest.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
            <div
              className={
                msg.role === "user"
                  ? "bg-[#1a1a1a] text-[#f0f0e8] px-4 py-2 border-2 border-[#1a1a1a] max-w-[85%] text-sm font-medium"
                  : "text-[#1a1a1a] text-sm font-medium opacity-70"
              }
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isStreaming && toolCalls.length > 0 && (
          <div className="space-y-1">
            {toolCalls.map((tc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[#888] text-sm"
              >
                {!tc.result && (
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                )}
                <span>
                  {tc.result
                    ? `Looked up ${(tc.args as { query: string }).query}`
                    : `Looking up ${(tc.args as { query: string }).query}...`}
                </span>
              </div>
            ))}
          </div>
        )}

        {isStreaming && streamText && (
          <div className="text-[#1a1a1a] text-sm font-medium opacity-70">
            {streamText}
          </div>
        )}

        {isStreaming && !streamText && toolCalls.length === 0 && (
          <div className="flex items-center gap-2 text-[#888] text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating map...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-[#1a1a1a] p-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Describe your map..."
            rows={1}
            className="flex-1 bg-white border-2 border-[#1a1a1a] px-3 py-2 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-offset-1 placeholder:text-[#aaa]"
          />
          {isStreaming ? (
            <button
              onClick={onStop}
              className="bg-[#dc2626] text-white p-2 border-2 border-[#1a1a1a] hover:bg-[#b91c1c] transition-colors shrink-0"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="bg-[#8b4513] text-[#f0f0e8] p-2 border-2 border-[#1a1a1a] hover:bg-[#a0522d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-[#aaa] mt-2 text-center">
          Not satisfied with the map? Reach out to me directly at{" "}
          <a
            href="mailto:milindsoni201@gmail.com"
            className="underline hover:text-[#8b4513] transition-colors"
          >
            milindsoni201@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
