"use client";

import { useLanguage } from "@/stores/language";
import { getTranslation, type TranslationKey } from "./translations";

/**
 * Hook para acceder a traducciones
 * Usage: const t = useTranslation();
 *        t("dashboard.title")
 *        t("dashboard.subtitle", { name: "John" })
 */
export function useTranslation() {
  const language = useLanguage((s) => s.language);

  return (key: TranslationKey, variables?: Record<string, string | number>) =>
    getTranslation(key, language, variables);
}
