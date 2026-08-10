# Créditos — software de terceros

Requisito del hackathon: declarar todo el software de terceros utilizado, respetando sus
licencias. Ninguna de estas herramientas constituye el producto: son andamiaje.

## Base del proyecto

| Software | Licencia | Uso |
|---|---|---|
| [Scaffold-Stylus](https://github.com/Arb-Stylus/scaffold-stylus) | MIT | Monorepo base: estructura, scripts de despliegue, integración Next.js ↔ Stylus |
| [Stylus SDK for Rust](https://github.com/OffchainLabs/stylus-sdk-rs) `0.9.0` | MIT / Apache-2.0 | Macros de almacenamiento, entrypoint, ABI y llamadas a contratos |
| [cargo-stylus](https://github.com/OffchainLabs/cargo-stylus) `0.10.8` | MIT / Apache-2.0 | `check`, `deploy`, `export-abi` |

## Contrato (Rust)

| Librería | Licencia | Uso |
|---|---|---|
| [alloy-primitives](https://github.com/alloy-rs/core) `0.8.20` | MIT / Apache-2.0 | Tipos primitivos de Ethereum (`Address`, `U256`, `FixedBytes`) |
| [alloy-sol-types](https://github.com/alloy-rs/core) `0.8.20` | MIT / Apache-2.0 | Macro `sol!` para eventos, errores e interfaces |
| [hex](https://crates.io/crates/hex) `0.4` | MIT / Apache-2.0 | Codificación hexadecimal |

## Frontend

| Librería | Licencia | Uso |
|---|---|---|
| [Next.js](https://nextjs.org) `16.2` | MIT | Framework de la aplicación (App Router) |
| [React](https://react.dev) `19.2` | MIT | Interfaz |
| [viem](https://viem.sh) `2.39` | MIT | Cliente de Ethereum, codificación ABI |
| [wagmi](https://wagmi.sh) `2.19` | MIT | Hooks de React para lectura y escritura de contratos |
| [RainbowKit](https://rainbowkit.com) `2.2.9` | MIT | Conexión de wallets |
| [TanStack Query](https://tanstack.com/query) `5.59` | MIT | Caché y refresco de lecturas on-chain |
| [Tailwind CSS](https://tailwindcss.com) | MIT | Estilos |
| [daisyUI](https://daisyui.com) `5.5` | MIT | Componentes de interfaz |
| [Heroicons](https://heroicons.com) | MIT | Iconografía |

## Infraestructura de Arbitrum

| Componente | Uso |
|---|---|
| [Arbitrum Stylus](https://docs.arbitrum.io/stylus/) | Segunda VM (WASM) donde corre el contrato |
| Precompilado **ArbSys** (`0x64`) | Número de bloque real de L2 para el cálculo de épocas |
| **Arbitrum Sepolia** (chainId 421614) | Red de despliegue |
| [Arbiscan](https://sepolia.arbiscan.io) | Explorador de bloques |

## Pagos

| Componente | Uso |
|---|---|
| [x402](https://x402.org) | Estándar de pago por request en USDC sobre HTTP 402. Construido por el equipo de Coinbase Developer Platform |
| [Facilitador de PayAI](https://facilitator.payai.network/) | Liquidación de x402 en `arbitrum-sepolia` |
| [EIP-3009](https://eips.ethereum.org/EIPS/eip-3009) | `transferWithAuthorization`, el mecanismo de firma que usa x402 |

## Modelos de IA

Se usan exclusivamente **modelos de pesos abiertos**. Revender acceso a modelos
propietarios (Claude, Gemini, GPT) choca con los términos de servicio de sus dueños.

| Modelo | Nivel | Licencia |
|---|---|---|
| Llama 3.2 3B Instruct | 0 · Base | Llama 3.2 Community License |
| Qwen 2.5 7B Instruct | 1 · Bronce | Apache-2.0 |
| DeepSeek V3 | 2 · Plata | DeepSeek License |
| Kimi K2 | 3 · Oro | Modified MIT |

> Las licencias de modelos abiertos difieren entre sí y algunas tienen restricciones de
> uso comercial por escala. Antes de un despliegue en producción hay que revisar cada una.

Servidos a través de un proveedor de inferencia compatible con la API de OpenAI
([OpenRouter](https://openrouter.ai) por defecto; funciona igual con Together, Groq,
Fireworks o DeepInfra).

Embeddings: cualquier proveedor compatible con la API de OpenAI. El proyecto incluye un
respaldo local propio basado en hashing de n-gramas, escrito para este hackathon.

## Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| [Yarn](https://yarnpkg.com) `3.2.3` | Gestor del monorepo (binario verificado por hash contra el release oficial) |
| [TypeScript](https://typescriptlang.org) | Tipado del frontend y los scripts |
| [Claude Code](https://claude.com/claude-code) | Asistencia de IA en el desarrollo |

## Fuentes consultadas

- Documentación de Arbitrum — precompilados, Stylus, activación y caché
- Documentación de x402 y su whitepaper
- Avisos de seguridad sobre el ataque ChainDrop/Shai-Hulud (CSA Singapur, Snyk, Socket,
  Wiz, Datadog, Microsoft) — ver `../bitacora/03-seguridad.md`
