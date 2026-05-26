"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatAUD } from "@/lib/money";
import type { Contribution } from "@/lib/types";

type Activity = { id: string; text: string; at: number };

// Ambient names used to simulate a live crowd ("Jake just joined").
const AMBIENT_NAMES = [
  "Jake", "Emma", "Liam", "Olivia", "Noah", "Ava", "Mia", "Leo",
  "Zoe", "Finn", "Ruby", "Max", "Chloe", "Ari", "Tess",
];

function contributionActivity(c: Contribution, hideIdentities: boolean): Activity {
  const name = hideIdentities ? "Someone" : c.contributor_name || "Someone";
  const emoji = c.emoji ? ` ${c.emoji}` : "";
  const text = hideIdentities
    ? `${name} just contributed${emoji}`
    : `${name} just chipped in ${formatAUD(c.amount)}${emoji}`;
  return { id: `c-${c.id}`, text, at: +new Date(c.created_at) };
}

/**
 * Live ticker. Surfaces real contributions as they land and weaves in ambient
 * "just joined / is viewing" events so the pool feels alive in this demo.
 */
export function ActivityFeed({
  contributions,
  hideIdentities = false,
}: {
  contributions: Contribution[];
  hideIdentities?: boolean;
}) {
  const seeded = useMemo(
    () =>
      contributions
        .slice()
        .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
        .slice(0, 8)
        .map((c) => contributionActivity(c, hideIdentities)),
    [contributions, hideIdentities],
  );

  const [feed, setFeed] = useState<Activity[]>(seeded);
  const [index, setIndex] = useState(0);
  const knownIds = useRef(new Set(seeded.map((a) => a.id)));

  // Surface brand-new real contributions at the front of the ticker.
  useEffect(() => {
    const fresh = seeded.filter((a) => !knownIds.current.has(a.id));
    if (fresh.length === 0) return;
    fresh.forEach((a) => knownIds.current.add(a.id));
    setFeed((prev) => [...fresh, ...prev].slice(0, 24));
    setIndex(0);
  }, [seeded]);

  // Weave in ambient activity on an interval.
  useEffect(() => {
    const id = setInterval(() => {
      const name = AMBIENT_NAMES[Math.floor(Math.random() * AMBIENT_NAMES.length)];
      const verb = Math.random() > 0.5 ? "just joined 👋" : "is viewing this pool 👀";
      setFeed((prev) =>
        [{ id: `a-${Date.now()}`, text: `${name} ${verb}`, at: Date.now() }, ...prev].slice(0, 24),
      );
      setIndex(0);
    }, 6500);
    return () => clearInterval(id);
  }, []);

  // Rotate through the feed.
  useEffect(() => {
    if (feed.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % feed.length), 3200);
    return () => clearInterval(id);
  }, [feed.length]);

  if (feed.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted">
        <LiveDot />
        Waiting for the first contribution…
      </div>
    );
  }

  const current = feed[index % feed.length];

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border bg-background px-4 py-2 overflow-hidden">
      <LiveDot />
      <span className="text-xs font-semibold text-accent uppercase tracking-wide shrink-0">Live</span>
      <span key={current.id} className="animate-ticker text-sm text-foreground/80 truncate">
        {current.text}
      </span>
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
    </span>
  );
}
