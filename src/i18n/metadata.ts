import type { Metadata } from "next";
import { routing } from "./routing";
import {
  getMarket,
  LOCALE_TO_HREFLANG,
  LOCALE_TO_OG,
  LOCALE_TO_OG_IMAGE,
} from "./markets";

// Fuente única de la URL canónica del sitio (sin www).
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://giivngo.com";

// Constantes de marca (fuente única, reutilizadas por el metadata del root y el JSON-LD).
export const SITE_NAME = "giivngo";
export const SITE_DESCRIPTION =
  "Social gifting for life's happy moments. Create a pool, invite your people, and make amazing things happen together.";

// Los mapeos locale->hreflang/og/imagen viven en ./markets (fuente única) y se
// re-exportan aquí para los consumidores existentes (p.ej. sitemap.ts).
export { LOCALE_TO_HREFLANG };

/**
 * Construye el objeto `alternates` de Next.js metadata para una página del grupo (web).
 *
 * @param locale   locale actual (slug de la URL, p.ej. "es-mx")
 * @param pathname ruta SIN el prefijo de locale, empezando con "/" (home = "/" o "")
 *
 * Devuelve:
 *  - canonical: URL absoluta de ESTA página en ESTE locale (AUTO-REFERENCIAL:
 *    /en-us canonicaliza a /en-us, NUNCA a /en-au aunque el contenido inglés sea
 *    idéntico — el "duplicado" entre mercados lo resuelve el hreflang, no el
 *    canonical; canonicalizar a un solo inglés sacaría a US/NZ del índice).
 *  - languages: las 5 versiones (hreflang BCP-47) + "x-default" -> versión en-au
 */
export function buildAlternates(locale: string, pathname: string) {
  // Normalizar: la home puede llegar como "" o "/"; el resto empieza con "/".
  const path = !pathname || pathname === "/" ? "" : pathname;

  const urlFor = (loc: string) => `${SITE_URL}/${loc}${path}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    // Reciprocidad: cada mercado se lista, incluido el propio
    // (en-AU, en-US, en-NZ, es-MX, pt-BR).
    languages[LOCALE_TO_HREFLANG[loc]] = urlFor(loc);
  }
  // x-default apunta a la versión del locale por defecto (en-au).
  languages["x-default"] = urlFor(routing.defaultLocale);

  return {
    canonical: urlFor(locale),
    languages,
  };
}

/**
 * Construye el bloque `openGraph` + `twitter` localizado por locale para una página
 * del grupo (web).
 *
 * @param locale   locale actual (slug de la URL, p.ej. "es-mx")
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
  const loc = getMarket(locale).locale; // normaliza: locale inválido -> default
  const path = !pathname || pathname === "/" ? "" : pathname;

  const pageUrl = `${SITE_URL}/${loc}${path}`;
  // La imagen OG es por IDIOMA (og-en/og-es/og-pt-br): los 3 mercados ingleses la comparten.
  const imageUrl = `${SITE_URL}${LOCALE_TO_OG_IMAGE[loc]}`; // absoluta contra NEXT_PUBLIC_APP_URL

  // Los OTROS mercados OG, declarados como og:locale:alternate.
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
