import type { Metadata } from "next";
import Script from "next/script";
import { getLocale } from "next-intl/server";
import { SITE_DESCRIPTION } from "@/i18n/metadata";
import "./globals.css";
import { SeedBootstrap } from "@/components/SeedBootstrap";
import { TokenExpiryMonitor } from "@/components/TokenExpiryMonitor";

export const metadata: Metadata = {
  // Base para resolver todas las URLs relativas de metadata (canonical, OG, etc.).
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://giivngo.com"),
  title: {
    // Título por defecto (home / páginas sin título propio).
    default: "giivngo · Group money pooling",
    // Las páginas hijas que definan un title string heredan el sufijo de marca:
    //   title: "Sign in"  ->  "Sign in · giivngo"
    template: "%s · giivngo",
  },
  // Fuente única compartida con el JSON-LD (Organization.description).
  description: SITE_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className='scroll-smooth'>
      <body className="min-h-screen antialiased">
        <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
        <SeedBootstrap />
        <TokenExpiryMonitor />
        {children}
      </body>
    </html>
  );
}
