"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Parts = { days: number; hours: number; mins: number; secs: number; done: boolean };

function diff(target: number): Parts {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms / 3_600_000) % 24),
    mins: Math.floor((ms / 60_000) % 60),
    secs: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

/** Live ticking countdown to a deadline, refreshing every second. */
export function Countdown({ endDate }: { endDate: string }) {
  const target = new Date(endDate).getTime();
  const [parts, setParts] = useState<Parts>(() => diff(target));

  useEffect(() => {
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (parts.done) {
    return (
      <div className="rounded-3xl border border-border bg-background p-5 text-center">
        <p className="text-sm text-muted inline-flex items-center gap-1.5">
          <Clock size={14} /> This pool has closed
        </p>
      </div>
    );
  }

  const cells: [number, string][] = [
    [parts.days, "days"],
    [parts.hours, "hrs"],
    [parts.mins, "min"],
    [parts.secs, "sec"],
  ];

  return (
    <div className="rounded-3xl border border-border bg-background p-5">
      <p className="text-xs text-muted inline-flex items-center gap-1.5 mb-3">
        <Clock size={13} /> Closes in
      </p>
      <div className="grid grid-cols-4 gap-2">
        {cells.map(([value, label]) => (
          <div key={label} className="text-center">
            <div className="rounded-2xl bg-foreground/5 py-2.5">
              <span className="text-2xl font-semibold tabular-nums">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <p className="text-[11px] text-muted mt-1 uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
