"use client";

/** Hooks compartidos para leer el estado de BenevrIA desde la cadena. */

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { BENEVRIA_ABI, BENEVRIA_ADDRESS, MODELOS_POR_NIVEL, NOMBRES_NIVEL } from "./benevria";

const base = { address: BENEVRIA_ADDRESS, abi: BENEVRIA_ABI } as const;

export const contratoDesplegado = BENEVRIA_ADDRESS !== "0x0000000000000000000000000000000000000000";

/** Estado global del protocolo: nivel, puntaje, tesorería, época. */
export function useEstadoBenevria() {
  const { data, isLoading, refetch } = useReadContracts({
    contracts: [
      { ...base, functionName: "nivel" },
      { ...base, functionName: "nivelPorConocimiento" },
      { ...base, functionName: "nivelPorTesoreria" },
      { ...base, functionName: "puntajeColectivo" },
      { ...base, functionName: "faltaParaSiguienteNivel" },
      { ...base, functionName: "tamanoCorpus" },
      { ...base, functionName: "presupuestoInferencia" },
      { ...base, functionName: "gastadoInferencia" },
      { ...base, functionName: "epocaActual" },
      { ...base, functionName: "bloqueL2" },
      { ...base, functionName: "totalTemas" },
    ],
    query: { enabled: contratoDesplegado, refetchInterval: 5000 },
  });

  const v = <T,>(i: number, def: T): T => (data?.[i]?.result as T) ?? def;

  const nivel = Number(v(0, 0n));
  const porConocimiento = Number(v(1, 0n));
  const porTesoreria = Number(v(2, 0n));
  const puntaje = v<bigint>(3, 0n);
  const falta = v<bigint>(4, 0n);

  // Progreso hacia el siguiente nivel, para la barra.
  const objetivo = puntaje + falta;
  const progreso = objetivo > 0n ? Number((puntaje * 100n) / objetivo) : 100;

  return {
    isLoading,
    refetch,
    nivel,
    nombreNivel: NOMBRES_NIVEL[nivel] ?? "?",
    modelo: MODELOS_POR_NIVEL[nivel] ?? MODELOS_POR_NIVEL[0],
    porConocimiento,
    porTesoreria,
    // Cuál de los dos está frenando el nivel: la clave narrativa del proyecto.
    frenadoPor: porTesoreria < porConocimiento ? "tesoreria" : porConocimiento < 3 ? "conocimiento" : "ninguno",
    puntaje,
    falta,
    progreso: Math.min(100, Math.max(0, progreso)),
    corpus: v<bigint>(5, 0n),
    presupuesto: v<bigint>(6, 0n),
    gastado: v<bigint>(7, 0n),
    epoca: v<bigint>(8, 0n),
    bloqueL2: v<bigint>(9, 0n),
    totalTemas: Number(v(10, 0n)),
  };
}

/** Puntos y reclamable del usuario conectado en una época dada. */
export function useMisPuntos(epoca: bigint) {
  const { address } = useAccount();
  const { data, refetch } = useReadContracts({
    contracts: [
      { ...base, functionName: "puntosDe", args: [address ?? "0x0", epoca] },
      { ...base, functionName: "puntosTotalesDe", args: [epoca] },
      { ...base, functionName: "pozoDe", args: [epoca] },
      { ...base, functionName: "reclamable", args: [address ?? "0x0", epoca] },
    ],
    query: { enabled: contratoDesplegado && !!address, refetchInterval: 5000 },
  });
  return {
    puntos: (data?.[0]?.result as bigint) ?? 0n,
    totales: (data?.[1]?.result as bigint) ?? 0n,
    pozo: (data?.[2]?.result as bigint) ?? 0n,
    reclamable: (data?.[3]?.result as bigint) ?? 0n,
    refetch,
  };
}

/** Lee un tema del panel de demanda. */
export function useTema(id: number) {
  return useReadContract({
    ...base,
    functionName: "tema",
    args: [id],
    query: { enabled: contratoDesplegado && id > 0 },
  });
}
