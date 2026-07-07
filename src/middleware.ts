import createMiddleware from "next-intl/middleware";
import { NextResponse, userAgent, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import {
  COUNTRY_TO_LOCALE,
  DEFAULT_LOCALE,
  LOCALES,
  isLocale,
  type Locale,
} from "@/i18n/markets";

// Middleware del sitio público: detección de mercado propia + next-intl.
//
// next-intl va con localeDetection:false (ver i18n/routing.ts): NO se usa
// Accept-Language a propósito — en-au/en-us/en-nz comparten idioma y ese header
// no distingue el país. La detección es por PAÍS (header de Vercel
// x-vercel-ip-country) y SOLO decide la primera visita; no "re-arreglar" esto
// volviendo a Accept-Language.
const intlMiddleware = createMiddleware(routing);

// ¿La URL ya trae prefijo de locale? (/{locale} exacto o /{locale}/…)
function pathnameLocale(pathname: string): Locale | undefined {
  return LOCALES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
}

// Prioridad: cookie válida (elección EXPLÍCITA del usuario, escrita por el
// selector de mercados) > país por IP (primera visita) > default en-au.
function resolveLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (isLocale(cookie)) return cookie; // ignora cookies con locales retirados o basura

  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase();
  const byCountry = country ? COUNTRY_TO_LOCALE[country] : undefined;
  if (byCountry) return byCountry;

  return DEFAULT_LOCALE; // sin header (localhost/preview) o país no mapeado
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // URLs CON prefijo: la URL manda (SEO). Se sirven tal cual, sin redirect,
  // tanto a humanos como a bots — cada variante es directamente rastreable.
  if (pathnameLocale(pathname)) {
    return intlMiddleware(req);
  }

  // URLs SIN prefijo (la raíz "/" y deep-links residuales): hay que elegir mercado.
  // Bots: JAMÁS geo-redirect — van determinísticamente a en-au (la versión
  // x-default), para que el crawl no dependa de la IP del crawler (Googlebot
  // rastrea desde EE. UU.). Las demás variantes las descubre vía hreflang,
  // sitemap y los <a href> del selector de mercados.
  const locale = userAgent(req).isBot ? DEFAULT_LOCALE : resolveLocale(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`; // query se preserva

  // 307 SIEMPRE: el destino depende de geo/cookie → nunca un redirect permanente
  // (un 301 aquí envenenaría cachés y SEO).
  const res = NextResponse.redirect(url, 307);

  // Limpiar una cookie heredada con un locale retirado (de etapas anteriores del sitio).
  const stale = req.cookies.get("NEXT_LOCALE")?.value;
  if (stale && !isLocale(stale)) {
    res.cookies.delete("NEXT_LOCALE");
  }

  return res;
}

export const config = {
  // IMPORTANTE: el panel usa rutas a nivel RAÍZ sin prefijo (/dashboard, /create, …),
  // así que NO podemos usar un simple "todo excepto _next". Excluimos explícitamente
  // cada rama que NO debe localizarse; el resto (la raíz "/" y las rutas de (web))
  // sí pasa por el middleware.
  //
  // El negative-lookahead excluye rutas que EMPIEZAN por:
  //   api          -> API routes (/api/**)
  //   _next        -> internals de Next (/_next/**)
  //   _vercel      -> internals de Vercel
  //   auth         -> callback OAuth de Supabase (/auth/**) — sin prefijo ni redirect
  //   dashboard, create, manage, profile, settings -> TODO el grupo (panel)
  //   .*\..*       -> cualquier archivo con extensión (favicon.ico, sitemap.xml,
  //                   robots.txt, imágenes, etc.)
  //
  // ⚠️  Los nombres del panel (dashboard|create|manage|profile|settings) están
  //     hardcodeados porque el panel vive en rutas raíz sin prefijo. Si se añade una
  //     ruta de panel nueva a nivel raíz, DEBE agregarse a este matcher o el middleware
  //     intentará localizarla y dará 404.
  matcher: [
    "/((?!api|_next|_vercel|auth|dashboard|create|manage|profile|settings|.*\\..*).*)",
  ],
};
