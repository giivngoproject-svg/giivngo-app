"use client";

import { useTranslation } from "./useTranslation";
import type { PoolMode } from "./types";

export function usePoolModes() {
  const t = useTranslation();

  const labels: Record<PoolMode, string> = {
    standard: t("create.mode.standard"),
    mystery: t("create.mode.mystery"),
    blind: t("create.mode.blind"),
    tiers: t("create.mode.tiers"),
  };

  const descriptions: Record<PoolMode, string> = {
    standard: t("create.mode.standard.description"),
    mystery: t("create.mode.mystery.description"),
    blind: t("create.mode.blind.description"),
    tiers: t("create.mode.tiers.description"),
  };

  return { labels, descriptions };
}
