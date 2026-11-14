/**
 * Redes sociales oficiales de giivngo.
 * Fuente única: usada por el footer, el pie de home2 y el JSON-LD (sameAs).
 * Si cambian los handles, editar solo este archivo.
 */
export type SocialId = "instagram" | "facebook" | "tiktok";

export interface SocialLink {
  id: SocialId;
  label: string;
  url: string;
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { id: "instagram", label: "Instagram", url: "https://www.instagram.com/giivngo" },
  { id: "facebook", label: "Facebook", url: "https://www.facebook.com/giivngo" },
  { id: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@giivngo" },
];
