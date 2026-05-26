"use client";

import { Film } from "lucide-react";
import type { Contribution } from "@/lib/types";

/**
 * The recipient's reel of every video drop left on the pool, newest first.
 */
export function HighlightReel({ contributions }: { contributions: Contribution[] }) {
  const clips = contributions
    .filter((c) => !!c.video_url)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  if (clips.length === 0) return null;

  return (
    <div className="rounded-3xl border border-border bg-background overflow-hidden">
      <div className="p-5 border-b border-border">
        <h3 className="font-semibold text-base inline-flex items-center gap-2">
          <Film size={16} className="text-accent" />
          Highlight reel
        </h3>
        <p className="text-sm text-muted mt-0.5">
          {clips.length} video message{clips.length === 1 ? "" : "s"} left for the recipient.
        </p>
      </div>
      <div className="p-4 flex gap-3 overflow-x-auto snap-x">
        {clips.map((c) => (
          <figure key={c.id} className="shrink-0 w-44 snap-start">
            <video
              src={c.video_url}
              controls
              playsInline
              className="w-44 h-64 rounded-2xl object-cover bg-black"
            />
            <figcaption className="text-xs text-muted mt-1.5 truncate">
              {c.contributor_name || "Anonymous"}
              {c.emoji ? ` ${c.emoji}` : ""}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
