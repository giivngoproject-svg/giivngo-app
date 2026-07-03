import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION } from "@/i18n/metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "giivngo",
    short_name: "giivngo",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    lang: "en-AU",
    // Colores de marca reales (src/app/globals.css :root):
    //   --background: 255 255 255  -> #ffffff
    //   --brand:      124 92 255   -> #7c5cff  (violeta del hero)
    background_color: "#ffffff",
    theme_color: "#7c5cff",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
