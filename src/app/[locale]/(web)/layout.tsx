import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getSiteJsonLd } from "@/i18n/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { MockStripeCheckout } from "@/components/checkout/MockStripeCheckout";

// Prerender estático de las rutas públicas por locale (SEO)
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function WebLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  // Validar el locale de la URL contra la lista blanca de routing
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Habilita el render estático para este segmento
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      {/* JSON-LD del sitio (Organization + WebSite): igual en todas las páginas públicas. */}
      <JsonLd data={getSiteJsonLd()} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="min-h-screen flex flex-col">
          <TopNav />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
          <MockStripeCheckout />
        </div>
      </NextIntlClientProvider>
    </>
  );
}
