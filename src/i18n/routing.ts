import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Locales públicos (SEO). El formato es el que va en la URL.
  locales: ["en-au", "es-419", "pt-br"],

  // Idioma por defecto. Con opción A, la raíz "/" redirige a este.
  defaultLocale: "en-au",

  // "always" = todas las URLs llevan prefijo, incluido el default.
  // Esto es lo que decidimos en Paso 1 (opción A).
  localePrefix: "always",
});

// Tipo derivado para usar en toda la app
export type Locale = (typeof routing.locales)[number];
