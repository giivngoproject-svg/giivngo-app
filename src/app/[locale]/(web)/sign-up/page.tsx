import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import SignUpContent from "./SignUpContent";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    ...buildSocial(locale, "/sign-up"),
    alternates: buildAlternates(locale, "/sign-up"),
    // Página funcional de auth: hreflang correcto por si se rastrea, pero fuera del índice.
    robots: { index: false, follow: true },
  };
}

export default function SignUpPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <SignUpContent />;
}
