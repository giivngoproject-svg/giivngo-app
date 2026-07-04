import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import { LegalPage } from "@/components/legal/LegalPage";
import { terms } from "@/content/legal/terms";

const PATH = "/terms";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const doc = terms[locale as keyof typeof terms] ?? terms["en-au"];
  return {
    title: doc.title,
    description: doc.description,
    ...buildSocial(locale, PATH),
    alternates: buildAlternates(locale, PATH),
  };
}

export default function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const doc = terms[locale as keyof typeof terms] ?? terms["en-au"];
  return <LegalPage doc={doc} locale={locale} />;
}
