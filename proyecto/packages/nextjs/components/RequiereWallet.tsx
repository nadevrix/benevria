"use client";

/**
 * Puerta de conexión.
 *
 * En web3 no hay "iniciar sesión": la wallet **es** la identidad. Pero eso no
 * significa dejar al usuario frente a un formulario que no puede enviar. Esta puerta
 * dice explícitamente qué hace falta y por qué, antes de mostrar la acción.
 *
 * Se usa solo donde hay una escritura en cadena. **El chat no la lleva a propósito**:
 * la IA es gratis para cualquiera, aporte o no, y ponerle un muro contradiría la tesis
 * del proyecto.
 */

import { ReactNode } from "react";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

export function RequiereWallet({
  children,
  titulo,
  motivo,
}: {
  children: ReactNode;
  titulo: string;
  motivo: string;
}) {
  const { isConnected } = useAccount();

  if (isConnected) return <>{children}</>;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-2xl">🔑</div>
        <h2 className="mt-5 text-2xl font-bold">{titulo}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm opacity-75">{motivo}</p>

        <div className="mt-6 flex justify-center">
          <RainbowKitCustomConnectButton />
        </div>

        <p className="mt-6 text-xs opacity-60">
          Aquí no hay usuario ni contraseña: tu wallet es tu identidad. No pedimos correo, no guardamos datos tuyos y
          nadie puede entrar por ti.
        </p>
      </div>

      <p className="mt-6 text-sm opacity-70">
        ¿Solo quieres usar la IA?{" "}
        <a href="/chat" className="link">
          El chat es gratis y no necesita wallet
        </a>
        .
      </p>
    </div>
  );
}
