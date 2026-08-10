"use client";

/**
 * Panel de BenevrIA — el estado del organismo colectivo.
 *
 * Las dos cifras que mandan y que nadie puede falsear:
 *   · el nivel del modelo, que la comunidad se ganó enseñando
 *   · la cuota gratis de todos, que depende de lo que la tesorería puede pagar
 */

import Link from "next/link";
import { formatEther } from "viem";
import { BENEVRIA_ADDRESS, NOMBRES_NIVEL } from "~~/lib/benevria";
import { contratoDesplegado, useEstadoBenevria } from "~~/lib/useBenevria";

function Metrica({
  titulo,
  valor,
  detalle,
  acento,
}: {
  titulo: string;
  valor: string;
  detalle?: string;
  acento?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${acento ? "border-primary/60 bg-primary/5" : "border-base-300 bg-base-100"}`}>
      <div className="text-xs uppercase tracking-wide opacity-60">{titulo}</div>
      <div className={`mt-1 text-3xl font-bold ${acento ? "text-primary" : ""}`}>{valor}</div>
      {detalle && <div className="mt-1 text-sm opacity-70">{detalle}</div>}
    </div>
  );
}

export default function Panel() {
  const e = useEstadoBenevria();

  if (!contratoDesplegado) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">BenevrIA</h1>
        <p className="mt-3 opacity-70">
          El contrato todavía no está desplegado. Corre <code className="rounded bg-base-300 px-1">yarn deploy</code> y
          define <code className="rounded bg-base-300 px-1">NEXT_PUBLIC_BENEVRIA_ADDRESS</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">BenevrIA</h1>
        <p className="mt-2 max-w-2xl opacity-70">
          Una IA que la comunidad enseña y sostiene, concebida como <strong>bien común</strong>. El nivel del
          modelo lo decide un contrato, no nosotros.
        </p>
      </header>

      {/* --- El nivel: la cifra central --- */}
      <section className="mb-8 rounded-2xl border border-base-300 bg-base-100 p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-60">Nivel del modelo colectivo</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-5xl font-black text-primary">{e.nombreNivel}</span>
              <span className="text-lg opacity-70">{e.modelo.nombre}</span>
            </div>
            <div className="mt-1 text-sm opacity-60">{e.modelo.nota}</div>
          </div>
          <Link href="/chat" className="btn btn-primary">
            Usar la IA gratis →
          </Link>
        </div>

        {/* Barra de progreso hacia el siguiente nivel */}
        <div className="mt-6">
          <div className="mb-1 flex justify-between text-sm">
            <span className="opacity-70">Progreso hacia {NOMBRES_NIVEL[Math.min(3, e.porConocimiento + 1)]}</span>
            <span className="font-mono">
              {e.puntaje.toString()} pts {e.falta > 0n && <span className="opacity-60">· faltan {e.falta.toString()}</span>}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-base-300">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${e.progreso}%` }}
            />
          </div>
        </div>

        {/* Qué está frenando el nivel — la mecánica explicada sola */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-xl border p-4 ${e.frenadoPor === "conocimiento" ? "border-warning bg-warning/10" : "border-base-300"}`}
          >
            <div className="text-sm font-semibold">Por conocimiento: {NOMBRES_NIVEL[e.porConocimiento]}</div>
            <div className="mt-1 text-xs opacity-70">Lo que la comunidad se ganó enseñando.</div>
          </div>
          <div
            className={`rounded-xl border p-4 ${e.frenadoPor === "tesoreria" ? "border-error bg-error/10" : "border-base-300"}`}
          >
            <div className="text-sm font-semibold">Por tesorería: {NOMBRES_NIVEL[e.porTesoreria]}</div>
            <div className="mt-1 text-xs opacity-70">Lo que hay con qué pagar de inferencia.</div>
          </div>
        </div>

        {e.frenadoPor === "tesoreria" && (
          <div className="mt-4 rounded-xl border border-error/40 bg-error/5 p-4 text-sm">
            La comunidad se ganó el nivel <strong>{NOMBRES_NIVEL[e.porConocimiento]}</strong>, pero la tesorería solo
            sostiene <strong>{NOMBRES_NIVEL[e.porTesoreria]}</strong>. El nivel sube por conocimiento y baja por falta de
            fondos — y las dos cosas se pueden verificar aquí mismo.
          </div>
        )}
      </section>

      {/* --- Métricas --- */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metrica titulo="Corpus verificado" valor={e.corpus.toString()} detalle="aportes únicos on-chain" acento />
        <Metrica titulo="Puntaje colectivo" valor={e.puntaje.toString()} detalle="novedad acumulada" />
        <Metrica
          titulo="Tesorería"
          valor={`${Number(formatEther(e.presupuesto)).toFixed(4)}`}
          detalle="ETH para inferencia"
        />
        <Metrica titulo="Gastado" valor={`${Number(formatEther(e.gastado)).toFixed(4)}`} detalle="ETH ya consumidos" />
      </section>

      {/* --- Acciones --- */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link href="/aportar" className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary">
          <div className="text-lg font-semibold">Enseñar algo</div>
          <p className="mt-1 text-sm opacity-70">
            Aporta conocimiento. El contrato verifica que sea nuevo y te emite puntos.
          </p>
        </Link>
        <Link href="/temas" className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary">
          <div className="text-lg font-semibold">Panel de temas</div>
          <p className="mt-1 text-sm opacity-70">
            {e.totalTemas} {e.totalTemas === 1 ? "tema pedido" : "temas pedidos"} por la comunidad.
          </p>
        </Link>
        <Link href="/chat" className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary">
          <div className="text-lg font-semibold">Preguntar</div>
          <p className="mt-1 text-sm opacity-70">Gratis para todos, al nivel que la comunidad ganó.</p>
        </Link>
      </section>

      {/* --- Prueba de que todo esto es verificable --- */}
      <section className="rounded-2xl border border-base-300 bg-base-200/50 p-5 text-sm">
        <div className="mb-2 font-semibold">Todo esto se lee de la cadena</div>
        <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
          <div className="flex justify-between gap-4">
            <dt className="opacity-60">Época actual</dt>
            <dd className="font-mono">{e.epoca.toString()}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="opacity-60">Bloque L2 (ArbSys)</dt>
            <dd className="font-mono">{e.bloqueL2.toString()}</dd>
          </div>
          <div className="col-span-full flex justify-between gap-4">
            <dt className="opacity-60">Contrato</dt>
            <dd>
              <a
                className="link font-mono text-xs"
                href={`https://sepolia.arbiscan.io/address/${BENEVRIA_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
              >
                {BENEVRIA_ADDRESS}
              </a>
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs opacity-60">
          El bloque se pide al precompilado <strong>ArbSys (0x64)</strong>, no a <code>block.number</code>: en Arbitrum
          ese devuelve el bloque de L1.
        </p>
      </section>
    </div>
  );
}
