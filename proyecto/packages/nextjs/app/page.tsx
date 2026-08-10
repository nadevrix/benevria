"use client";

/**
 * Portada.
 *
 * Es lo primero que ve un jurado al abrir el link del demo, así que tiene un solo
 * trabajo: dejar claro en diez segundos **qué problema resuelve**, **cómo funciona**
 * y **por qué necesita una blockchain**. Sin esto, la primera pantalla era el panel
 * vacío, que no explica nada.
 *
 * Funciona con o sin contrato desplegado: las cifras en vivo solo aparecen si hay
 * contrato, y su ausencia no rompe la página.
 */

import Link from "next/link";
import { contratoDesplegado, useEstadoBenevria } from "~~/lib/useBenevria";

function Paso({ n, titulo, texto }: { n: number; titulo: string; texto: string }) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
        {n}
      </div>
      <div className="mt-3 font-semibold">{titulo}</div>
      <p className="mt-1 text-sm opacity-70">{texto}</p>
    </div>
  );
}

export default function Portada() {
  const estado = useEstadoBenevria();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* --- Hero --- */}
      <section className="text-center">
        <div className="inline-block rounded-full border border-primary bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary-content">
          Arbitrum Stylus · ETH Lima 2026
        </div>
        <h1 className="mt-5 text-5xl font-black leading-tight sm:text-6xl">
          Una IA gratis
          <br />
          que la comunidad enseña
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg opacity-75">
          Las IAs se entrenaron con el conocimiento de todos y después nos lo cobran. <strong>BenevrIA</strong> le da la
          vuelta: aportas lo que sabes, un contrato verifica que sea nuevo, y eso sube el nivel del modelo{" "}
          <em>que todos usan</em>. Cuando entra dinero, cobra quien enseñó.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/chat" className="btn btn-primary btn-lg">
            Usar la IA gratis
          </Link>
          <Link href="/aportar" className="btn btn-outline btn-lg">
            Enseñarle algo
          </Link>
        </div>
      </section>

      {/* --- Cifras en vivo (solo si hay contrato) --- */}
      {contratoDesplegado && (
        <section className="mt-14 grid gap-4 sm:grid-cols-4">
          {[
            { k: "Nivel actual", v: estado.nombreNivel, d: estado.modelo.nombre },
            { k: "Corpus verificado", v: estado.corpus.toString(), d: "aportes únicos" },
            { k: "Puntaje colectivo", v: estado.puntaje.toString(), d: "novedad acumulada" },
            { k: "Temas pedidos", v: String(estado.totalTemas), d: "por la comunidad" },
          ].map(m => (
            <div key={m.k} className="rounded-2xl border border-base-300 bg-base-100 p-4 text-center">
              <div className="text-xs uppercase tracking-wide opacity-60">{m.k}</div>
              <div className="mt-1 text-2xl font-bold text-primary">{m.v}</div>
              <div className="text-xs opacity-60">{m.d}</div>
            </div>
          ))}
        </section>
      )}

      {/* --- El problema --- */}
      <section className="mt-16 rounded-3xl border border-base-300 bg-base-200/40 p-8">
        <h2 className="text-2xl font-bold">El problema</h2>
        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="font-semibold">Hay conocimiento que la IA no tiene</div>
            <p className="mt-1 text-sm opacity-75">
              El trámite que solo sabe quien lo hizo. La jerga del oficio. El procedimiento que ningún manual escribió.
              Eso los modelos lo alucinan — y quien lo sabe no recibe nada por saberlo.
            </p>
          </div>
          <div>
            <div className="font-semibold">Y el acceso se paga</div>
            <p className="mt-1 text-sm opacity-75">
              Se entrenaron con el conocimiento de la gente y lo devuelven por suscripción. Quien no puede pagarla, queda
              fuera.
            </p>
          </div>
        </div>
      </section>

      {/* --- Cómo funciona --- */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold">Cómo funciona</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Paso
            n={1}
            titulo="Enseñas"
            texto="Escribes conocimiento que los modelos grandes suelen inventar: un trámite local, un procedimiento de tu oficio."
          />
          <Paso
            n={2}
            titulo="El contrato verifica"
            texto="Compara tu aporte contra todo el corpus. Si es un reenvío de algo que ya está, lo rechaza. Si es nuevo, emite puntos."
          />
          <Paso
            n={3}
            titulo="Sube el nivel de todos"
            texto="La novedad acumulada desbloquea modelos mejores. Los usa cualquiera, haya aportado o no. Ese es el bien común."
          />
          <Paso
            n={4}
            titulo="Cobras"
            texto="Cuando entra dinero, se reparte en proporción exacta a la novedad que aportaste. Sin lista de beneficiarios ni aprobaciones."
          />
        </div>
      </section>

      {/* --- Por qué on-chain --- */}
      <section className="mt-16 rounded-3xl border border-primary/30 bg-primary/5 p-8">
        <h2 className="text-2xl font-bold">¿Y esto no funcionaría con una base de datos?</h2>
        <p className="mt-3 opacity-80">
          Un servidor puede calcular exactamente lo mismo. Lo que no puede es <strong>probarlo</strong>. Estas tres
          decisiones son justo aquellas donde el operador tendría incentivo a mentir:
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Decisión</th>
                <th>Si la tomara un servidor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium">¿Tu aporte es novedoso?</td>
                <td className="opacity-75">“Es duplicado, no cobras” — y no tienes cómo comprobarlo</td>
              </tr>
              <tr>
                <td className="font-medium">¿Qué modelo corre?</td>
                <td className="opacity-75">“Bajó de nivel” mientras se embolsa la diferencia</td>
              </tr>
              <tr>
                <td className="font-medium">¿Cuánto le toca a cada quien?</td>
                <td className="opacity-75">Un reparto que nadie puede auditar</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm opacity-75">
          Por eso viven en un contrato <strong>Stylus</strong>: la comparación contra el corpus son ~16.000
          multiplicaciones-sumas por transacción. En Solidity sería impagable en gas; en WASM compilado a código nativo
          es aritmética de registro.
        </p>
      </section>

      {/* --- Cierre --- */}
      <section className="mt-16 text-center">
        <h2 className="text-2xl font-bold">Empieza por donde quieras</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link href="/temas" className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary">
            <div className="font-semibold">Pedir un tema</div>
            <p className="mt-1 text-sm opacity-70">Dinos qué no sabe la IA y alguien se lo enseñará.</p>
          </Link>
          <Link href="/panel" className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary">
            <div className="font-semibold">Ver el panel</div>
            <p className="mt-1 text-sm opacity-70">Nivel, corpus y tesorería, leídos de la cadena.</p>
          </Link>
          <Link
            href="/recompensas"
            className="rounded-2xl border border-base-300 bg-base-100 p-5 transition hover:border-primary"
          >
            <div className="font-semibold">Cobrar</div>
            <p className="mt-1 text-sm opacity-70">Lo que te toca por lo que enseñaste.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
