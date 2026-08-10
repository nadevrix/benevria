"use client";

/**
 * Panel de demanda.
 *
 * Resuelve el problema número uno de cualquier plataforma de contribución: *"¿qué
 * aporto?"*. Aquí la comunidad publica lo que la IA no sabe hacer, y el que sabe viene
 * y se lo enseña. La contribución deja de ser spam a ver si cuela, y pasa a responder
 * una demanda concreta y verificable.
 */

import { useState } from "react";
import Link from "next/link";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { BENEVRIA_ABI, BENEVRIA_ADDRESS, explicarError } from "~~/lib/benevria";
import { contratoDesplegado, useEstadoBenevria, useTema } from "~~/lib/useBenevria";

function FilaTema({ id }: { id: number }) {
  const { data, refetch } = useTema(id);
  const { isConnected } = useAccount();
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess) void refetch();
  if (!data) return null;

  const [titulo, , votos, aportes] = data as unknown as [string, string, number, number];
  const cubierto = aportes > 0;

  return (
    <li className="flex items-start justify-between gap-4 rounded-xl border border-base-300 bg-base-100 p-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs opacity-50">#{id}</span>
          <span className="font-medium">{titulo}</span>
        </div>
        <div className="mt-1 flex gap-3 text-xs opacity-70">
          <span>{votos} {votos === 1 ? "persona lo pide" : "personas lo piden"}</span>
          <span className={cubierto ? "text-success" : "text-warning"}>
            {cubierto ? `${aportes} ${aportes === 1 ? "aporte" : "aportes"}` : "sin responder"}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          className="btn btn-xs btn-outline"
          disabled={!isConnected || isPending}
          onClick={() =>
            writeContract({ address: BENEVRIA_ADDRESS, abi: BENEVRIA_ABI, functionName: "votarTema", args: [id] })
          }
        >
          {isPending ? "…" : "También lo quiero"}
        </button>
        <Link href="/aportar" className="btn btn-xs btn-primary">
          Enseñarlo
        </Link>
      </div>
    </li>
  );
}

export default function Temas() {
  const estado = useEstadoBenevria();
  const { isConnected } = useAccount();
  const [titulo, setTitulo] = useState("");
  const { writeContract, data: txHash, isPending, error } = useWriteContract();
  const { isLoading: minando, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  if (isSuccess && titulo) setTitulo("");

  if (!contratoDesplegado) {
    return <div className="mx-auto max-w-2xl px-6 py-20 text-center opacity-70">Contrato no desplegado todavía.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Panel de temas</h1>
      <p className="mt-2 opacity-70">
        Lo que la comunidad necesita que la IA aprenda. Si sabes de alguno, enséñaselo y cobra por ello.
      </p>

      {/* Pedir un tema nuevo */}
      <div className="mt-6 rounded-2xl border border-base-300 bg-base-100 p-5">
        <label className="mb-2 block text-sm font-medium">¿Qué no sabe la IA?</label>
        <div className="flex flex-wrap gap-2">
          <input
            className="input input-bordered flex-1"
            placeholder="Ej.: Cómo se calcula el finiquito laboral en Bolivia"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <button
            className="btn btn-primary"
            disabled={!isConnected || isPending || minando || titulo.trim().length < 10}
            onClick={() =>
              writeContract({
                address: BENEVRIA_ADDRESS,
                abi: BENEVRIA_ABI,
                functionName: "pedirTema",
                args: [titulo.trim()],
              })
            }
          >
            {isPending || minando ? "Publicando…" : "Pedirlo"}
          </button>
        </div>
        {!isConnected && <p className="mt-2 text-sm text-warning">Conecta tu wallet para pedir un tema.</p>}
        {error && <p className="mt-2 text-sm text-error">{explicarError(error)}</p>}
      </div>

      {/* Lista */}
      <ul className="mt-6 space-y-3">
        {estado.totalTemas === 0 ? (
          <li className="rounded-xl border border-dashed border-base-300 p-8 text-center opacity-60">
            Todavía nadie pidió nada. Sé el primero.
          </li>
        ) : (
          Array.from({ length: estado.totalTemas }, (_, i) => <FilaTema key={i + 1} id={i + 1} />)
        )}
      </ul>
    </div>
  );
}
