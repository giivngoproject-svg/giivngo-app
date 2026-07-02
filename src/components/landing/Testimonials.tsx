"use client";

import { useTranslation } from "@/lib/useTranslation";

const heading = "font-[family-name:var(--font-poppins)]";

const TESTIMONIALS = [
  {
    name: "Jess",
    city: "Sydney",
    img: 5,
    quote:
      "Giivngo made our Bali trip so easy. Everyone chipped in, we hit our goal fast and had the best time!",
  },
  {
    name: "Liam",
    city: "Melbourne",
    img: 12,
    quote:
      "I set up a pool for my birthday and woke up to the sweetest surprise. Best gift ever.",
  },
  {
    name: "Mark",
    city: "Brisbane",
    img: 33,
    quote:
      "Our footy tipping group has never been better. Giivngo keeps it simple and stress-free.",
  },
  {
    name: "Priya",
    city: "Perth",
    img: 45,
    quote:
      "Love our weekly lotto syndicate. So easy to manage and everyone stays in the loop.",
  },
];

export function Testimonials() {
  const t = useTranslation();

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16">
      <h2 className={`${heading} mb-8 text-5xl md:text-6xl font-extrabold text-foreground`}>
        {t("landing.testimonials.title")}
      </h2>
      <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-4">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="rounded-[18px] border border-border bg-white p-[22px]"
          >
            <div className="flex items-start gap-3">
              <img
                src={`https://i.pravatar.cc/100?img=${t.img}`}
                alt={t.name}
                className="h-[42px] w-[42px] flex-[0_0_42px] rounded-full object-cover"
              />
              <p className="text-[13.5px] leading-relaxed text-gray-700">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>
            <p className="mt-4 text-[13px] text-muted">
              <b className="font-bold text-foreground">{t.name}</b>, {t.city}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
