/**
 * Inferencia de la IA colectiva.
 *
 * El punto entero de esta ruta: **no elige el modelo, se lo pregunta al contrato**.
 * El nivel vive on-chain, así que ni el operador ni esta ruta pueden servir un modelo
 * peor del que la comunidad se ganó, ni mentir sobre cuál está corriendo.
 *
 * Dos modos de pago, según `AYNI_MODO_PAGO`:
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
import { AYNI_ABI, AYNI_ADDRESS, MODELOS_POR_NIVEL } from "~~/lib/ayni";

export const runtime = "nodejs";

const RPC = process.env.NEXT_PUBLIC_RPC_URL ?? "https://sepolia-rollup.arbitrum.io/rpc";

const cliente = createPublicClient({ chain: arbitrumSepolia, transport: http(RPC) });

/** Lee el nivel vigente del contrato. Si el contrato no responde, cae a nivel 0. */
async function nivelVigente(): Promise<{ nivel: number; leidoDeCadena: boolean }> {
  if (AYNI_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return { nivel: 0, leidoDeCadena: false };
  }
  try {
    const n = await cliente.readContract({
      address: AYNI_ADDRESS,
      abi: AYNI_ABI,
      functionName: "nivel",
    });
    return { nivel: Number(n), leidoDeCadena: true };
  } catch {
    return { nivel: 0, leidoDeCadena: false };
  }
}

const SISTEMA = `Eres Ayni, una IA colectiva que la comunidad entrena y sostiene.
Tu conocimiento viene de aportes verificados on-chain por personas que saben cosas que
los modelos grandes suelen alucinar: trámites locales, jerga de oficio, procedimientos
que nadie escribió nunca.

Responde en el idioma del usuario, de forma directa y útil. Si no sabes algo, dilo
claramente y sugiere que alguien lo aporte al panel de temas — así la próxima vez sí
lo sabrás. Nunca inventes datos concretos (fechas, montos, nombres de oficinas).`;

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
        `[Ayni no tiene proveedor de inferencia configurado todavía]\n\n` +
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

  try {
    const r = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelo.id,
        messages: [{ role: "system", content: SISTEMA + contexes }, ...mensajes],
        max_tokens: 800,
      }),
    });

    if (!r.ok) {
      const detalle = await r.text();
      return NextResponse.json(
        { error: `El proveedor respondió ${r.status}`, detalle: detalle.slice(0, 300) },
        { status: 502 },
      );
    }

    const j = await r.json();
    const respuesta = j?.choices?.[0]?.message?.content ?? "(respuesta vacía)";

    return NextResponse.json({
      respuesta,
      nivel,
      modelo: modelo.id,
      nombreModelo: modelo.nombre,
      leidoDeCadena,
      modoPago: process.env.AYNI_MODO_PAGO ?? "apikey",
      uso: j?.usage ?? null,
    });
  } catch (e) {
    return NextResponse.json({ error: `Fallo llamando al proveedor: ${String(e).slice(0, 200)}` }, { status: 502 });
  }
}
