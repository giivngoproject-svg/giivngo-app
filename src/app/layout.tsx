import type { Metadata } from "next";
import Script from "next/script";
import { getLocale } from "next-intl/server";
import { SITE_DESCRIPTION, SITE_URL } from "@/i18n/metadata";
import "./globals.css";
import { SeedBootstrap } from "@/components/SeedBootstrap";
import { TokenExpiryMonitor } from "@/components/TokenExpiryMonitor";

export const metadata: Metadata = {
  // Base para resolver todas las URLs relativas de metadata (canonical, OG, etc.).
  metadataBase: new URL(SITE_URL),
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
      <head>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TFDGMSZP');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <body className="min-h-screen antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TFDGMSZP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
        <SeedBootstrap />
        <TokenExpiryMonitor />
        {children}
      </body>
    </html>
  );
}
