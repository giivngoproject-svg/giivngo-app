import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { faq } from "@/content/legal/faq";
import { LOCALE_TO_DICT, type Locale } from "@/i18n/markets";

const PATH = "/faq";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = faq[LOCALE_TO_DICT[locale as Locale] ?? "en"];
  return {
    title: doc.title,
    description: doc.description,
    ...buildSocial(locale, PATH),
    alternates: buildAlternates(locale, PATH),
  };
}

export default function FAQPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const doc = faq[LOCALE_TO_DICT[locale as Locale] ?? "en"];
  return <LegalPage doc={doc} locale={locale} />;
}
