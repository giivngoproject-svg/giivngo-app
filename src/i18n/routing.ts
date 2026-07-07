import { defineRouting } from "next-intl/routing";
import { DEFAULT_LOCALE, LOCALES } from "./markets";

export const routing = defineRouting({
  // Locales públicos (SEO). Derivan de la fuente única src/i18n/markets.ts.
  locales: LOCALES,

  // Idioma por defecto y x-default de hreflang.
  defaultLocale: DEFAULT_LOCALE,

  // "always" = todas las URLs llevan prefijo, incluido el default.
  localePrefix: "always",

  // Detección propia por PAÍS (x-vercel-ip-country) en src/middleware.ts:
  // Accept-Language no distingue en-au/en-us/en-nz. No dejar que next-intl
  // negocie por su cuenta.
  localeDetection: false,

  // La cookie NEXT_LOCALE la escribe SOLO el selector de mercados (elección
  // explícita del usuario); el middleware la lee con prioridad sobre la IP.
  localeCookie: false,

  // Sin Link headers de next-intl: la única fuente de hreflang es el <head>
  // (buildAlternates en i18n/metadata.ts), para no mantener dos fuentes.
  alternateLinks: false,
});

// Tipo derivado para usar en toda la app (re-export de la fuente única).
export type { Locale } from "./markets";
