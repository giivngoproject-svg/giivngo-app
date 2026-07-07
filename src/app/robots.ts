import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Rutas privadas / no públicas (panel, auth callback, API). No aportan a SEO.
      disallow: [
        "/dashboard",
        "/create",
        "/manage",
        "/profile",
        "/settings",
        "/auth",
        "/api",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
