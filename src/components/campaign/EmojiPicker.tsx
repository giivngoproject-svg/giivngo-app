"use client";

import { cn } from "@/lib/cn";

const EMOJIS = ["🎉", "🎂", "❤️", "🥳", "🎁", "🍻", "✨", "🙌", "😍", "👏", "🌴", "💸"];

/** Pick one celebratory emoji to attach to a gift-wall note. */
export function EmojiPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (emoji?: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">Add an emoji (optional)</label>
      <div className="flex flex-wrap gap-1.5">
        {EMOJIS.map((e) => {
          const active = value === e;
          return (
            <button
              key={e}
              type="button"
              onClick={() => onChange(active ? undefined : e)}
              aria-pressed={active}
              className={cn(
                "w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all",
                active
                  ? "bg-accent/15 ring-2 ring-accent/50 scale-105"
                  : "bg-foreground/5 hover:bg-foreground/10",
              )}
            >
              {e}
            </button>
          );
        })}
      </div>
    </div>
  );
}
