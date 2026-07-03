import type { Metadata } from "next";
import { buildAlternates, buildSocial } from "@/i18n/metadata";
import CampaignContent from "./CampaignContent";

export async function generateMetadata({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  return {
    ...buildSocial(locale, `/campaign/${slug}`),
    // canonical/hreflang con el slug real de la campaña.
    alternates: buildAlternates(locale, `/campaign/${slug}`),
  };
}

// El cliente lee el slug con useParams(); no necesita props.
export default function CampaignPage() {
  return <CampaignContent />;
}
