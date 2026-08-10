/**
 * Prepara un aporte para el contrato.
 *
 * Esta ruta es la **capa barata** del filtrado, la que corre fuera de la cadena:
 * heurísticas deterministas que matan la basura evidente sin gastar una transacción.
 * Solo lo que sobrevive aquí llega al contrato, que hace la parte cara y la única que
 * necesita ser trustless: la comparación contra el corpus.
 *
 * El orden importa —de lo barato a lo caro— porque es como filtran los datasets de
 * verdad: heurísticas, luego deduplicación, luego modelos.
 */

import { NextRequest, NextResponse } from "next/server";
import { keccak256, toHex } from "viem";
import { empaquetarParaContrato, obtenerEmbedding } from "~~/lib/embedding";

export const runtime = "nodejs";

/** Longitud mínima para que un aporte pueda contener conocimiento real. */
const MIN_CARACTERES = 80;
const MAX_CARACTERES = 8000;

type Veredicto = { ok: true } | { ok: false; motivo: string };

/**
 * Heurísticas deterministas. No usan IA a propósito: son un `if`, cuestan nada y
 * eliminan la mayor parte del ruido.
 */
function heuristicas(texto: string): Veredicto {
  const t = texto.trim();

  if (t.length < MIN_CARACTERES) {
    return { ok: false, motivo: `Muy corto: ${t.length} caracteres, se necesitan al menos ${MIN_CARACTERES}.` };
  }
  if (t.length > MAX_CARACTERES) {
    return { ok: false, motivo: `Muy largo: máximo ${MAX_CARACTERES} caracteres.` };
  }

  const palabras = t.split(/\s+/).filter(Boolean);
  if (palabras.length < 15) {
    return { ok: false, motivo: "Muy pocas palabras para aportar conocimiento útil." };
  }

  // Ratio de repetición: texto generado al azar o copiado en bucle.
  const unicas = new Set(palabras.map(p => p.toLowerCase()));
  const ratioUnicas = unicas.size / palabras.length;
  if (ratioUnicas < 0.35) {
    return { ok: false, motivo: "Demasiada repetición: el texto repite las mismas palabras." };
  }

  // Proporción de símbolos frente a letras: mata el garabato.
  const letras = (t.match(/\p{L}/gu) ?? []).length;
  if (letras / t.length < 0.55) {
    return { ok: false, motivo: "Demasiados símbolos frente a letras. ¿Es texto real?" };
  }

  // Secuencias absurdas de un mismo carácter.
  if (/(.)\1{9,}/.test(t)) {
    return { ok: false, motivo: "Contiene secuencias repetidas de un mismo carácter." };
  }

  return { ok: true };
}

/**
 * Filtrado básico de datos personales antes de que nada salga de la máquina.
 *
 * ⚠️ **No es infalible y no se promete que lo sea.** Ningún filtro de PII lo es, y
 * prometerlo sería exposición legal gratuita. Es un mejor esfuerzo, y se registra qué
 * se filtró.
 */
function limpiarDatosSensibles(texto: string): { limpio: string; removidos: string[] } {
  const removidos: string[] = [];
  let limpio = texto;

  const reglas: Array<[RegExp, string, string]> = [
    [/[\w.+-]+@[\w-]+\.[\w.]+/g, "[correo]", "correos"],
    [/\b(?:\+?\d{1,3}[ -]?)?(?:\d[ -]?){7,12}\d\b/g, "[teléfono]", "teléfonos"],
    [/\b(?:\d[ -]?){13,19}\b/g, "[tarjeta]", "tarjetas"],
    [/\b0x[a-fA-F0-9]{40}\b/g, "[dirección]", "direcciones de wallet"],
    [/\b0x[a-fA-F0-9]{64}\b/g, "[clave]", "claves privadas"],
    [/\b(?:sk|pk|api[_-]?key)[-_][A-Za-z0-9]{16,}\b/gi, "[credencial]", "credenciales"],
  ];

  for (const [re, reemplazo, etiqueta] of reglas) {
    if (re.test(limpio)) {
      removidos.push(etiqueta);
      limpio = limpio.replace(re, reemplazo);
    }
  }
  return { limpio, removidos };
}

export async function POST(req: NextRequest) {
  let texto: string;
  try {
    const body = await req.json();
    texto = String(body?.texto ?? "");
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const veredicto = heuristicas(texto);
  if (!veredicto.ok) {
    return NextResponse.json({ error: veredicto.motivo, capa: "heuristicas" }, { status: 422 });
  }

  const { limpio, removidos } = limpiarDatosSensibles(texto);
  const { vector, fuente } = await obtenerEmbedding(limpio);
  const { lo, hi } = empaquetarParaContrato(vector);

  // El hash ancla el contenido exacto: el contrato lo usa como filtro barato antes
  // de gastar el cálculo vectorial.
  const hash = keccak256(toHex(limpio));

  return NextResponse.json({
    lo,
    hi,
    hash,
    fuenteEmbedding: fuente,
    datosSensiblesRemovidos: removidos,
    textoLimpio: limpio,
    aviso:
      fuente === "local"
        ? "Embedding local (léxico). Configura EMBEDDINGS_API_KEY para similitud semántica real."
        : undefined,
  });
}
