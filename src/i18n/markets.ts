// FUENTE ÚNICA DE VERDAD de los mercados públicos (sitio web).
//
// Añadir un mercado = añadir UNA entrada aquí (+ imagen /og/og-{dict}.jpg solo si
// es un idioma nuevo). Todo lo demás (routing, hreflang, og:locale, imagen OG,
// diccionario, selector, detección por país) DERIVA de este array — no escribir
// mapeos de locales a mano en ningún otro archivo.
//
// Módulo hoja: no importa nada de i18n (routing.ts importa de aquí, nunca al revés).

type MarketDef = {
  /** Slug de la URL, en minúsculas (p.ej. "en-au"). */
  readonly locale: string;
  /** Etiqueta BCP-47 con casing correcto, para hreflang y sitemap (p.ej. "en-AU"). */
  readonly hreflang: string;
  /** og:locale en formato language_TERRITORY (p.ej. "en_AU"). */
  readonly ogLocale: string;
  /** Clave del diccionario translations.ts, del archivo messages/{dict}.json y de la OG image og-{dict}.jpg. */
  readonly dict: string;
  /** Código ISO 3166-1 alpha-2 que devuelve el header x-vercel-ip-country. */
  readonly country: string;
  readonly countryName: string;
  readonly flag: string;
  readonly languageLabel: string;
  /**
   * Países ADICIONALES que aterrizan en este mercado en su primera visita.
   *
   * ⚠️  Este mapeo es SOLO selección de idioma para la primera visita: NO implica
   * que giivngo opere en ese país ni que los precios estén en su moneda/mercado.
   * Es capa de idioma, no de mercado (la estrategia de moneda por país sigue
   * pendiente de definición del negocio).
   */
  readonly extraCountries: readonly string[];
};

export const MARKETS = [
  {
    locale: "en-au",
    hreflang: "en-AU",
    ogLocale: "en_AU",
    dict: "en",
    country: "AU",
    countryName: "Australia",
    flag: "🇦🇺",
    languageLabel: "English",
    extraCountries: [],
  },
  {
    locale: "en-us",
    hreflang: "en-US",
    ogLocale: "en_US",
    dict: "en",
    country: "US",
    countryName: "United States",
    flag: "🇺🇸",
    languageLabel: "English",
    extraCountries: [],
  },
  {
    locale: "en-nz",
    hreflang: "en-NZ",
    ogLocale: "en_NZ",
    dict: "en",
    country: "NZ",
    countryName: "New Zealand",
    flag: "🇳🇿",
    languageLabel: "English",
    extraCountries: [],
  },
  {
    locale: "es-mx",
    hreflang: "es-MX",
    ogLocale: "es_MX",
    dict: "es",
    country: "MX",
    countryName: "México",
    flag: "🇲🇽",
    languageLabel: "Español",
    // Hispanohablantes de LatAm → español en su primera visita (solo idioma, ver MarketDef).
    // España (ES) EXCLUIDA a propósito: el español LatAm (tuteo) chirría allí → cae a en-au.
    extraCountries: [
      "AR", "CL", "CO", "PE", "VE", "EC", "GT", "BO", "DO",
      "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR",
    ],
  },
  {
    locale: "pt-br",
    hreflang: "pt-BR",
    ogLocale: "pt_BR",
    dict: "pt-br",
    country: "BR",
    countryName: "Brasil",
    flag: "🇧🇷",
    languageLabel: "Português",
    // Lusófonos → portugués en su primera visita (solo idioma, ver MarketDef).
    extraCountries: ["PT", "AO", "MZ"],
  },
] as const satisfies readonly MarketDef[];

export type Market = (typeof MARKETS)[number];
export type Locale = Market["locale"]; // "en-au" | "en-us" | "en-nz" | "es-mx" | "pt-br"
export type Dict = Market["dict"]; // "en" | "es" | "pt-br"

export const DEFAULT_LOCALE = "en-au" satisfies Locale;

export const LOCALES: readonly Locale[] = MARKETS.map((m) => m.locale);

const BY_LOCALE = Object.fromEntries(
  MARKETS.map((m) => [m.locale, m])
) as Record<Locale, Market>;

/** Mercado del locale dado; si el locale no existe, el del default (en-au). */
export function getMarket(locale: string): Market {
  return BY_LOCALE[locale as Locale] ?? BY_LOCALE[DEFAULT_LOCALE];
}

/** Type guard: ¿es un slug de locale válido? (rechaza cookies/valores de locales retirados). */
export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && v in BY_LOCALE;
}

// —— Mapeos DERIVADOS (nunca escribirlos a mano en otro sitio) ——

/** slug de URL -> clave del diccionario translations.ts / messages/{dict}.json (muchos-a-uno). */
export const LOCALE_TO_DICT = Object.fromEntries(
  MARKETS.map((m) => [m.locale, m.dict])
) as Record<Locale, Dict>;

/** slug de URL -> etiqueta hreflang BCP-47. */
export const LOCALE_TO_HREFLANG = Object.fromEntries(
  MARKETS.map((m) => [m.locale, m.hreflang])
) as Record<Locale, string>;

/** slug de URL -> og:locale. */
export const LOCALE_TO_OG = Object.fromEntries(
  MARKETS.map((m) => [m.locale, m.ogLocale])
) as Record<Locale, string>;

/** slug de URL -> imagen OG. Por IDIOMA (dict): en-au/en-us/en-nz comparten /og/og-en.jpg. */
export const LOCALE_TO_OG_IMAGE = Object.fromEntries(
  MARKETS.map((m) => [m.locale, `/og/og-${m.dict}.jpg`])
) as Record<Locale, string>;

/**
 * País ISO -> locale de aterrizaje en la PRIMERA visita (country + extraCountries).
 * Solo capa de idioma; ver la advertencia en MarketDef.extraCountries.
 */
export const COUNTRY_TO_LOCALE: Record<string, Locale> = Object.fromEntries(
  MARKETS.flatMap((m) => [
    [m.country, m.locale],
    ...m.extraCountries.map((c) => [c, m.locale]),
  ])
);

/**
 * dict -> locale "canónico" del idioma (el PRIMER mercado del array con ese dict):
 * en→en-au, es→es-mx, pt-br→pt-br. Lo usa el panel para sembrar el provider.
 */
export const DICT_TO_LOCALE = Object.fromEntries(
  [...MARKETS].reverse().map((m) => [m.dict, m.locale])
) as Record<Dict, Locale>;
