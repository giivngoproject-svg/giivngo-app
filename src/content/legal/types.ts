import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

// Bloque de contenido de un documento legal.
// - "p": párrafo. `lead` (opcional) es un fragmento en negrita al inicio
//        (p. ej. el número de cláusula "3.1." o un rótulo "Age of Majority.").
// - "ul": lista con viñetas.
export type LegalBlock =
  | { k: "p"; text: string; lead?: string }
  | { k: "ul"; items: string[] };

// Sección o subsección. `n` sin punto => encabezado de nivel 2 ("3");
// con punto => subsección de nivel 3 ("2.1").
export type LegalSection = {
  n: string;
  title: string;
  body?: LegalBlock[];
};

export type LegalDoc = {
  title: string; // H1 y <title> (el root añade el sufijo "· giivngo")
  description: string; // meta description
  updated: string; // fecha ISO (YYYY-MM-DD)
  lead?: LegalBlock[]; // párrafos introductorios antes de la sección 1
  sections: LegalSection[];
};

// Un documento en los tres locales públicos del sitio.
export type LegalDocSet = Record<Locale, LegalDoc>;
