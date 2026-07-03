import type { Metadata } from "next";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import SearchSlugContent from "./SearchSlugContent";

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  return {
    ...buildSocial(locale, `/search/${slug}`),
    // canonical/hreflang con el slug real de la búsqueda.
    alternates: buildAlternates(locale, `/search/${slug}`),
  };
}

// El cliente lee el slug vía su prop params; se lo pasamos tal cual.
export default function SearchSlugPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  return <SearchSlugContent params={params} />;
}
