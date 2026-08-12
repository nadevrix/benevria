"use client";

/**
 * Renderizador mínimo de Markdown para las respuestas del chat.
 *
 * Los modelos devuelven Markdown por defecto. Mostrarlo en crudo deja `**negritas**`
 * y `###` a la vista, que se lee como si la aplicación estuviera rota.
 *
 * Es deliberadamente pequeño: cubre lo que los modelos usan de verdad en una respuesta
 * de chat —encabezados, negritas, cursivas, código, listas y separadores— sin arrastrar
 * una dependencia entera. No interpreta HTML embebido, así que no hay riesgo de
 * inyección desde la respuesta del modelo.
 */

import { ReactNode } from "react";

/** Aplica negritas, cursivas y código dentro de una línea. */
function conFormatoInterno(texto: string, clave: string): ReactNode[] {
  const partes: ReactNode[] = [];
  // Se procesan por orden de precedencia: código, negrita, cursiva.
  const patron = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  const trozos = texto.split(patron).filter(Boolean);

  trozos.forEach((t, i) => {
    const k = `${clave}-${i}`;
    if (t.startsWith("`") && t.endsWith("`")) {
      partes.push(
        <code key={k} className="rounded bg-base-300/70 px-1 py-0.5 text-[0.9em]">
          {t.slice(1, -1)}
        </code>,
      );
    } else if (t.startsWith("**") && t.endsWith("**")) {
      partes.push(
        <strong key={k} className="font-semibold">
          {t.slice(2, -2)}
        </strong>,
      );
    } else if ((t.startsWith("*") && t.endsWith("*")) || (t.startsWith("_") && t.endsWith("_"))) {
      partes.push(<em key={k}>{t.slice(1, -1)}</em>);
    } else {
      partes.push(<span key={k}>{t}</span>);
    }
  });
  return partes;
}

export function Markdown({ texto }: { texto: string }) {
  const lineas = texto.split("\n");
  const bloques: ReactNode[] = [];
  let listaAbierta: string[] = [];

  const cerrarLista = (i: number) => {
    if (listaAbierta.length === 0) return;
    bloques.push(
      <ul key={`ul-${i}`} className="my-2 ml-4 list-disc space-y-1">
        {listaAbierta.map((li, j) => (
          <li key={j}>{conFormatoInterno(li, `li-${i}-${j}`)}</li>
        ))}
      </ul>,
    );
    listaAbierta = [];
  };

  lineas.forEach((linea, i) => {
    const l = linea.trimEnd();

    // Lista con viñetas
    const conVinieta = l.match(/^\s*[-*+]\s+(.*)$/);
    if (conVinieta) {
      listaAbierta.push(conVinieta[1]);
      return;
    }
    cerrarLista(i);

    if (!l.trim()) return; // líneas en blanco: el espaciado lo dan los márgenes

    // Separador horizontal
    if (/^\s*(---+|___+|\*\*\*+)\s*$/.test(l)) {
      bloques.push(<hr key={i} className="my-3 border-base-300" />);
      return;
    }

    // Encabezados
    const enc = l.match(/^(#{1,6})\s+(.*)$/);
    if (enc) {
      const nivel = enc[1].length;
      const clases = nivel <= 2 ? "mt-3 mb-1 text-base font-bold" : "mt-2 mb-1 text-sm font-semibold";
      bloques.push(
        <p key={i} className={clases}>
          {conFormatoInterno(enc[2], `h-${i}`)}
        </p>,
      );
      return;
    }

    bloques.push(
      <p key={i} className="my-1">
        {conFormatoInterno(l, `p-${i}`)}
      </p>,
    );
  });
  cerrarLista(lineas.length);

  return <div className="text-sm leading-relaxed">{bloques}</div>;
}
