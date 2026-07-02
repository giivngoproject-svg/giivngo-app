import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Wrappers de navegación conscientes del locale (Link/useRouter/usePathname/…).
// usePathname() devuelve la ruta SIN el prefijo de locale; router.replace(path, { locale })
// navega a la misma ruta bajo otro idioma.
export const { Link, useRouter, usePathname, redirect, getPathname } =
  createNavigation(routing);
