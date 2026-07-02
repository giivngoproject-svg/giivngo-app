import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Middleware de next-intl: aplica localePrefix "always".
// - "/" redirige al locale negociado por Accept-Language (o al defaultLocale en-au).
// - Las rutas del grupo (web) resuelven su locale desde el prefijo de la URL.
export default createMiddleware(routing);

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
