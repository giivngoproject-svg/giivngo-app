import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { cookies } from "@/content/legal/cookies";
import { LOCALE_TO_DICT, type Locale } from "@/i18n/markets";

const PATH = "/cookies";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = cookies[LOCALE_TO_DICT[locale as Locale] ?? "en"];
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
  const doc = cookies[LOCALE_TO_DICT[locale as Locale] ?? "en"];
  return <LegalPage doc={doc} locale={locale} />;
}
