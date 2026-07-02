"use client";

import { useRef, useState } from "react";
import { Camera, X } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";
import { uploadImage } from "@/lib/mock/storage";
import { toast } from "@/stores/toast";

export function PhotoUpload({
  value,
  onChange,
  label = "Cover photo",
  aspect = "16/9",
  className = "",
}: {
  value?: string;
  onChange: (url?: string) => void;
  label?: string;
  aspect?: "16/9" | "1/1";
  className?: string;
}) {
  const t = useTranslation();
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("common.error"));
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={className}>
      <p className="text-sm font-medium mb-1.5">{label}</p>
      <div
        className={
          "relative rounded-2xl border-2 border-dashed border-border bg-surface/40 overflow-hidden " +
          (aspect === "16/9" ? "aspect-[16/9]" : "aspect-square")
        }
      >
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="cover" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="absolute top-2 right-2 p-1.5 bg-background/90 rounded-full shadow-soft hover:bg-background"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => ref.current?.click()}
            disabled={busy}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted hover:text-foreground hover:bg-foreground/[.02] transition-colors"
          >
            <Camera size={28} />
            <span className="text-sm font-medium">
              {busy ? t("common.loading") : t("wizard.preview")}
            </span>
            <span className="text-xs">{t("wizard.photo_hint")}</span>
          </button>
        )}
        <input
          ref={ref}
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) pick(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
