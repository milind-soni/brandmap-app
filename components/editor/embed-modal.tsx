"use client";

import { useState } from "react";
import { X, Check, Copy } from "lucide-react";
import { compressToEncodedURIComponent } from "lz-string";

interface EmbedModalProps {
  open: boolean;
  onClose: () => void;
  spec: object;
}

export function EmbedModal({ open, onClose, spec }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const compressed = compressToEncodedURIComponent(JSON.stringify(spec));
  const embedUrl = `https://jsonmaps.dev/embed#${compressed}`;

  const embedCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="500"
  style="border: none; border-radius: 8px;"
  loading="lazy"
></iframe>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[#f0f0e8] border-2 border-[#1a1a1a] shadow-[8px_8px_0px_0px_#1a1a1a] max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#1a1a1a]">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Embed Code
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#1a1a1a] hover:text-[#f0f0e8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm font-medium text-[#888] mb-4">
            Copy this code and paste it into your website HTML.
          </p>
          <div className="relative">
            <pre className="bg-[#1a1a1a] text-[#f0f0e8] p-4 border-2 border-[#1a1a1a] text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all">
              {embedCode}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 bg-[#8b4513] text-[#f0f0e8] px-3 py-1 border border-[#f0f0e8]/20 text-xs font-bold uppercase tracking-wider hover:bg-[#a0522d] transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t-2 border-[#1a1a1a]">
          <p className="text-xs text-[#888] font-medium">
            The embed renders a fully interactive map via jsonmaps.dev. No API key needed.
          </p>
        </div>
      </div>
    </div>
  );
}
