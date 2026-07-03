import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://giivngo.com";

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
