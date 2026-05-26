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
        .map((c) => (
          <li key={c.id} className="py-4 flex gap-3 items-start">
            {c.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={c.photo_url}
                alt={c.contributor_name || "anonymous"}
                className="w-10 h-10 rounded-full object-cover shrink-0"
              />
            ) : (
              <Avatar name={c.contributor_name || "Anonymous"} size={40} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium truncate">
                  {c.contributor_name || "Anonymous"}
                </p>
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
        ))}
    </ul>
  );
}
