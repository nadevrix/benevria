/**
 * Generación de embeddings y su preparación para el contrato.
 *
 * ## Qué corre dónde, y por qué
 *
 * El **embedding se calcula fuera de la cadena**: un modelo de embeddings pesa
 * cientos de megas y no cabe en un contrato. Eso es normal y esperado.
 *
 * Lo que sí ocurre on-chain es la **verificación**: el contrato compara el vector
 * contra el corpus y decide si el aporte es nuevo. Esa es la división correcta —
 * la IA produce el dato, el contrato lo juzga— y es la única parte que necesita
 * ser trustless, porque es la que decide si a alguien se le paga.
 *
 * ## Truncado a 64 dimensiones
 *
 * Los modelos sirven vectores de 768 o 1536 dimensiones. Comparar eso on-chain sería
 * absurdamente caro. Los modelos tipo Matryoshka concentran la señal semántica en las
 * primeras dimensiones, así que se trunca a 64 y se re-normaliza. 64 × int8 = 64 bytes
 * = exactamente dos palabras de storage.
 */

import { DIMS, ESCALA } from "./benevria";

/** Normaliza un vector a norma L2 = 1. */
function normalizar(v: number[]): number[] {
  const norma = Math.sqrt(v.reduce((a, x) => a + x * x, 0));
  if (norma === 0) return v.map(() => 0);
  return v.map(x => x / norma);
}

/**
 * Embedding local de respaldo, basado en hashing de n-gramas.
 *
 * ⚠️ **Limitación honesta:** esto captura similitud *léxica*, no semántica. Detecta
 * copias y reformulaciones cercanas, pero no que dos textos con vocabulario distinto
 * digan lo mismo. Existe para que el proyecto arranque y se pueda demostrar sin
 * depender de una API key. En producción se usa un modelo de embeddings real.
 */
export function embeddingLocal(texto: string): number[] {
  const v = new Array(DIMS).fill(0);
  const limpio = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

  const piezas: string[] = [];
  const palabras = limpio.split(" ").filter(Boolean);
  piezas.push(...palabras);
  // Bigramas de palabra: capturan algo de orden.
  for (let i = 0; i + 1 < palabras.length; i++) piezas.push(palabras[i] + "_" + palabras[i + 1]);
  // Trigramas de carácter: robustos a errores de tipeo y a flexiones.
  const sinEspacios = limpio.replace(/ /g, "_");
  for (let i = 0; i + 3 <= sinEspacios.length; i++) piezas.push(sinEspacios.slice(i, i + 3));

  for (const pieza of piezas) {
    // FNV-1a de 32 bits.
    let h = 0x811c9dc5;
    for (let i = 0; i < pieza.length; i++) {
      h ^= pieza.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    const bucket = h % DIMS;
    // Hashing con signo: reduce las colisiones sistemáticas.
    const signo = (h >>> 31) & 1 ? -1 : 1;
    v[bucket] += signo;
  }
  return normalizar(v);
}

/**
 * Pide un embedding real a un proveedor compatible con la API de OpenAI.
 * Devuelve `null` si no hay credenciales configuradas, para que el llamador caiga
 * al respaldo local.
 */
export async function embeddingRemoto(texto: string): Promise<number[] | null> {
  const apiKey = process.env.EMBEDDINGS_API_KEY ?? process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.EMBEDDINGS_BASE_URL ?? "https://api.openai.com/v1";
  const modelo = process.env.EMBEDDINGS_MODEL ?? "text-embedding-3-small";
  if (!apiKey) return null;

  try {
    const r = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      // `dimensions` pide el truncado Matryoshka directamente al proveedor cuando
      // el modelo lo soporta; si no, se trunca abajo.
      body: JSON.stringify({ input: texto, model: modelo, dimensions: DIMS }),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const vec: number[] | undefined = j?.data?.[0]?.embedding;
    if (!Array.isArray(vec)) return null;
    return normalizar(vec.slice(0, DIMS));
  } catch {
    return null;
  }
}

/** Obtiene el embedding: remoto si hay credenciales, local si no. */
export async function obtenerEmbedding(texto: string): Promise<{ vector: number[]; fuente: "remoto" | "local" }> {
  const remoto = await embeddingRemoto(texto);
  if (remoto && remoto.length === DIMS) return { vector: remoto, fuente: "remoto" };
  return { vector: embeddingLocal(texto), fuente: "local" };
}

/**
 * Cuantiza a int8 y empaqueta en dos palabras de 32 bytes, en el formato exacto
 * que espera `vector::desempaquetar` del contrato.
 */
export function empaquetarParaContrato(vector: number[]): { lo: `0x${string}`; hi: `0x${string}` } {
  const q = new Uint8Array(DIMS);
  for (let i = 0; i < DIMS; i++) {
    let x = Math.round((vector[i] ?? 0) * ESCALA);
    if (x > 127) x = 127;
    if (x < -127) x = -127; // -128 se evita: no tiene opuesto en int8
    q[i] = x < 0 ? x + 256 : x; // complemento a dos en un byte
  }
  const hex = (bytes: Uint8Array) =>
    ("0x" + Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("")) as `0x${string}`;
  return { lo: hex(q.slice(0, 32)), hi: hex(q.slice(32, 64)) };
}

/** Similitud coseno en basis points; réplica exacta de la fórmula del contrato. */
export function similitudBp(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < DIMS; i++) dot += (a[i] ?? 0) * (b[i] ?? 0);
  return Math.round(dot * 10000);
}
