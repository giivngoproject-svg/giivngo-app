"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Avatar } from "@/components/nav/TopNav";
import { formatAUD } from "@/lib/money";
import type { Contribution } from "@/lib/types";

export function ContributorWall({ contributions }: { contributions: Contribution[] }) {
  if (contributions.length === 0) {
    return (
      <div className="text-center py-10 text-sm text-muted">
        Be the first to contribute ✨
      </div>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {contributions
        .slice()
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .map((c) => {
          // Determine display info: private with avatar, or public
          const displayName = c.anonymous_avatar ? `🎭 ${c.anonymous_avatar.name}` : (c.contributor_name || "Anonymous");
          const avatarImage = c.anonymous_avatar?.imageUrl || c.photo_url;
          const isAnonymous = c.anonymous_avatar && c.is_private;

          return (
            <li key={c.id} className="py-4 flex gap-3 items-start">
              {avatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarImage}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                  title={isAnonymous ? c.anonymous_avatar?.name : c.contributor_name}
                />
              ) : (
                <Avatar name={displayName} size={40} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="font-medium truncate">
                      {displayName}
                    </p>
                    {isAnonymous && (
                      <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded whitespace-nowrap shrink-0">
                        Anonymous
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-foreground shrink-0">
                    {formatAUD(c.amount)}
                  </p>
                </div>
                {c.message && (
                  <p className="text-sm text-foreground/80 mt-0.5 whitespace-pre-wrap break-words">
                    {c.message}
                  </p>
                )}
                <p className="text-xs text-muted mt-1">
                  {formatDistanceToNowStrict(new Date(c.created_at))} ago
                </p>
              </div>
            </li>
          );
        })}
    </ul>
  );
}
