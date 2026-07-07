import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { isLocale, LOCALE_TO_DICT } from "./markets";

export default getRequestConfig(async ({ requestLocale }) => {
  // requestLocale viene del segmento [locale] de la URL
  let locale = await requestLocale;

  // Validar contra la lista blanca; si no, usar el default
  if (!isLocale(locale)) {
    locale = routing.defaultLocale;
  }

  // Los messages van por IDIOMA (dict), no por mercado: en-au/en-us/en-nz
  // comparten en.json (muchos-a-uno).
  const dict = LOCALE_TO_DICT[locale as (typeof routing.locales)[number]];

  return {
    locale,
    messages: (await import(`./messages/${dict}.json`)).default,
  };
});
