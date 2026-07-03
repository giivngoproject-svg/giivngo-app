import type { Metadata } from "next";
import { routing } from "./routing";

// Fuente única de la URL canónica del sitio (sin www).
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://giivngo.com";

// Constantes de marca (fuente única, reutilizadas por el metadata del root y el JSON-LD).
export const SITE_NAME = "giivngo";
export const SITE_DESCRIPTION =
  "Social gifting for life's happy moments. Create a pool, invite your people, and make amazing things happen together.";

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

// locale (slug) -> og:locale (formato language_TERRITORY de Open Graph).
// OJO: es distinto de LOCALE_TO_HREFLANG. Facebook/WhatsApp NO reconocen "es_419"
// (no está en su lista oficial), así que para OG usamos "es_LA" (Latinoamérica).
// El hreflang sí usa "es-419" (correcto en BCP-47) y no se toca.
const LOCALE_TO_OG: Record<Locale, string> = {
  "en-au": "en_AU",
  "es-419": "es_LA",
  "pt-br": "pt_BR",
};

// locale (slug) -> imagen OG en public/ (1:1 con el locale, nombre inequívoco).
const LOCALE_TO_OG_IMAGE: Record<Locale, string> = {
  "en-au": "/og/og-en-au.jpg",
  "es-419": "/og/og-es-419.jpg",
  "pt-br": "/og/og-pt-br.jpg",
};

/**
 * Construye el bloque `openGraph` + `twitter` localizado por locale para una página
 * del grupo (web).
 *
 * @param locale   locale actual (slug de la URL, p.ej. "es-419")
 * @param pathname ruta SIN el prefijo de locale (home = "/" o "")
 *
 * NOTA: no se fijan og:title / og:description a propósito. Next los hereda del
 * `title`/`description` resueltos de cada página (o del default del root). Así el copy
 * social sigue automáticamente el título/descr. de la página y se traducirá solo cuando
 * esos se traduzcan, sin duplicar strings aquí.
 */
export function buildSocial(
  locale: string,
  pathname: string
): Pick<Metadata, "openGraph" | "twitter"> {
  const loc = (routing.locales.includes(locale as Locale)
    ? locale
    : routing.defaultLocale) as Locale;
  const path = !pathname || pathname === "/" ? "" : pathname;

  const pageUrl = `${SITE_URL}/${loc}${path}`;
  const imageUrl = `${SITE_URL}${LOCALE_TO_OG_IMAGE[loc]}`; // absoluta contra NEXT_PUBLIC_APP_URL

  // Los OTROS locales OG, declarados como og:locale:alternate.
  const alternateLocale = routing.locales
    .filter((l) => l !== loc)
    .map((l) => LOCALE_TO_OG[l]);

  return {
    openGraph: {
      type: "website",
      siteName: "giivngo",
      locale: LOCALE_TO_OG[loc],
      alternateLocale,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "giivngo — social gifting for life's happy moments",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [imageUrl],
    },
  };
}

/**
 * JSON-LD del sitio (Organization + WebSite) combinado en un @graph.
 * Es el mismo para todas las páginas públicas (no varía por página ni por locale).
 */
export function getSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        // TODO: añadir `logo` (URL absoluta a un PNG/SVG cuadrado en public/) y
        // `sameAs` (array de URLs de redes sociales) cuando estén disponibles.
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        // Idiomas del sitio en formato BCP-47 (reutiliza el mapa de hreflang).
        inLanguage: routing.locales.map((loc) => LOCALE_TO_HREFLANG[loc]),
        // TODO: añadir `potentialAction` (SearchAction) cuando el formato de query
        // de /search esté validado; declararlo roto genera errores en Search Console.
      },
    ],
  };
}
