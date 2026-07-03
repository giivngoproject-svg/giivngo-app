import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/i18n/metadata";
import Home1 from "./home1";
import Home2 from "./home2";

const ACTIVE_HOME = process.env.NEXT_PUBLIC_ACTIVE_HOME || "home1";

// hreflang + canonical auto-referencial de la home (ruta = "/" del locale).
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: buildAlternates(locale, "/"),
  };
}

// Server component wrapper: exporta metadata y renderiza la UI cliente (Home1/Home2),
// que conservan su propio 'use client'. La lógica de selección no cambia.
export default function LandingPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Mantiene el render estático del segmento.
  setRequestLocale(locale);

  if (ACTIVE_HOME === "home2") {
    return <Home2 />;
  }
  return <Home1 />;
}
