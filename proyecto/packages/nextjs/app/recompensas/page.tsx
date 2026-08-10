"use client";

/**
 * Recompensas — donde el aportante cobra.
 *
 * Es el cierre del circuito y el momento que prueba la tesis: el reparto no lo
 * decide un operador, lo calcula el contrato con una fórmula pública
 * (`pozo × puntos_propios / puntos_totales`) que cualquiera puede reproducir desde
 * los datos de la cadena.
 *
 * Por eso la página no muestra solo un botón: muestra **el cálculo entero**, con
 * cada número enlazado a su origen on-chain.
 */

import { useState } from "react";
import Link from "next/link";
import { formatEther } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { RequiereWallet } from "~~/components/RequiereWallet";
import { BENEVRIA_ABI, BENEVRIA_ADDRESS, explicarError } from "~~/lib/benevria";
import { contratoDesplegado, useEstadoBenevria, useMisPuntos } from "~~/lib/useBenevria";

function FilaEpoca({ epoca, esActual }: { epoca: bigint; esActual: boolean }) {
  const { puntos, totales, pozo, reclamable, refetch } = useMisPuntos(epoca);
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: minando, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess) void refetch();

  // Sin participación en esta época no hay nada que mostrar.
  if (puntos === 0n) return null;

  const porcentaje = totales > 0n ? (Number(puntos) / Number(totales)) * 100 : 0;
  const yaCobrado = reclamable === 0n && !esActual;

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide opacity-60">
            Época {epoca.toString()} {esActual && <span className="text-warning">· en curso</span>}
          </div>
          <div className="mt-1 text-2xl font-bold">
            {puntos.toString()} <span className="text-base font-normal opacity-70">puntos tuyos</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide opacity-60">Te corresponde</div>
          <div className="text-2xl font-bold text-primary">{Number(formatEther(reclamable)).toFixed(6)} ETH</div>
        </div>
      </div>

      {/* El cálculo, a la vista */}
      <div className="mt-4 rounded-xl bg-base-200/60 p-4 font-mono text-xs">
        <div className="mb-2 font-sans text-xs font-semibold opacity-70">Cómo sale ese número</div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="opacity-60">pozo</span>
          <span>{Number(formatEther(pozo)).toFixed(6)}</span>
          <span className="opacity-60">×</span>
          <span>
            {puntos.toString()} / {totales.toString()}
          </span>
          <span className="opacity-60">=</span>
          <span className="text-primary">{Number(formatEther(reclamable)).toFixed(6)} ETH</span>
        </div>
        <div className="mt-2 font-sans opacity-60">
          Aportaste el {porcentaje.toFixed(1)}% de la novedad verificada de esta época.
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {esActual ? (
          <div className="text-sm opacity-70">
            La época sigue abierta. Se puede reclamar cuando cierre — así el reparto se calcula sobre el total final,
            no sobre una foto parcial.
          </div>
        ) : yaCobrado ? (
          <div className="text-sm text-success">✅ Ya reclamado</div>
        ) : (
          <button
            className="btn btn-primary"
            disabled={isPending || minando || reclamable === 0n}
            onClick={() =>
              writeContract({
                address: BENEVRIA_ADDRESS,
                abi: BENEVRIA_ABI,
                functionName: "reclamar",
                args: [epoca],
              })
            }
          >
            {isPending ? "Confirma en la wallet…" : minando ? "Cobrando…" : "Reclamar mi parte"}
          </button>
        )}
        {txHash && (
          <a
            className="link text-xs"
            href={`https://sepolia.arbiscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
          >
            Ver en Arbiscan →
          </a>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-error">{explicarError(error)}</p>}
      {isSuccess && (
        <p className="mt-2 text-sm text-success">
          Cobrado. El contrato transfirió el monto directo a tu billetera — sin que nadie lo apruebe.
        </p>
      )}
    </div>
  );
}

export default function Recompensas() {
  const estado = useEstadoBenevria();
  const [verTodas, setVerTodas] = useState(false);

  if (!contratoDesplegado) {
    return <div className="mx-auto max-w-2xl px-6 py-20 text-center opacity-70">Contrato no desplegado todavía.</div>;
  }

  const actual = estado.epoca;
  // Se revisan las últimas épocas: las anteriores rara vez tienen saldo pendiente.
  const cuantas = verTodas ? 12 : 4;
  const epocas: bigint[] = [];
  for (let i = 0; i < cuantas; i++) {
    const e = actual - BigInt(i);
    if (e < 0n) break;
    epocas.push(e);
  }

  return (
    <RequiereWallet
      titulo="Conecta tu wallet para cobrar"
      motivo="Lo que te corresponde está guardado en la cadena a nombre de tu dirección. Nadie puede reclamarlo por ti, y nadie tiene que aprobártelo."
    >
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Tus recompensas</h1>
      <p className="mt-2 opacity-70">
        Lo que te corresponde por el conocimiento que aportaste. El reparto es proporcional a la novedad verificada, y la
        fórmula es la misma para todos.
      </p>

      <div className="mt-6 space-y-4">
        {epocas.map(e => (
          <FilaEpoca key={e.toString()} epoca={e} esActual={e === actual} />
        ))}
      </div>

      {/* Si ninguna fila se renderizó, esta dirección no ha aportado nunca */}
      <div className="mt-6 rounded-2xl border border-dashed border-base-300 p-8 text-center">
        <p className="opacity-70">¿No ves nada arriba? Es porque todavía no has aportado conocimiento verificado.</p>
        <Link href="/aportar" className="btn btn-primary btn-sm mt-3">
          Enseñar algo →
        </Link>
      </div>

      {!verTodas && (
        <button className="btn btn-ghost btn-sm mt-4" onClick={() => setVerTodas(true)}>
          Ver épocas más antiguas
        </button>
      )}

      <div className="mt-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 text-sm">
        <div className="mb-2 font-semibold">Por qué esto es distinto de un pago normal</div>
        <p className="opacity-75">
          No hay una lista de beneficiarios que alguien mantenga, ni un criterio discrecional, ni un botón de aprobación.
          El contrato guarda cuánta novedad aportó cada dirección, y el reparto es esa proporción exacta sobre el dinero
          que realmente entró. Cualquiera puede recalcularlo con los datos públicos de la cadena y comprobar que le
          tocaba lo que recibió.
        </p>
      </div>
    </div>
    </RequiereWallet>
  );
}
