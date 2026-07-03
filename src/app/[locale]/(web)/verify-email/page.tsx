import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/i18n/metadata";
import VerifyEmailContent from "./VerifyEmailContent";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: buildAlternates(locale, "/verify-email"),
    // Página funcional de auth: hreflang correcto por si se rastrea, pero fuera del índice.
    robots: { index: false, follow: true },
  };
}

export default function VerifyEmailPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <VerifyEmailContent />;
}
