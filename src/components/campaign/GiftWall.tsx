"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { PlayCircle } from "lucide-react";
import { Avatar } from "@/components/nav/TopNav";
import { formatAUD } from "@/lib/money";
import type { Contribution } from "@/lib/types";

/**
 * Live gift wall: one card per contribution with emoji, name, message and any
 * attached photo/video. `showAmounts` is turned off for mystery pools.
 */
export function GiftWall({
  contributions,
  showAmounts = true,
}: {
  contributions: Contribution[];
  showAmounts?: boolean;
}) {
  if (contributions.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface/40 text-center py-12 text-sm text-muted">
        No notes on the wall yet — be the first to leave one ✨
      </div>
    );
  }

  const sorted = contributions
    .slice()
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {sorted.map((c) => (
        <div
          key={c.id}
          className="animate-pop rounded-3xl border border-border bg-background p-4 flex gap-3"
        >
          <div className="shrink-0">
            {c.emoji ? (
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-xl">
                {c.emoji}
              </div>
            ) : c.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photo_url}
                alt={c.contributor_name || "contributor"}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <Avatar name={c.contributor_name || "Anonymous"} size={40} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-medium truncate">{c.contributor_name || "Anonymous"}</p>
              {showAmounts && (
                <p className="text-sm font-semibold shrink-0 tabular-nums">{formatAUD(c.amount)}</p>
              )}
            </div>
            {c.message && (
              <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap break-words">
                {c.message}
              </p>
            )}
            {c.video_url && (
              <video
                src={c.video_url}
                controls
                playsInline
                className="mt-2 w-full max-h-48 rounded-2xl bg-black/5 object-cover"
              />
            )}
            <p className="text-xs text-muted mt-1.5 inline-flex items-center gap-1">
              {c.video_url && !c.message ? <PlayCircle size={12} /> : null}
              {formatDistanceToNowStrict(new Date(c.created_at))} ago
              {c.tip_amount ? <span className="text-accent">· +{formatAUD(c.tip_amount)} tip</span> : null}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
