import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/content/legal/privacy";
import { LOCALE_TO_DICT, type Locale } from "@/i18n/markets";

const PATH = "/privacy";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = privacy[LOCALE_TO_DICT[locale as Locale] ?? "en"];
  return {
    title: doc.title,
    description: doc.description,
    ...buildSocial(locale, PATH),
    alternates: buildAlternates(locale, PATH),
  };
}

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const doc = privacy[LOCALE_TO_DICT[locale as Locale] ?? "en"];
  return <LegalPage doc={doc} locale={locale} />;
}
