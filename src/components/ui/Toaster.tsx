"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useToast } from "@/stores/toast";
import { cn } from "@/lib/cn";

export function Toaster() {
  const toasts = useToast((s) => s.toasts);
  const dismiss = useToast((s) => s.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-4 inset-x-0 z-[60] flex justify-center px-4">
      <div className="w-full max-w-md space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-2xl border bg-background p-3.5 shadow-lift",
              t.variant === "success" && "border-emerald-200",
              t.variant === "error" && "border-red-200",
              t.variant === "default" && "border-border",
            )}
          >
            <span className="mt-0.5">
              {t.variant === "success" ? (
                <CheckCircle2 size={18} className="text-emerald-600" />
              ) : t.variant === "error" ? (
                <AlertCircle size={18} className="text-red-600" />
              ) : (
                <Info size={18} className="text-foreground/70" />
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{t.title}</p>
              {t.description && (
                <p className="text-xs text-muted mt-0.5 break-words">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="p-1 rounded-full hover:bg-foreground/5"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
