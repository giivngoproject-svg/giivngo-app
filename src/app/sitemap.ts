import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { LOCALE_TO_HREFLANG } from "@/i18n/markets";
import { SITE_URL } from "@/i18n/metadata";

// Rutas indexables del grupo web (Grupo A). "" = home.
//
// EXCLUIDO a propósito:
//  - Grupo B (sign-in, sign-up, verify-email): son noindex, no van en el sitemap.
//  - Dinámicas campaign/[slug] y search/[slug]: PENDIENTES de generación dinámica
//    (requieren enumerar los slugs desde la BD/Supabase). Se añadirán en un paso aparte.
const INDEXABLE_PATHS = ["", "/search/all", "/privacy", "/terms", "/cookies"];

const urlFor = (locale: string, path: string) => `${SITE_URL}/${locale}${path}`;

// Matriz hreflang para una ruta: las 5 versiones (BCP-47) + x-default -> en-au.
function languagesFor(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[LOCALE_TO_HREFLANG[loc]] = urlFor(loc, path);
  }
  languages["x-default"] = urlFor(routing.defaultLocale, path);
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Una entrada por (ruta indexable × locale), cada una con su matriz de alternates.
  return INDEXABLE_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: urlFor(locale, path),
      lastModified,
      alternates: { languages: languagesFor(path) },
    }))
  );
}
