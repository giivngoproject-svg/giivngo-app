import type { LegalBlock, LegalDoc } from "@/content/legal/types";
import { getMarket, LOCALE_TO_DICT, type Dict, type Locale } from "@/i18n/markets";

// Server component: renderiza un documento legal ya localizado. No lleva 'use client'
// (es contenido estático), así que el HTML traducido queda en el render del servidor.

// Los rótulos van por IDIOMA (dict): los tres mercados ingleses comparten los suyos.
const UPDATED_LABEL: Record<Dict, string> = {
  en: "Last updated",
  es: "Última actualización",
  "pt-br": "Última atualização",
};

// Nota de prevalencia para las versiones traducidas: el inglés es el texto rector.
const PREVAILS_NOTE: Record<Dict, string | null> = {
  en: null,
  es: "Esta es una traducción de referencia. En caso de discrepancia, prevalece la versión en inglés.",
  "pt-br":
    "Esta é uma tradução de referência. Em caso de divergência, prevalece a versão em inglês.",
};

function formatDate(iso: string, locale: string) {
  const d = new Date(`${iso}T00:00:00`);
  // La fecha SÍ se formatea por mercado (en-US "July 4, 2026" vs en-AU "4 July 2026").
  return new Intl.DateTimeFormat(getMarket(locale).hreflang, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

function Block({ block }: { block: LegalBlock }) {
  if (block.k === "ul") {
    return (
      <ul className="my-4 list-disc space-y-2 pl-6 text-foreground/80">
        {block.items.map((item, i) => (
          <li key={i} className="leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p className="my-4 leading-relaxed text-foreground/80">
      {block.lead && <strong className="font-semibold text-foreground">{block.lead} </strong>}
      {block.text}
    </p>
  );
}

export function LegalPage({ doc, locale }: { doc: LegalDoc; locale: string }) {
  const dict = LOCALE_TO_DICT[locale as Locale] ?? "en";
  const prevails = PREVAILS_NOTE[dict];

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="mb-10 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>
        <p className="mt-3 text-sm text-muted">
          {UPDATED_LABEL[dict]}: {formatDate(doc.updated, locale)}
        </p>
        {prevails && <p className="mt-2 text-sm italic text-muted">{prevails}</p>}
      </header>

      {doc.lead?.map((block, i) => (
        <Block key={`lead-${i}`} block={block} />
      ))}

      {doc.sections.map((section) => {
        const isSub = section.n.includes(".");
        const heading = `${section.n}. ${section.title}`;
        return (
          <section key={section.n} className={isSub ? "mt-6" : "mt-10"}>
            {isSub ? (
              <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
            ) : (
              <h2 className="text-xl font-bold text-foreground sm:text-2xl">{heading}</h2>
            )}
            {section.body?.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </section>
        );
      })}
    </article>
  );
}
