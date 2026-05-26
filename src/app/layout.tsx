import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { MockStripeCheckout } from "@/components/checkout/MockStripeCheckout";
import { SeedBootstrap } from "@/components/SeedBootstrap";

export const metadata: Metadata = {
  title: "giivngo · Group money pooling demo",
  description:
    "Frontend-only demo of a group money pooling platform — birthday funds, footy tipping, farewells, anything.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <SeedBootstrap />
        <TopNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
        <MockStripeCheckout />
      </body>
    </html>
  );
}
