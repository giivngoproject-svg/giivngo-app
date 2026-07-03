import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/i18n/metadata";
import SearchAllContent from "./SearchAllContent";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    alternates: buildAlternates(locale, "/search/all"),
  };
}

export default function SearchAllPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  return <SearchAllContent />;
}
