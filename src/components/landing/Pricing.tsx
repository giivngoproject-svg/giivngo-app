"use client";

import { useTranslation } from "@/lib/useTranslation";
import { Lock, Shield, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const heading = "font-[family-name:var(--font-poppins)]";

type Chip = { labelKey: string; Icon: LucideIcon };

const CHIPS: Chip[] = [
  { labelKey: "landing.security.bank", Icon: Lock },
  { labelKey: "landing.security.bank", Icon: Shield },
  { labelKey: "landing.benefit.transparent", Icon: Eye },
];

export function Pricing() {
  const t = useTranslation();

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16">
      {/* mobile-only title (shown above the fee panel); the desktop title lives in the right column */}
      <h2 className={`${heading} mb-8 text-5xl md:text-6xl font-extrabold text-foreground lg:hidden`}>
        Simple <span className="text-brand">pricing</span>
      </h2>
      <div className="grid items-stretch gap-10 lg:grid-cols-2">
        {/* left: fee focal panel */}
        <div className="flex flex-col items-center justify-center rounded-[22px] bg-brand/10 px-8 py-11 text-center">
          <p className="mb-3.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-brand">
            {t("landing.nav.pricing")}
          </p>
          <p className={`${heading} whitespace-nowrap text-[40px] font-extrabold leading-none text-brandStrong sm:text-[46px]`}>
            4% + A$0.60
          </p>
          <p className="mt-[18px] max-w-[300px] text-[15px] text-muted">
            On a A$100 contribution, A$95.40 goes straight to the pool.
          </p>
        </div>
        {/* right: title + copy + chips, vertically centered within shared height */}
        <div className="flex flex-col justify-center">
          <h2 className={`${heading} mb-6 text-5xl md:text-6xl font-extrabold text-foreground hidden lg:block`}>
            Simple <span className="text-brand">pricing</span>
          </h2>
          <p className="mb-3.5 text-[16.5px] leading-relaxed text-gray-700">
            Creating a pool is always free. When friends contribute, a small 4% +
            A$0.60 fee per contribution keeps Giivngo running and your money safe.
          </p>
          <p className="mb-6 text-[16.5px] font-semibold leading-relaxed text-foreground">
            No subscriptions. No hidden fees. You see it upfront, every time.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {CHIPS.map((chip) => (
              <span
                key={chip.labelKey}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-2 text-[13.5px] font-semibold text-gray-600"
              >
                <chip.Icon size={16} className="text-brandStrong" />
                {t(chip.labelKey as any)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
