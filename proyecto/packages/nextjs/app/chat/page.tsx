"use client";

/**
 * Chat con la IA colectiva.
 *
 * El modelo no lo elige esta página: lo dicta el contrato. La cabecera muestra qué
 * nivel está vigente y de dónde salió ese dato, porque esa transparencia *es* el
 * producto: nadie puede servirte un modelo peor del que la comunidad se ganó.
 */

import { useRef, useState } from "react";
import Link from "next/link";
import { useEstadoBenevria } from "~~/lib/useBenevria";

type Mensaje = { role: "user" | "assistant"; content: string };

export default function Chat() {
  const estado = useEstadoBenevria();
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState("");
  const [cargando, setCargando] = useState(false);
  const [meta, setMeta] = useState<{ nombreModelo?: string; leidoDeCadena?: boolean } | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  async function enviar() {
    const texto = entrada.trim();
    if (!texto || cargando) return;
    const nuevos: Mensaje[] = [...mensajes, { role: "user", content: texto }];
    setMensajes(nuevos);
    setEntrada("");
    setCargando(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mensajes: nuevos }),
      });
      const j = await r.json();
      setMeta({ nombreModelo: j.nombreModelo, leidoDeCadena: j.leidoDeCadena });
      setMensajes([...nuevos, { role: "assistant", content: j.respuesta ?? j.error ?? "(sin respuesta)" }]);
    } catch (e) {
      setMensajes([...nuevos, { role: "assistant", content: `Error: ${String(e)}` }]);
    } finally {
      setCargando(false);
      setTimeout(() => finRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-3xl flex-col px-6 py-6">
      {/* Cabecera: qué modelo corre y por qué */}
      <div className="mb-4 rounded-2xl border border-base-300 bg-base-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-wide opacity-60">Modelo vigente</div>
            <div className="text-xl font-bold acento">
              {estado.modelo.nombre} <span className="text-sm font-normal opacity-70">· nivel {estado.nombreNivel}</span>
            </div>
          </div>
          <Link href="/aportar" className="btn btn-sm btn-outline">
            Subir el nivel enseñando →
          </Link>
        </div>
        <p className="mt-2 text-xs opacity-60">
          Este modelo lo decidió el contrato, no nosotros. Es gratis para todos, aportes o no.
          {meta?.leidoDeCadena === false && " (Contrato no disponible: usando nivel por defecto.)"}
        </p>
      </div>

      {/* Conversación */}
      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-base-300 bg-base-100 p-4">
        {mensajes.length === 0 && (
          <div className="py-12 text-center opacity-60">
            <p className="text-lg">Pregúntale lo que quieras.</p>
            <p className="mt-1 text-sm">
              Si no sabe algo, pídelo en el{" "}
              <Link href="/temas" className="link">
                panel de temas
              </Link>{" "}
              y alguien se lo enseñará.
            </p>
          </div>
        )}
        {mensajes.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            <div
              className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-sm ${
                m.role === "user" ? "bg-primary text-primary-content" : "bg-base-200"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {cargando && <div className="text-sm opacity-60">Pensando…</div>}
        <div ref={finRef} />
      </div>

      {/* Entrada */}
      <div className="mt-4 flex gap-2">
        <input
          className="input input-bordered flex-1"
          placeholder="Escribe tu pregunta…"
          value={entrada}
          onChange={e => setEntrada(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && enviar()}
        />
        <button className="btn btn-primary" onClick={enviar} disabled={cargando || !entrada.trim()}>
          Enviar
        </button>
      </div>
    </div>
  );
}
