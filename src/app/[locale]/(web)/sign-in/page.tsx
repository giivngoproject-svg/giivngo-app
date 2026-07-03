import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/i18n/metadata";
import SignInContent from "./SignInContent";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: buildAlternates(locale, "/sign-in"),
    // Página funcional de auth: hreflang correcto por si se rastrea, pero fuera del índice.
    robots: { index: false, follow: true },
  };
}

export default function SignInPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <SignInContent />;
}
