import type { Metadata } from "next";
import Script from "next/script";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { SeedBootstrap } from "@/components/SeedBootstrap";
import { TokenExpiryMonitor } from "@/components/TokenExpiryMonitor";

export const metadata: Metadata = {
  title: "giivngo · Group money pooling",
  description:
    "Social gifting for life's happy moments. Create a pool, invite your people, and make amazing things happen together.",
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
