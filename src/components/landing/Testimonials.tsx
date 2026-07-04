"use client";

import { useTranslation } from "@/lib/useTranslation";

const heading = "font-[family-name:var(--font-poppins)]";

const TESTIMONIALS = [
  {
    name: "Jess",
    city: "Sydney",
    img: 5,
    quoteKey: "landing.testimonials.1.quote" as const,
  },
  {
    name: "Liam",
    city: "Melbourne",
    img: 12,
    quoteKey: "landing.testimonials.2.quote" as const,
  },
  {
    name: "Mark",
    city: "Brisbane",
    img: 33,
    quoteKey: "landing.testimonials.3.quote" as const,
  },
  {
    name: "Priya",
    city: "Perth",
    img: 45,
    quoteKey: "landing.testimonials.4.quote" as const,
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
        {TESTIMONIALS.map((item) => (
          <div
            key={item.name}
            className="rounded-[18px] border border-border bg-white p-[22px]"
          >
            <div className="flex items-start gap-3">
              <img
                src={`https://i.pravatar.cc/100?img=${item.img}`}
                alt={item.name}
                className="h-[42px] w-[42px] flex-[0_0_42px] rounded-full object-cover"
              />
              <p className="text-[13.5px] leading-relaxed text-gray-700">
                &ldquo;{t(item.quoteKey)}&rdquo;
              </p>
            </div>
            <p className="mt-4 text-[13px] text-muted">
              <b className="font-bold text-foreground">{item.name}</b>, {item.city}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
