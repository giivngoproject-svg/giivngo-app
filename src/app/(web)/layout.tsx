import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";
import { Toaster } from "@/components/ui/Toaster";
import { MockStripeCheckout } from "@/components/checkout/MockStripeCheckout";

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
      <MockStripeCheckout />
    </div>
  );
}
