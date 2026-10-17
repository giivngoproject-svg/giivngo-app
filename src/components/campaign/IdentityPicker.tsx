"use client";

import { useEffect, useState } from "react";
import { anonymousAvatarsApi, type AnonymousAvatarOption } from "@/lib/api";
import { useTranslation } from "@/lib/useTranslation";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/Input";

export type IdentityMode = "name" | "nickname" | "anon";

export type IdentityValue = {
  mode: IdentityMode;
  nickname: string;
  // Preset avatar. With mode "nickname" and no avatar, the guest picked "Other".
  avatarId?: string;
};

const MODES = [
  { value: "name", labelKey: "campaign.identity.my_name" },
  { value: "nickname", labelKey: "campaign.identity.fun_nickname" },
  { value: "anon", labelKey: "campaign.identity.anonymous" },
] as const;

export function IdentityPicker({
  value,
  onChange,
}: {
  value: IdentityValue;
  onChange: (next: IdentityValue) => void;
}) {
  const t = useTranslation();
  const [avatars, setAvatars] = useState<AnonymousAvatarOption[]>([]);
  const [avatarError, setAvatarError] = useState(false);

  // Preset characters come from the API (real database ids), loaded once when needed.
  useEffect(() => {
    if (value.mode !== "nickname" || avatars.length > 0 || avatarError) return;
    anonymousAvatarsApi
      .getAll()
      .then(setAvatars)
      .catch(() => setAvatarError(true));
  }, [value.mode, avatars.length, avatarError]);

  const tileClass = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-medium transition-colors",
      active ? "border-accent bg-accent/5 ring-2 ring-accent/30" : "border-border hover:bg-foreground/[.02]",
    );

  return (
    <div className="space-y-3">
      <div
        className="grid grid-cols-3 gap-1 rounded-2xl bg-foreground/[.05] p-1"
        role="group"
        aria-label={t("campaign.identity.title")}
      >
        {MODES.map((mode) => (
          <button
            key={mode.value}
            type="button"
            aria-pressed={value.mode === mode.value}
            onClick={() => onChange({ ...value, mode: mode.value })}
            className={cn(
              "min-h-[40px] rounded-xl text-sm font-medium transition-all",
              value.mode === mode.value ? "bg-background shadow-soft text-foreground" : "text-muted",
            )}
          >
            {t(mode.labelKey)}
          </button>
        ))}
      </div>

      {value.mode === "nickname" && (
        <div className="space-y-3">
          <span className="block text-sm font-medium">{t("campaign.identity.pick_character")}</span>
          {avatarError ? (
            <p className="text-xs text-muted">{t("campaign.identity.avatars_error")}</p>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {avatars.map((avatar) => {
                const active = value.avatarId === avatar.id;
                return (
                  <button
                    key={avatar.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onChange({ mode: "nickname", nickname: avatar.name, avatarId: avatar.id })}
                    className={tileClass(active)}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar.imageUrl} alt="" className="h-10 w-10 rounded-full" />
                    <span className="w-full truncate text-center">{avatar.name}</span>
                  </button>
                );
              })}
              <button
                type="button"
                aria-pressed={!value.avatarId}
                onClick={() => onChange({ mode: "nickname", nickname: "", avatarId: undefined })}
                className={tileClass(!value.avatarId)}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-lg">?</span>
                <span>{t("campaign.identity.other")}</span>
              </button>
            </div>
          )}
          <Input
            label={t("campaign.identity.nickname_label")}
            placeholder={t("campaign.identity.nickname_placeholder")}
            maxLength={24}
            value={value.nickname}
            onChange={(e) => onChange({ ...value, nickname: e.target.value })}
            hint={t("campaign.identity.nickname_help")}
          />
        </div>
      )}

      {value.mode === "anon" && <p className="text-xs text-muted">{t("campaign.identity.anon_help")}</p>}
    </div>
  );
}
