"use client";

/**
 * Enseñar a la IA.
 *
 * Es el flujo central del proyecto y muestra la división que lo sostiene:
 *
 *   1. Fuera de la cadena (barato): heurísticas, limpieza de datos personales, embedding.
 *   2. Dentro de la cadena (caro, pero necesario): la comparación contra el corpus que
 *      decide si el aporte es nuevo — y por tanto si se cobra.
 *
 * El paso 2 no puede vivir en un servidor: es justo la decisión en la que el operador
 * tendría incentivo a mentir.
 */

import { useState } from "react";
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { RequiereWallet } from "~~/components/RequiereWallet";
import { BENEVRIA_ABI, BENEVRIA_ADDRESS, explicarError } from "~~/lib/benevria";
import { contratoDesplegado, useEstadoBenevria } from "~~/lib/useBenevria";

type Preparado = {
  lo: `0x${string}`;
  hi: `0x${string}`;
  hash: `0x${string}`;
  fuenteEmbedding: string;
  datosSensiblesRemovidos: string[];
  aviso?: string;
};

export default function Aportar() {
  const { isConnected } = useAccount();
  const estado = useEstadoBenevria();

  const [texto, setTexto] = useState("");
  const [tema, setTema] = useState(0);
  const [preparado, setPreparado] = useState<Preparado | null>(null);
  const [errorPrep, setErrorPrep] = useState<string | null>(null);
  const [preparando, setPreparando] = useState(false);

  const { writeContract, data: txHash, isPending, error: errorTx, reset } = useWriteContract();
  const { isLoading: minando, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  async function preparar() {
    setPreparando(true);
    setErrorPrep(null);
    setPreparado(null);
    reset();
    try {
      const r = await fetch("/api/embedding", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ texto }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErrorPrep(j.error ?? "No se pudo preparar el aporte");
      } else {
        setPreparado(j);
      }
    } catch (e) {
      setErrorPrep(String(e));
    } finally {
      setPreparando(false);
    }
  }

  function enviar() {
    if (!preparado) return;
    writeContract({
      address: BENEVRIA_ADDRESS,
      abi: BENEVRIA_ABI,
      functionName: "aportar",
      args: [preparado.lo, preparado.hi, preparado.hash, tema],
    });
  }

  return (
    <RequiereWallet
      titulo="Conecta tu wallet para enseñar"
      motivo="Tu aporte queda registrado en la cadena a tu nombre — es lo que después te da derecho a cobrar. Para firmarlo hace falta una wallet."
    >
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Enseñar algo a la IA</h1>
      <p className="mt-2 opacity-70">
        Escribe conocimiento que un modelo grande probablemente alucine: un trámite local, un procedimiento de tu oficio,
        jerga técnica de tu región. El contrato verifica que sea genuinamente nuevo antes de emitir puntos.
      </p>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">Tu aporte</label>
        <textarea
          // El tema del scaffold usa --radius-field: 9999rem, que deforma el
          // textarea hasta volverlo una elipse. Se corrige en el elemento.
          style={{ borderRadius: "0.75rem", padding: "0.9rem 1rem", lineHeight: 1.6 }}
          className="textarea textarea-bordered h-56 w-full font-mono text-sm"
          placeholder="Ej.: Para registrar una empresa unipersonal en Santa Cruz, el trámite en FUNDEMPRESA exige…"
          value={texto}
          onChange={ev => {
            setTexto(ev.target.value);
            setPreparado(null);
          }}
        />
        <div className="mt-1 flex justify-between text-xs opacity-60">
          <span>{texto.trim().length} caracteres (mínimo 80)</span>
          {estado.totalTemas > 0 && (
            <span>
              Tema:{" "}
              <select
                className="select select-xs select-bordered"
                value={tema}
                onChange={ev => setTema(Number(ev.target.value))}
              >
                <option value={0}>Sin tema</option>
                {Array.from({ length: estado.totalTemas }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Tema #{i + 1}
                  </option>
                ))}
              </select>
            </span>
          )}
        </div>
      </div>

      {/* Paso 1 — fuera de la cadena */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="btn btn-outline" onClick={preparar} disabled={preparando || texto.trim().length < 80}>
          {preparando ? "Analizando…" : "1. Analizar fuera de la cadena"}
        </button>
        {preparado && (
          <button className="btn btn-primary" onClick={enviar} disabled={!isConnected || isPending || minando}>
            {isPending ? "Confirma en la wallet…" : minando ? "Verificando on-chain…" : "2. Enviar al contrato"}
          </button>
        )}
      </div>

      {!isConnected && preparado && (
        <p className="mt-3 text-sm text-warning">Conecta tu wallet para enviar el aporte.</p>
      )}

      {errorPrep && (
        <div className="mt-4 rounded-xl border border-error/50 bg-error/10 p-4">
          <div className="font-semibold">Rechazado por las heurísticas</div>
          <p className="mt-1 text-sm">{errorPrep}</p>
          <p className="mt-2 text-xs opacity-70">
            Esta capa corre fuera de la cadena porque es barata. Filtrar aquí evita gastar una transacción en algo que el
            contrato iba a rechazar igual.
          </p>
        </div>
      )}

      {preparado && (
        <div className="mt-4 rounded-xl border border-success/50 bg-success/10 p-4">
          <div className="font-semibold">Listo para verificación on-chain</div>
          <dl className="mt-2 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="opacity-60">Embedding:</dt>
              <dd>
                {preparado.fuenteEmbedding === "remoto" ? "modelo real (semántico)" : "local (léxico)"}, truncado a 64
                dimensiones
              </dd>
            </div>
            {preparado.datosSensiblesRemovidos.length > 0 && (
              <div className="flex gap-2">
                <dt className="opacity-60">Datos removidos:</dt>
                <dd>{preparado.datosSensiblesRemovidos.join(", ")}</dd>
              </div>
            )}
            <div className="flex gap-2">
              <dt className="opacity-60">Hash:</dt>
              <dd className="truncate font-mono text-xs">{preparado.hash}</dd>
            </div>
          </dl>
          {preparado.aviso && <p className="mt-2 text-xs opacity-70">{preparado.aviso}</p>}
        </div>
      )}

      {errorTx && (
        <div className="mt-4 rounded-xl border border-error/50 bg-error/10 p-4">
          <div className="font-semibold">El contrato rechazó el aporte</div>
          <p className="mt-1 text-sm">{explicarError(errorTx)}</p>
          <p className="mt-2 text-xs opacity-70">
            Esta decisión la tomó el contrato, no nuestro servidor. Cualquiera puede reproducir el cálculo con los datos
            públicos de la cadena.
          </p>
        </div>
      )}

      {isSuccess && (
        <div className="mt-4 rounded-xl border border-success/60 bg-success/10 p-4">
          <div className="font-semibold">✅ Aporte aceptado y verificado on-chain</div>
          <p className="mt-1 text-sm">
            El contrato confirmó que es conocimiento nuevo y te emitió puntos por su novedad.
          </p>
          {txHash && (
            <a
              className="link mt-2 inline-block text-xs"
              href={`https://sepolia.arbiscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
            >
              Ver transacción en Arbiscan →
            </a>
          )}
        </div>
      )}

      {contratoDesplegado && (
        <div className="mt-8 rounded-xl border border-base-300 bg-base-200/50 p-4 text-xs opacity-75">
          <strong>Qué hace el contrato con esto:</strong> compara tu vector contra los últimos 256 del corpus con
          similitud coseno en punto fijo. Si supera 0,90 de similitud, lo rechaza como reenvío. Si pasa, te emite puntos
          proporcionales a cuán distinto es. Son ~16.000 multiplicaciones-sumas por transacción — el motivo por el que
          esto está escrito en Rust sobre Stylus y no en Solidity.
        </div>
      )}
    </div>
    </RequiereWallet>
  );
}
