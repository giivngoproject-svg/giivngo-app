import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { privacy } from "@/content/legal/privacy";

const PATH = "/privacy";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = privacy[locale as keyof typeof privacy] ?? privacy["en-au"];
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
  const doc = privacy[locale as keyof typeof privacy] ?? privacy["en-au"];
  return <LegalPage doc={doc} locale={locale} />;
}
