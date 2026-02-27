"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Code } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { EmbedModal } from "@/components/editor/embed-modal";
import type { Id } from "@/convex/_generated/dataModel";

const CACHE_KEY = "factmaps:maps-cache";

export default function MapsPage() {
  const router = useRouter();
  const liveMaps = useQuery(api.maps.list);
  const deleteMap = useMutation(api.maps.remove);
  const { data: session } = authClient.useSession();

  const [cachedMaps, setCachedMaps] = useState<typeof liveMaps>(() => {
    try {
      const stored = sessionStorage.getItem(CACHE_KEY);
      return stored ? JSON.parse(stored) : undefined;
    } catch {
      return undefined;
    }
  });

  // Update cache when live data arrives
  const prevLiveMaps = useRef(liveMaps);
  useEffect(() => {
    if (liveMaps !== undefined && liveMaps !== prevLiveMaps.current) {
      prevLiveMaps.current = liveMaps;
      setCachedMaps(liveMaps);
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(liveMaps));
      } catch {
        // Storage full or unavailable
      }
    }
  }, [liveMaps]);

  // Use live data when available, fall back to cache
  const maps = liveMaps ?? cachedMaps;

  const [embedSpec, setEmbedSpec] = useState<object | null>(null);
  const [deletingId, setDeletingId] = useState<Id<"maps"> | null>(null);

  const handleDelete = async (mapId: Id<"maps">) => {
    if (!confirm("Delete this map? This cannot be undone.")) return;
    setDeletingId(mapId);
    await deleteMap({ mapId });
    setDeletingId(null);
  };

  const isLoading = maps === undefined;

  return (
    <div className="min-h-screen bg-[#f0f0e8] font-mono selection:bg-[#8b4513] selection:text-[#f0f0e8]">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b-2 border-[#1a1a1a]">
        <span className="text-xl font-black tracking-tighter">factmaps.</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#888] hidden sm:inline">
            {session?.user?.email}
          </span>
          <button
            onClick={async () => {
              await authClient.signOut();
              router.push("/");
            }}
            className="text-sm font-bold uppercase tracking-wider hover:text-[#8b4513] transition-colors"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Your Maps
          </h1>
          <Link
            href="/editor"
            className="flex items-center gap-2 px-5 py-3 bg-[#8b4513] text-[#f0f0e8] border-2 border-[#1a1a1a] font-bold text-sm uppercase tracking-wide hover:bg-[#a0522d] shadow-[4px_4px_0px_0px_#1a1a1a] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[3px_3px_0px_0px_#1a1a1a] transition-all"
          >
            <Plus className="w-4 h-4" />
            New Map
          </Link>
        </div>

        {/* Empty state */}
        {!isLoading && maps.length === 0 && (
          <div className="text-center py-24 border-2 border-dashed border-[#ccc]">
            <p className="text-xl font-black mb-2">No maps yet.</p>
            <p className="text-sm text-[#888] mb-6">
              Create your first map to get started.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-[#f0f0e8] border-2 border-[#1a1a1a] font-bold text-sm uppercase"
            >
              <Plus className="w-4 h-4" />
              Create Map
            </Link>
          </div>
        )}

        {/* Map grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && [0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col animate-pulse"
            >
              <div className="h-48 bg-[#e0e0d8] border-b-2 border-[#1a1a1a]" />
              <div className="p-4 flex-1">
                <div className="h-5 bg-[#e0e0d8] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#e0e0d8] rounded w-1/3" />
              </div>
              <div className="h-11 border-t-2 border-[#1a1a1a] bg-[#f5f5ed]" />
            </div>
          ))}
          {maps?.map((map) => (
            <div
              key={map._id}
              className="bg-white border-2 border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] flex flex-col"
            >
              {/* Map preview area */}
              <Link href={`/editor/${map._id}`} className="block">
                <div className="h-48 bg-[#1a1a1a] border-b-2 border-[#1a1a1a] overflow-hidden">
                  {map.thumbnail ? (
                    <img
                      src={map.thumbnail}
                      alt={map.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-4xl font-black tracking-tighter text-[#333]">?</span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Map info */}
              <div className="p-4 flex-1">
                <Link href={`/editor/${map._id}`}>
                  <h3 className="font-black text-lg truncate hover:text-[#8b4513] transition-colors">
                    {map.name}
                  </h3>
                </Link>
                <p className="text-xs text-[#888] mt-1">
                  {new Date(map._creationTime).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex border-t-2 border-[#1a1a1a]">
                <Link
                  href={`/editor/${map._id}`}
                  className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider hover:bg-[#f0f0e8] transition-colors border-r-2 border-[#1a1a1a]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => setEmbedSpec(map.spec)}
                  className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider hover:bg-[#f0f0e8] transition-colors flex items-center justify-center gap-1 border-r-2 border-[#1a1a1a]"
                >
                  <Code className="w-3 h-3" />
                  Embed
                </button>
                <button
                  onClick={() => handleDelete(map._id)}
                  disabled={deletingId === map._id}
                  className="px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Embed modal */}
      {embedSpec && (
        <EmbedModal
          open={!!embedSpec}
          onClose={() => setEmbedSpec(null)}
          spec={embedSpec}
        />
      )}
    </div>
  );
}
