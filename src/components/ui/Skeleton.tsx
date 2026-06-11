export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-foreground/10 rounded-lg ${className || "h-10 w-full"}`}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={i === lines - 1 ? "w-4/5" : "w-full"} />
      ))}
    </div>
  );
}
