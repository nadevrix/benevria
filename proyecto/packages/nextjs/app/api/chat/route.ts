/**
 * Inferencia de la IA colectiva.
 *
 * El punto entero de esta ruta: **no elige el modelo, se lo pregunta al contrato**.
 * El nivel vive on-chain, así que ni el operador ni esta ruta pueden servir un modelo
 * peor del que la comunidad se ganó, ni mentir sobre cuál está corriendo.
 *
 * Dos modos de pago, según `BENEVRIA_MODO_PAGO`:
 *
 * - `apikey` — API key tradicional. Funciona hoy. Implica que hay un humano con una
 *   tarjeta detrás: el circuito **no** es totalmente trustless en su último tramo.
 * - `x402`   — pago por request en USDC desde la tesorería. Cierra el circuito. El
 *   facilitador de PayAI soporta `arbitrum-sepolia` (verificado).
 *
 * Esta honestidad sobre el límite es deliberada: se declara en la respuesta y en el
 * pitch, en vez de fingir una autonomía que todavía no existe.
 */

import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { BENEVRIA_ABI, BENEVRIA_ADDRESS, MODELOS_POR_NIVEL } from "~~/lib/benevria";

export const runtime = "nodejs";

const RPC = process.env.NEXT_PUBLIC_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc";

const cliente = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

/** Lee el nivel vigente del contrato. Si el contrato no responde, cae a nivel 0. */
async function nivelVigente(): Promise<{ nivel: number; leidoDeCadena: boolean }> {
  if (BENEVRIA_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return { nivel: 0, leidoDeCadena: false };
  }
  try {
    const n = await cliente.readContract({
      address: BENEVRIA_ADDRESS,
      abi: BENEVRIA_ABI,
      functionName: "nivel",
    });
    return { nivel: Number(n), leidoDeCadena: true };
  } catch {
    return { nivel: 0, leidoDeCadena: false };
  }
}

/** Tiempo máximo por modelo antes de pasar al respaldo. */
const TIEMPO_LIMITE_MS = 25_000;

/**
 * Tope de tokens por respuesta.
 *
 * Los modelos pequeños se enrollan: con 800 tokens tardaban más de un minuto en
 * generar respuestas larguísimas. Un tope bajo las mantiene legibles y rápidas, que
 * es lo que necesita una demostración.
 */
const MAX_TOKENS = 450;

const SISTEMA = `Eres BenevrIA, una IA colectiva que la comunidad entrena y sostiene.
Tu conocimiento viene de aportes verificados on-chain por personas que saben cosas que
los modelos grandes suelen alucinar: trámites locales, jerga de oficio, procedimientos
que nadie escribió nunca.

Responde en el idioma del usuario, de forma directa y útil.

**Sé breve: 150 palabras como máximo, salvo que te pidan más detalle.** Nada de
introducciones ni de repetir la pregunta.

Si no sabes algo, dilo claramente y sugiere que alguien lo aporte al panel de temas —
así la próxima vez sí lo sabrás. Nunca inventes datos concretos: fechas, montos,
números de ley o nombres de oficinas. Es preferible decir "no lo sé con certeza".`;

export async function POST(req: NextRequest) {
  let mensajes: Array<{ role: string; content: string }>;
  let contexto: string[] = [];
  try {
    const body = await req.json();
    mensajes = Array.isArray(body?.mensajes) ? body.mensajes : [];
    contexto = Array.isArray(body?.contexto) ? body.contexto : [];
  } catch {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }
  if (mensajes.length === 0) {
    return NextResponse.json({ error: "Sin mensajes" }, { status: 400 });
  }

  const { nivel, leidoDeCadena } = await nivelVigente();
  const modelo = MODELOS_POR_NIVEL[nivel] ?? MODELOS_POR_NIVEL[0];

  const apiKey = process.env.OPENROUTER_API_KEY;
  const baseUrl = process.env.INFERENCIA_BASE_URL ?? "https://openrouter.ai/api/v1";

  // Sin credenciales configuradas: se responde con una explicación honesta en vez de
  // simular una respuesta del modelo.
  if (!apiKey) {
    return NextResponse.json({
      respuesta:
        `[BenevrIA no tiene proveedor de inferencia configurado todavía]\n\n` +
        `El contrato dice que el nivel colectivo es ${nivel} → modelo "${modelo.nombre}".\n` +
        `Esa parte funciona: el nivel se leyó ${leidoDeCadena ? "de la cadena" : "por defecto (contrato sin desplegar)"}.\n\n` +
        `Para activar las respuestas, configura OPENROUTER_API_KEY en .env.local.`,
      nivel,
      modelo: modelo.id,
      nombreModelo: modelo.nombre,
      leidoDeCadena,
      sinProveedor: true,
    });
  }

  const contexes = contexto.length
    ? `\n\nConocimiento aportado por la comunidad y relevante a esta pregunta:\n${contexto.map((c, i) => `[${i + 1}] ${c}`).join("\n")}`
    : "";

  // Cadena de intentos: modelo del nivel, y si falla, sus respaldos.
  //
  // Los modelos de nivel gratuito devuelven 429 cuando el proveedor está saturado, y
  // algunos responden con contenido vacío. Sin esta cadena, el chat se cae en medio
  // de una demostración en vivo. Se registra qué modelo respondió de verdad para no
  // afirmar en la interfaz algo distinto de lo que ocurrió.
  const cadena = [modelo.id, ...modelo.respaldos];
  const fallos: string[] = [];

  for (const idModelo of cadena) {
    // Tiempo límite por intento. Sin esto, un modelo lento o colgado deja la
    // interfaz en "Pensando…" indefinidamente y tumba una demostración en vivo:
    // más vale pasar al siguiente respaldo que esperar sin fin.
    const corte = AbortSignal.timeout(TIEMPO_LIMITE_MS);

    try {
      const r = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        signal: corte,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: idModelo,
          messages: [{ role: "system", content: SISTEMA + contexes }, ...mensajes],
          max_tokens: MAX_TOKENS,
        }),
      });

      if (!r.ok) {
        fallos.push(`${idModelo}: HTTP ${r.status}`);
        continue;
      }

      const j = await r.json();
      const contenido: string | null | undefined = j?.choices?.[0]?.message?.content;

      // Contenido vacío cuenta como fallo: hay modelos gratuitos que responden 200
      // con `content: null`.
      if (!contenido || !contenido.trim()) {
        fallos.push(`${idModelo}: respuesta vacía`);
        continue;
      }

      return NextResponse.json({
        respuesta: limpiarRazonamiento(contenido),
        nivel,
        modelo: idModelo,
        nombreModelo: modelo.nombre,
        // Si respondió un respaldo, se dice: la interfaz no debe afirmar que corrió
        // el modelo del nivel cuando no fue así.
        usoRespaldo: idModelo !== modelo.id,
        leidoDeCadena,
        modoPago: process.env.BENEVRIA_MODO_PAGO ?? "apikey",
        uso: j?.usage ?? null,
      });
    } catch (e) {
      fallos.push(`${idModelo}: ${String(e).slice(0, 80)}`);
    }
  }

  return NextResponse.json(
    {
      error: "Ningún modelo del nivel respondió. Los modelos de nivel gratuito se saturan a ratos; reintenta.",
      intentos: fallos,
    },
    { status: 502 },
  );
}

/**
 * Quita el razonamiento interno que algunos modelos filtran en la salida.
 *
 * Varios modelos de razonamiento anteponen su cadena de pensamiento
 * ("Okay, the user asked…") antes de la respuesta. Se recortan las etiquetas
 * conocidas y los preámbulos más comunes.
 */
function limpiarRazonamiento(texto: string): string {
  let t = texto;
  t = t.replace(/<think>[\s\S]*?<\/think>/gi, "");
  t = t.replace(/^\s*(Okay|Alright|Hmm|Let me|First,|Here's a thinking process)[\s\S]*?\n\n/i, "");
  return t.trim() || texto.trim();
}
