"use client";

import { useLocale } from "next-intl";
import { LOCALE_TO_DICT, type Locale } from "@/i18n/markets";
import { getTranslation, type TranslationKey } from "./translations";

/**
 * Hook para acceder a traducciones.
 * El idioma se deriva del locale de next-intl: de la URL en el sitio público
 * (disponible en SSR ⇒ el texto traducido queda en el HTML del servidor), o del
 * provider sembrado por el store en el panel.
 * Usage: const t = useTranslation();
 *        t("dashboard.title")
 *        t("dashboard.subtitle", { name: "John" })
 */
export function useTranslation() {
  const locale = useLocale();
  // Fallback "en" por si el provider siembra un locale fuera de la lista (panel).
  const language = LOCALE_TO_DICT[locale as Locale] ?? "en";

  return (key: TranslationKey, variables?: Record<string, string | number>) =>
    getTranslation(key, language, variables);
}
