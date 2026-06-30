"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { PlayCircle, Image as ImageIcon, X } from "lucide-react";
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
  const [mediaModal, setMediaModal] = useState<{ type: 'image' | 'video'; url: string } | null>(null);

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {sorted.map((c) => {
          // For private contributions with anonymous avatar
          const isAnonymous = c.is_private;
          const hasAnonymousAvatar = isAnonymous && c.anonymous_avatar;
          const displayName = hasAnonymousAvatar
            ? c.anonymous_avatar!.name
            : isAnonymous
              ? "Anonymous"
              : c.contributor_name || "Anonymous";

          // Determine what to show as avatar (left side)
          // Priority: Anonymous Avatar > Emoji > Placeholder > Generated Avatar
          // When anonymous: show only anonymous avatar or emoji, never generate from name
          const getAvatarDisplay = () => {
            if (hasAnonymousAvatar) {
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={c.anonymous_avatar!.imageUrl}
                  alt={c.anonymous_avatar!.name}
                  className="shrink-0 w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                />
              );
            } else if (c.emoji) {
              return (
                <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-2xl border-2 border-accent/20">
                  {c.emoji}
                </div>
              );
            } else if (isAnonymous) {
              // For anonymous without avatar/emoji, show placeholder
              return (
                <div className="shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center border-2 border-purple-200">
                  <span className="text-lg">🎭</span>
                </div>
              );
            } else {
              // For non-anonymous, generate avatar from name
              return (
                <div className="shrink-0">
                  <Avatar name={displayName} size={48} />
                </div>
              );
            }
          };

          return (
            <div
              key={c.id}
              className="animate-pop rounded-3xl border border-border bg-background p-4 flex flex-col gap-3"
            >
              {/* Header: Avatar/Emoji, Name, Amount */}
              <div className="flex items-start gap-3">
                {getAvatarDisplay()}

                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">
                    {displayName}
                  </p>
                  {showAmounts && (
                    <p className="text-sm font-semibold text-accent tabular-nums">{formatAUD(c.amount)}</p>
                  )}
                </div>
              </div>

              {/* Media buttons (photo/video) */}
              {(c.photo_url || c.video_url) && (
                <div className="flex gap-2">
                  {c.photo_url && (
                    <button
                      onClick={() => setMediaModal({ type: 'image', url: c.photo_url! })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors"
                    >
                      <ImageIcon size={12} />
                      Photo
                    </button>
                  )}
                  {c.video_url && (
                    <button
                      onClick={() => setMediaModal({ type: 'video', url: c.video_url! })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-xs font-medium transition-colors"
                    >
                      <PlayCircle size={12} />
                      Video
                    </button>
                  )}
                </div>
              )}

              {/* Message */}
              {c.message && (
                <p className="text-sm text-foreground/80 whitespace-pre-wrap break-words">
                  {c.message}
                </p>
              )}

              {/* Footer: Time and Tip */}
              <p className="text-xs text-muted inline-flex items-center gap-1">
                {c.created_at ? (
                  <>
                    {formatDistanceToNowStrict(new Date(c.created_at))} ago
                  </>
                ) : null}
                {c.tip_amount ? <span className="text-accent">· +{formatAUD(c.tip_amount)} tip</span> : null}
              </p>
            </div>
          );
        })}
      </div>

      {/* Media Modal */}
      {mediaModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-2xl w-full">
            <button
              onClick={() => setMediaModal(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
            {mediaModal.type === 'image' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mediaModal.url}
                alt="Contribution photo"
                className="w-full rounded-lg"
              />
            ) : (
              <video
                src={mediaModal.url}
                controls
                className="w-full rounded-lg bg-black"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
