/**
 * Server component reutilizable: renderiza un bloque JSON-LD.
 *
 * Seguridad (obligatorio para JSON-LD inline): se escapa el carácter "<" como la
 * secuencia \\u003c antes de inyectar el JSON. Esto neutraliza cualquier "</script>"
 * incrustado en los datos, que de otro modo rompería la etiqueta y permitiría XSS.
 * Es el patrón estándar.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
