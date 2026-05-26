import Link from "next/link";
import {
  Cake,
  Trophy,
  Heart,
  Sparkles,
  ArrowRight,
  Ticket,
  Share2,
  Banknote,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const USE_CASES = [
  { icon: Cake, title: "Birthday trip funds", body: "Pool flights, villas, and a few cocktails for the guest of honour." },
  { icon: Trophy, title: "Footy tipping pools", body: "Collect the buy-in once and pay the winner with one click at season's end." },
  { icon: Heart, title: "Farewell collections", body: "Send someone off properly without chasing 23 people for $20 over Slack." },
  { icon: Ticket, title: "Group event entry", body: "Split tickets, dinners, and trips. Everyone pays their share to one link." },
];

const STEPS = [
  { icon: Sparkles, title: "Create a campaign", body: "Title, photo, optional goal, end date. Two minutes, max." },
  { icon: Share2, title: "Share the link", body: "Email, SMS, WhatsApp, or just paste it anywhere. Contributors don't need an account." },
  { icon: Banknote, title: "Get paid out", body: "Funds held safely in escrow, then transferred to your bank on end date." },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-32 -left-20 w-[420px] h-[420px] rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute top-32 -right-24 w-[380px] h-[380px] rounded-full bg-sky-200/40 blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 px-3 py-1 rounded-full">
            <Sparkles size={12} />
            Built for Australia · Stripe escrow · 2.5% flat fee
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-balance">
            Pool money.
            <br />
            <span className="text-accent">Skip the awkward chase.</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-xl mx-auto text-balance">
            One link, one place to chip in. Birthday trips, footy tipping, farewells, office lotto —
            we hold the funds and pay them out automatically when your campaign ends.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto">
                Start a campaign
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/campaign/sarahs-30th">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                See a live campaign
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted mt-4">No account needed to contribute.</p>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <p className="text-sm font-medium text-muted text-center">Use it for</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {USE_CASES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="p-6 rounded-3xl border border-border bg-background hover:shadow-soft transition-shadow"
            >
              <Icon size={24} className="text-accent" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="text-sm text-muted mt-1">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How it works</h2>
          <p className="text-muted mt-2">Three steps. No spreadsheets, no Venmo screenshots.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <div key={title} className="relative p-6 rounded-3xl bg-surface">
              <span className="absolute top-5 right-5 text-7xl font-bold text-foreground/[.04] leading-none">
                {i + 1}
              </span>
              <Icon size={28} className="text-accent" />
              <h3 className="mt-4 font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted mt-1.5">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Photo feature strip */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="rounded-3xl bg-foreground text-background p-8 sm:p-12 flex flex-col md:flex-row md:items-center gap-8">
          <Camera size={48} className="text-accent shrink-0" />
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Make it personal.
            </h2>
            <p className="mt-2 text-background/70 max-w-xl">
              Contributors can attach a photo with their note — a memory, a goofy selfie, an old polaroid.
              They appear on the campaign page next to the contribution.
            </p>
          </div>
          <Link href="/sign-up" className="shrink-0">
            <Button variant="primary" size="lg">
              Try it now
            </Button>
          </Link>
        </div>
      </section>

      {/* Fee transparency */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold">Free to create, free to contribute</h2>
        <p className="text-muted mt-2">
          2.5% platform fee comes out at payout. Stripe processing fees pass through to the contributor at checkout.
          No subscriptions. No paywalls.
        </p>
      </section>
    </div>
  );
}
