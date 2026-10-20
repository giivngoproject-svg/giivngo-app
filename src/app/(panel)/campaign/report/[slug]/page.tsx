"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/stores/auth";
import { useCampaigns } from "@/stores/campaigns";
import { useTranslation } from "@/lib/useTranslation";
import { formatCurrency } from "@/lib/money";
import { AuthCheck } from "@/components/AuthCheck";
import type { Contribution } from "@/lib/types";
import { LockKeyhole, Printer } from "lucide-react";
import Link from "next/link";

const EMPTY: Contribution[] = [];
const LOCALE = "en-AU";
const PAYOUT_DELAY_DAYS = 3; // Same rule as the scheduler: paid out 3 days after the campaign ends

function sum(items: Contribution[], pick: (c: Contribution) => number | undefined) {
  return items.reduce((total, c) => total + (pick(c) ?? 0), 0);
}

type SelectedItem = NonNullable<Contribution["selected_items"]>[number];

function CampaignReport() {
  const t = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const user = useAuth((s) => s.user);
  const campaign = useCampaigns((s) => s.campaigns.find((c) => c.slug === slug));
  const contributions = useCampaigns((s) => s.contributions[slug] ?? EMPTY);
  const loadCampaign = useCampaigns((s) => s.loadCampaign);
  const loadContributions = useCampaigns((s) => s.loadContributions);

  useEffect(() => {
    if (!slug) return;
    loadCampaign(slug).catch(console.error);
    loadContributions(slug).catch(console.error);
  }, [slug, loadCampaign, loadContributions]);

  // The browser uses the document title as the PDF file name when printing: "{campaign}_{date}"
  useEffect(() => {
    if (!campaign) return;
    const previous = document.title;
    const safeTitle = campaign.title.replace(/[\/:*?"<>|]+/g, "-").trim();
    const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in the user's time zone
    document.title = `${safeTitle}_${today}`;
    return () => {
      document.title = previous;
    };
  }, [campaign]);

  if (!campaign) {
    return <p className="p-8 text-sm text-gray-500">{t("report.loading")}</p>;
  }
  if (user && campaign.user_id !== user.id) {
    return <p className="p-8 text-sm text-gray-700">{t("report.not_owner")}</p>;
  }

  const currency = campaign.currency || "AUD";
  const money = (n: number) => formatCurrency(n, currency, LOCALE);
  const shortDate = (value: string | Date, options: Intl.DateTimeFormatOptions) =>
    new Date(value).toLocaleDateString(LOCALE, options);

  // Label of a selected item: the current item with the same id, else the stored label,
  // else the only current item with the same amount (items edited before labels were stored).
  const items = campaign.contribution_items ?? [];
  const itemLabel = (sel: SelectedItem) => {
    const byId = items.find((i) => i.id === sel.item_id);
    if (byId) return byId.label;
    if (sel.label) return sel.label;
    const byAmount = items.filter((i) => i.amount === sel.amount);
    if (byAmount.length === 1) return byAmount[0].label;
    return t("report.item_unknown");
  };

  // Per item: how many contributions chose it and how much was paid for it
  const itemStats = new Map<string, { paid: number; total: number }>();
  for (const item of items) itemStats.set(item.label, { paid: 0, total: 0 });
  for (const c of contributions) {
    const seen = new Set<string>();
    for (const sel of c.selected_items ?? []) {
      const label = itemLabel(sel);
      const stat = itemStats.get(label) ?? { paid: 0, total: 0 };
      stat.total += sel.amount;
      if (!seen.has(label)) {
        stat.paid += 1;
        seen.add(label);
      }
      itemStats.set(label, stat);
    }
  }
  const itemsTotal = contributions.reduce(
    (total, c) => total + (c.selected_items ?? []).reduce((s, sel) => s + sel.amount, 0),
    0,
  );

  const eventPaid = contributions.filter((c) => (c.event_cost_amount ?? 0) > 0);
  const eventCollected = sum(contributions, (c) => c.event_cost_amount);
  const eventPrice = campaign.event_cost_amount ?? 0;
  // The contribution amount includes the selected items; gifts are what is left after them
  const giftsOnly = sum(contributions, (c) => c.amount) - itemsTotal;
  const giftPayers = contributions.filter((c) => c.amount - (c.selected_items ?? []).reduce((s, x) => s + x.amount, 0) > 0);
  const tipPayers = contributions.filter((c) => (c.tip_amount ?? 0) > 0);
  const tipTotal = sum(contributions, (c) => c.tip_amount);
  const payout = eventCollected + sum(contributions, (c) => c.amount) + tipTotal;
  const spotsLeft = campaign.max_contributions
    ? Math.max(0, campaign.max_contributions - eventPaid.length)
    : null;

  const closes = new Date(campaign.end_date);
  const payoutDate = new Date(campaign.end_date);
  payoutDate.setDate(payoutDate.getDate() + PAYOUT_DELAY_DAYS);
  const downloaded = new Date().toLocaleString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const cards: Array<{ kicker?: string; title: string; value: string; sub?: string; highlight?: boolean }> = [];
  if (campaign.event_cost_enabled) {
    cards.push({
      // With a label: "Event Cost" small on top, the label below it
      kicker: campaign.event_cost_label ? t("campaign.event_cost.title") : undefined,
      title: campaign.event_cost_label || t("campaign.event_cost.title"),
      value: campaign.max_contributions
        ? t("report.paid_of", { paid: eventPaid.length, max: campaign.max_contributions })
        : t("report.paid", { paid: eventPaid.length }),
      sub: spotsLeft !== null ? t("report.spots_left", { spots: spotsLeft }) : undefined,
    });
    cards.push({
      title: t("report.collected"),
      value: money(eventCollected),
      sub: t("report.collected_calc", { count: eventPaid.length, price: money(eventPrice) }),
    });
  }
  for (const [label, stat] of Array.from(itemStats.entries())) {
    cards.push({
      title: label,
      value: t("report.paid", { paid: stat.paid }),
      sub: money(stat.total),
    });
  }
  // The gifts card only appears when at least one gift was given
  if (giftsOnly > 0) {
    cards.push({
      title: t("report.gifts"),
      value: money(giftsOnly),
      sub: t("report.from_people", { count: giftPayers.length }),
    });
  }
  cards.push({
    title: t("report.additional"),
    value: money(tipTotal),
    sub: t("report.from_people", { count: tipPayers.length }),
  });
  cards.push({
    title: t("report.payout"),
    value: money(payout),
    sub: t("report.payout_on", {
      date: shortDate(payoutDate, { weekday: "short", day: "numeric", month: "short" }),
    }),
    highlight: true,
  });

  const rows = contributions
    .slice()
    .sort((a, b) => +new Date(b.created_at ?? 0) - +new Date(a.created_at ?? 0));

  // Header repeated at the top of every sheet: logo, private notice, separator
  const pageHeader = (
    <>
      <div className="flex items-center justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.webp" alt="Giivngo" className="h-10 w-auto" />
        <p className="text-sm font-bold text-red-700 bg-red-500/10 py-1 px-2 rounded-xl font-bold"><LockKeyhole className="h-4 w-4 inline-block mr-2" /> {t("report.private")}</p>
      </div>
      <hr className="my-4 border-gray-300" />
    </>
  );

  // Messages from the gift wall: name, avatar, emoji and text
  const messages = contributions.filter((c) => (c.message ?? "").trim().length > 0);
  const honoree = campaign.recipient_name?.trim() || campaign.organiser_name;

  return (
    <>
      <div className="report mx-auto max-w-4xl bg-white p-8 text-black">
        {/* Print only the report: hide the site chrome around it */}
        <style>{`
        @media print {
          body * { visibility: hidden; }
          .report, .report * { visibility: visible; }
          .report { position: absolute; inset: 0; padding: 0; }
          .report * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: 216mm 330mm; margin: 3mm; } /* Oficio, 3 mm margins */
          .messages-page { break-before: page; page-break-before: always; }
        }
      `}</style>

        <div className="mb-4 flex justify-end print:hidden">

          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white flex items-center  gap-2"
          >
            <Printer size={20} className="ml-2 animate-pulse" /> {t("report.print")}
          </button>
        </div>

        {pageHeader}

        <h1 className="text-3xl font-bold tracking-tight">{t("report.title", { title: campaign.title })}</h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("report.subtitle", {
            organiser: campaign.organiser_name,
            closes: shortDate(closes, { day: "numeric", month: "long", year: "numeric" }),
            downloaded,
          })}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-700">{t("report.currency", { currency })}</p>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {cards.map((card, index) => (
            <div
              key={`${card.title}-${index}`}
              className={
                card.highlight
                  ? "rounded-xl bg-[#242052] p-4 text-white"
                  : "rounded-xl border border-gray-200 p-4"
              }
            >
              {card.kicker && (
                <p className={`text-[10px] uppercase tracking-wide ${card.highlight ? "text-white/80" : "text-gray-500"}`}>
                  {card.kicker}
                </p>
              )}
              <p
                className={
                  card.kicker
                    ? `text-sm font-semibold ${card.highlight ? "text-white" : "text-gray-900"}`
                    : `text-xs uppercase tracking-wide ${card.highlight ? "text-white/80" : "text-gray-500"}`
                }
              >
                {card.title}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{card.value}</p>
              {card.sub && (
                <p className={`mt-1 text-xs ${card.highlight ? "text-white/90" : "text-gray-600"}`}>{card.sub}</p>
              )}
            </div>
          ))}
        </div>

        <h2 className="mt-8 text-lg font-semibold">{t("report.who_paid")} ({rows.length + 1})</h2>
        {rows.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{t("report.none")}</p>
        ) : (
          <table className="mt-2 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-left text-xs uppercase text-gray-500">
                <th className="py-2 pr-2">{t("report.col_name")}</th>
                {campaign.event_cost_enabled && <th className="py-2 pr-2 text-right">{t("report.col_event")}</th>}
                {items.length > 0 && <th className="py-2 pr-2 text-right">{t("report.col_items")}</th>}
                <th className="py-2 pr-2 text-right">{t("report.col_gift")}</th>
                <th className="py-2 pr-2 text-right">{t("report.col_additional")}</th>
                <th className="py-2 pr-2 text-right">{t("report.col_date")}</th>
                <th className="py-2 text-right">{t("report.col_subtotal")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, index) => {
                const picked = c.selected_items ?? [];
                const pickedAmount = picked.reduce((s, x) => s + x.amount, 0);
                const gift = c.amount - pickedAmount;
                const event = c.event_cost_amount ?? 0;
                const tip = c.tip_amount ?? 0;
                // What this contributor paid: event cost + items + gift + additional
                const subtotal = event + c.amount + tip;
                return (
                  <tr
                    key={c.id}
                    className={`border-b border-gray-100 align-top ${index % 2 === 1 ? "bg-[#faf9fb]" : ""}`}
                  >
                    <td className="py-2 pr-2">{c.contributor_name || t("report.anonymous")}</td>
                    {campaign.event_cost_enabled && (
                      <td className="py-2 pr-2 text-right tabular-nums">{event > 0 ? money(event) : "—"}</td>
                    )}
                    {items.length > 0 && (
                      <td className="py-2 pr-2 text-right">
                        {picked.length > 0 ? (
                          <ul className="space-y-0.5">
                            {picked.map((x, index) => (
                              <li key={`${x.item_id}-${index}`} className="tabular-nums">
                                {itemLabel(x)} · {money(x.amount)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "—"
                        )}
                      </td>
                    )}
                    <td className="py-2 pr-2 text-right tabular-nums">{gift > 0 ? money(gift) : "—"}</td>
                    <td className="py-2 pr-2 text-right tabular-nums">{tip > 0 ? money(tip) : "—"}</td>
                    <td className="py-2 pr-2 text-right">
                      {c.created_at ? shortDate(c.created_at, { day: "numeric", month: "short" }) : "—"}
                    </td>
                    <td className="py-2 text-right font-semibold tabular-nums">{money(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300 font-semibold">
                <td className="py-2 pr-2">{t("report.total")}</td>
                {campaign.event_cost_enabled && (
                  <td className="py-2 pr-2 text-right tabular-nums">{money(eventCollected)}</td>
                )}
                {items.length > 0 && <td className="py-2 pr-2 text-right tabular-nums">{money(itemsTotal)}</td>}
                <td className="py-2 pr-2 text-right tabular-nums">{money(giftsOnly)}</td>
                <td className="py-2 pr-2 text-right tabular-nums">{money(tipTotal)}</td>
                <td className="py-2 pr-2" />
                <td className="py-2 text-right tabular-nums">{money(payout)}</td>
              </tr>
            </tfoot>
          </table>
        )}

        <div className="mb-6 mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 print:mb-0">
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-left text-sm font-semibold">{t("report.good_to_know")}</p>
            <p className="mt-2 text-sm text-gray-700">{t("report.note_fee")}</p>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <p className="text-left text-sm font-semibold">{t("report.notes")}</p>
            <div className="mt-3 space-y-2">
              {[0, 1, 2, 3].map((line) => (
                <div key={line} className="h-6 border-b border-gray-300" />
              ))}
            </div>
          </div>
        </div>


        <section className="messages-page">
          {pageHeader}
          <h2 className="text-2xl font-bold tracking-tight">{t("report.messages_title", { name: honoree })}</h2>
          <p className="mt-1 text-sm text-gray-600">
            {t("report.messages_sub", { count: messages.length, total: contributions.length })}
          </p>

          {messages.length === 0 ? (
            <p className="mt-6 text-sm text-gray-500">{t("report.no_messages")}</p>
          ) : (
            <ul className="mt-6">
              {messages.map((c) => {
                const name = c.contributor_name || t("report.anonymous");
                const avatarUrl = c.anonymous_avatar?.imageUrl;
                return (
                  <li key={c.id} className="border-b border-gray-200 py-4">
                    <div className="flex items-center gap-3">
                      {/* Same priority as the public gift wall: anonymous avatar, emoji, placeholder, initial */}
                      {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt="" className="h-10 w-10 flex-none rounded-full object-cover" />
                      ) : c.emoji ? (
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-100 text-xl">
                          {c.emoji}
                        </span>
                      ) : c.is_private ? (
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-purple-100 text-lg">
                          🎭
                        </span>
                      ) : (
                        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-gray-100 text-base font-semibold text-gray-600">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <p className="font-semibold">{name}</p>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap pl-[52px] text-sm text-gray-800">{c.message}</p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default function CampaignReportPage() {
  return (
    <AuthCheck requireAuth={true}>
      <CampaignReport />
    </AuthCheck>
  );
}
