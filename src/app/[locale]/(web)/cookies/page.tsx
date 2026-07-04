import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { cookies } from "@/content/legal/cookies";

const PATH = "/cookies";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = cookies[locale as keyof typeof cookies] ?? cookies["en-au"];
  return {
    title: doc.title,
    description: doc.description,
    ...buildSocial(locale, PATH),
    alternates: buildAlternates(locale, PATH),
  };
}

export default function CookiesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const doc = cookies[locale as keyof typeof cookies] ?? cookies["en-au"];
  return <LegalPage doc={doc} locale={locale} />;
}
