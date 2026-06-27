import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { SeedBootstrap } from "@/components/SeedBootstrap";
import { TokenExpiryMonitor } from "@/components/TokenExpiryMonitor";

export const metadata: Metadata = {
  title: "giivngo · Group money pooling",
  description:
    "Social gifting for life's happy moments. Create a pool, invite your people, and make amazing things happen together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='scroll-smooth'>
      <body className="min-h-screen antialiased">
        <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
        <SeedBootstrap />
        <TokenExpiryMonitor />
        {children}
      </body>
    </html>
  );
}
