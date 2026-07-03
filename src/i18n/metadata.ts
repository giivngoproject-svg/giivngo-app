import { routing } from "./routing";

// Fuente única de la URL canónica del sitio (sin www).
const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://giivngo.com";

type Locale = (typeof routing.locales)[number];

// slug de locale (en la URL) -> etiqueta hreflang con casing BCP-47 correcto.
export const LOCALE_TO_HREFLANG: Record<Locale, string> = {
  "en-au": "en-AU",
  "es-419": "es-419",
  "pt-br": "pt-BR",
};

/**
 * Construye el objeto `alternates` de Next.js metadata para una página del grupo (web).
 *
 * @param locale   locale actual (slug de la URL, p.ej. "es-419")
 * @param pathname ruta SIN el prefijo de locale, empezando con "/" (home = "/" o "")
 *
 * Devuelve:
 *  - canonical: URL absoluta de ESTA página en ESTE locale (auto-referencial)
 *  - languages: las 3 versiones (hreflang BCP-47) + "x-default" -> versión en-au
 */
export function buildAlternates(locale: string, pathname: string) {
  // Normalizar: la home puede llegar como "" o "/"; el resto empieza con "/".
  const path = !pathname || pathname === "/" ? "" : pathname;

  const urlFor = (loc: string) => `${SITE_URL}/${loc}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    // Reciprocidad: cada locale se lista, incluido el propio (en-AU, es-419, pt-BR).
    languages[LOCALE_TO_HREFLANG[loc]] = urlFor(loc);
  }
  // x-default apunta a la versión del locale por defecto (en-au).
  languages["x-default"] = urlFor(routing.defaultLocale);

  return {
    canonical: urlFor(locale),
    languages,
  };
}
