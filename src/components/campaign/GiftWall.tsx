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
          className="animate-pop rounded-3xl border border-border bg-background p-4 flex flex-col gap-3"
        >
          {/* Header: Emoji, Name, Amount */}
          <div className="flex items-start gap-3">
            {/* Emoji in circle */}
            {c.emoji ? (
              <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl border-2 border-accent/20">
                {c.emoji}
              </div>
            ) : (
              <div className="shrink-0">
                <Avatar
                  name={c.is_private ? "Anonymous" : c.contributor_name || "Anonymous"}
                  size={48}
                />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="font-medium truncate">
                {c.is_private ? "Anonymous" : c.contributor_name || "Anonymous"}
              </p>
              {showAmounts && (
                <p className="text-sm font-semibold text-accent tabular-nums">{formatAUD(c.amount)}</p>
              )}
            </div>
          </div>

          {/* Message */}
          {c.message && (
            <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
              {c.message}
            </p>
          )}

          {/* Photo */}
          {!c.is_private && c.photo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={c.photo_url}
              alt={c.contributor_name || "contributor"}
              className="w-full rounded-2xl object-cover max-h-56"
            />
          )}

          {/* Video */}
          {c.video_url && (
            <video
              src={c.video_url}
              controls
              playsInline
              className="w-full max-h-48 rounded-2xl bg-black/5 object-cover"
            />
          )}

          {/* Footer: Time and Tip */}
          <p className="text-xs text-muted inline-flex items-center gap-1">
            {c.video_url && !c.message ? <PlayCircle size={12} /> : null}
            {c.created_at ? (
              <>
                {formatDistanceToNowStrict(new Date(c.created_at))} ago
              </>
            ) : null}
            {c.tip_amount ? <span className="text-accent">· +{formatAUD(c.tip_amount)} tip</span> : null}
          </p>
        </div>
      ))}
    </div>
  );
}
