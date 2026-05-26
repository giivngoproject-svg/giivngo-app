"use client";

import { cn } from "@/lib/cn";

export function WizardShell({
  step,
  children,
}: {
  step: 1 | 2 | 3;
  children: React.ReactNode;
}) {
  const steps = ["Basics", "Goal & timing", "Preview & publish"];
  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-10">
      <div className="mb-8">
        <p className="text-sm text-muted">Step {step} of 3</p>
        <h1 className="text-3xl font-bold tracking-tight mt-1">{steps[step - 1]}</h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-accent" : "bg-foreground/10",
            )}
          />
        ))}
      </div>

      {children}
    </div>
  );
}
