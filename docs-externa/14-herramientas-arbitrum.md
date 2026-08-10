# Herramientas de Arbitrum: qué hay, qué usar, qué es obligatorio

Verificado el 2026-08-08 contra docs.arbitrum.io y el repo de Scaffold-Stylus.

---

## 🔴 Lo ÚNICO obligatorio

Sorprendentemente poco. De todas las bases, en materia de tecnología solo se exige:

| # | Obligación | Fuente |
|---|---|---|
| 1 | **Al menos un smart contract desplegado** en Arbitrum One, Nova o testnet del ecosistema | Requisitos generales |
| 2 | **Interacción real** demostrada entre el frontend y ese contrato | Requisitos generales |
| 3 | Usar tecnologías del ecosistema Arbitrum **como parte fundamental**, no decorativa | Requisitos generales |
| 4 | **El scaffold correspondiente** al bounty elegido | Requisitos del bounty |

Eso es todo. **No hay ninguna herramienta específica de uso obligatorio**: ni un SDK, ni un
oráculo, ni un estándar de token, ni una librería. Nada más de la lista de abajo es exigido.

### Lo obligatorio por bounty
| Nivel | Base obligatoria | Contrato obligatorio |
|---|---|---|
| 🟢 Basic | Scaffold-ETH | ≥1 contrato (Solidity) en red Arbitrum |
| 🟡 Intermediate | Scaffold-Stylus | ≥1 contrato **Stylus (Rust)** |
| 🔴 Advanced | Scaffold-Stylus | ≥1 contrato Stylus **+ IA esencial al flujo** |

---

## 🧰 El catálogo completo de herramientas

### A) Redes donde desplegar

| Red | Chain ID | Uso | Costo |
|---|---|---|---|
| **Arbitrum Sepolia** | 421614 | ✅ **Recomendada para el hackathon** | Gratis (faucet) |
| Arbitrum One | 42161 | Mainnet principal | ETH real |
| Arbitrum Nova | 42170 | Volumen alto, costo ultrabajo (gaming, social) | ETH real, más barato |
| Nitro devnode | local | Desarrollo local, pre-fondeado | Gratis |

- RPC Sepolia: `https://sepolia-rollup.arbitrum.io/rpc`
- Explorador: `https://sepolia.arbiscan.io`

### B) Stylus — el diferenciador

| Herramienta | Qué es | Comando |
|---|---|---|
| **Stylus SDK (Rust)** | Macros y tipos para escribir contratos: `#[storage]`, `#[public]`, `#[entrypoint]` | dependencia de Cargo |
| **cargo-stylus** | CLI oficial | `cargo install --force cargo-stylus` |
| **Nitro devnode** | Nodo local pre-fondeado, evita depender del faucet | `git clone OffchainLabs/nitro-devnode && ./run-dev-node.sh` → RPC `localhost:8547` |
| **Stylus Cache Manager** | Cachea contratos muy usados para abaratar sus llamadas | opcional |

**Comandos que vas a usar:**
```bash
cargo stylus new <nombre>      # plantilla de proyecto
cargo stylus check             # valida el WASM y estima costo  (requiere Docker)
cargo stylus deploy            # despliega y activa el contrato
cargo stylus export-abi        # genera la ABI Solidity para el frontend
```

**Requisitos verificados en esta máquina:**
| Requisito | Pide | Tienes |
|---|---|---|
| Rust | ≥ 1.91 | ✅ 1.97.1 |
| Cargo | — | ✅ 1.97.1 |
| Docker (para `check` y devnode) | sí | ✅ 29.6.2 |
| yarn (para el scaffold) | sí | ❌ → `corepack enable` |

> Scaffold-Stylus fija versiones en `packages/stylus/contracts/rust-toolchain.toml`
> (cargo-stylus 0.10.8, rustc 1.91.0). `rustup` descargará esa toolchain automáticamente;
> no hay conflicto con tu 1.97.1.

### C) Los scaffolds

| | Scaffold-ETH 2 | Scaffold-Stylus |
|---|---|---|
| Repo | BuidlGuidl | `github.com/Arb-Stylus/scaffold-stylus` |
| Docs | — | `arb-stylus.github.io/scaffold-stylus-docs` |
| Stack | Next.js + wagmi + viem + RainbowKit + Tailwind | **Next.js + RainbowKit + Wagmi + Foundry + TypeScript + Stylus** |
| Contratos | Solidity | Rust |

**Lo que te regala Scaffold-Stylus (y por eso no se parte de cero):**
- **Contract Hot Reload** — el frontend se re-adapta solo cuando cambias el contrato
- **Burner Wallet + faucet local** — pruebas sin MetaMask ni pedir tokens
- Hooks tipados generados desde la ABI
- Página `/debug` que autogenera UI para llamar cualquier función del contrato
- Integración de wallets ya cableada

### D) Herramientas de interacción y desarrollo

| Herramienta | Para qué |
|---|---|
| **Foundry (`cast`)** | Llamar contratos desde la terminal, depurar |
| **viem / wagmi** | Hablar con la cadena desde el frontend (ya vienen en el scaffold) |
| **RainbowKit** | Botón de conectar wallet (ya viene) |
| **Arbiscan** | Ver tu contrato, sus transacciones, verificar código |
| **rust-analyzer (VS Code)** | Autocompletado y errores de Rust en vivo |

### E) Cosas del ecosistema que existen pero probablemente NO uses

| Herramienta | Qué es | Por qué no |
|---|---|---|
| **Orbit** | Lanzar tu propia cadena L3 sobre Arbitrum | Días de trabajo. GuardChain lo usó, pero con más tiempo |
| **`@arbitrum/sdk`** | Librería para puentes L1↔L2 | Solo si mueves fondos entre capas |
| **Precompilados** (`ArbSys`, `ArbGasInfo`…) | Funciones nativas de Arbitrum en direcciones fijas | Nicho, salvo que necesites datos de la cadena |
| **Arbitrum Bridge** | Puente oficial L1↔L2 | Innecesario si vives en Sepolia |
| **Stylus Cache Manager** | Optimización de costo | Solo con tráfico real |

---

## ⚠️ Trampa: lo que NO cuenta como "ecosistema Arbitrum"

El 20% de la rúbrica pide *"tecnologías del ecosistema Arbitrum"*. Muchas cosas que suenan
avanzadas **no son de Arbitrum** — son estándares de Ethereum que corren igual en cualquier
cadena EVM:

| Suena impresionante | Pero... |
|---|---|
| **Paymasters / ERC-4337 (account abstraction)** | Estándar de Ethereum. Funciona en Base, Optimism, Polygon… |
| **ERC-20 / ERC-721 / ERC-4626** | Estándares de Ethereum |
| **Pruebas ZK** | Criptografía general, no de Arbitrum |
| **The Graph, Chainlink, IPFS** | Multi-cadena |
| **Solidity, Hardhat, Foundry** | Herramientas de Ethereum |

Usarlas está **permitido y es buena idea** — pero no las presentes como tu argumento de
"uso del ecosistema Arbitrum". Ese argumento tiene que apoyarse en:

> **Stylus** · **Orbit** · **Nova** · **Nitro** · precompilados de Arbitrum · o una razón
> concreta por la que tu solución solo es viable en Arbitrum (costo, throughput, interop
> EVM+WASM).

---

## 🎯 Recomendación de stack para este proyecto

```
Base:        Scaffold-Stylus            (obligatorio para bounty Intermediate/Advanced)
Contrato:    Rust + Stylus SDK          (el diferenciador del 20%)
Red:         Arbitrum Sepolia           (gratis, permitida explícitamente)
Frontend:    Next.js (ya viene)         (decisión del usuario, compatible)
Off-chain:   Postgres en Render         (índice de eventos + datos no on-chain)
IA:          API en un route de Next.js (solo para bounty Advanced)
Local:       Nitro devnode + Docker     (iterar sin depender del faucet)
```

### Orden de trabajo sugerido
1. `corepack enable` (yarn) + `cargo install --force cargo-stylus`
2. Clonar Scaffold-Stylus, levantarlo con el devnode local
3. **Desplegar un contrato mínimo a Arbitrum Sepolia el día 1** ← elimina el riesgo binario
4. Recién entonces construir la lógica real

---

## Fuentes
- Quickstart Stylus: https://docs.arbitrum.io/stylus/quickstart
- Scaffold-Stylus: https://github.com/Arb-Stylus/scaffold-stylus
- Docs Scaffold-Stylus: https://arb-stylus.github.io/scaffold-stylus-docs/
- Stylus SDK: https://github.com/OffchainLabs/stylus-sdk-rs
- Nitro devnode: https://github.com/OffchainLabs/nitro-devnode
