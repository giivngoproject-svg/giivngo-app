"use client";

import { useLocale } from "next-intl";
import { getTranslation, type TranslationKey } from "./translations";

// Locale de next-intl (de la URL) -> clave del diccionario translations.ts
const LOCALE_TO_DICT: Record<string, "en" | "es" | "pt-br"> = {
  "en-au": "en",
  "es-419": "es",
  "pt-br": "pt-br",
};

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
  const language = LOCALE_TO_DICT[locale] ?? "en";

  return (key: TranslationKey, variables?: Record<string, string | number>) =>
    getTranslation(key, language, variables);
}
