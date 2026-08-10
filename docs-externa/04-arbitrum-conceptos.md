# Arbitrum en lenguaje simple

## El problema que resuelve

Ethereum es seguro y descentralizado, pero **caro y lento**: cada transacción la ejecutan
y almacenan miles de nodos. En horas pico una operación simple puede costar varios dólares.
Eso mata cualquier aplicación de uso masivo.

## La solución: Layer 2 (L2)

Un **L2** es una blockchain que corre "encima" de Ethereum:
- Ejecuta las transacciones **fuera** de Ethereum (rápido y barato).
- Publica periódicamente en Ethereum un **resumen comprimido** de lo que pasó.
- Hereda la seguridad de Ethereum, porque cualquiera puede impugnar un resumen fraudulento.

Ethereum es el juzgado; el L2 es la oficina donde se hace el trabajo diario.

## Optimistic Rollup

Arbitrum es un **optimistic rollup**:
- "Optimista" = se **asume que las transacciones publicadas son válidas** por defecto.
- Existe una **ventana de disputa** (~7 días) en la que cualquiera puede presentar una
  *fraud proof* demostrando que el resumen es incorrecto. Si acierta, se revierte y el
  tramposo pierde su depósito.
- Consecuencia práctica: mover fondos **de Arbitrum hacia Ethereum** tarda ~7 días por el
  puente oficial. De Ethereum hacia Arbitrum es rápido (minutos).

> Para el hackathon esto no molesta: todo ocurre dentro de Arbitrum.

## Las redes del ecosistema

| Red | Chain ID | Para qué sirve | Gas |
|---|---|---|---|
| **Arbitrum One** | 42161 | Mainnet principal. DeFi, valor real | ETH real |
| **Arbitrum Nova** | 42170 | Optimizada para volumen alto y costo ultrabajo (gaming, social) | ETH real, más barato |
| **Arbitrum Sepolia** | 421614 | **Testnet**. Gas gratis vía faucet | ETH de prueba |
| **Orbit** | propio | Crear *tu propia* L3 personalizada sobre Arbitrum | configurable |

**Para el hackathon: Arbitrum Sepolia.** Es explícitamente permitida ("o una red de pruebas
del ecosistema Arbitrum"), es gratis, y es donde Stylus se prueba cómodamente.
Si sobra tiempo y presupuesto, un despliegue extra en Arbitrum One suma puntos de
"uso del ecosistema" — pero no es requisito.

### Datos de red (Arbitrum Sepolia)
- RPC público: `https://sepolia-rollup.arbitrum.io/rpc`
- Explorador: `https://sepolia.arbiscan.io`
- Faucet: se obtiene ETH de Sepolia (L1) y se puentea, o se usa un faucet directo de Arbitrum Sepolia.

*(Verificar estos endpoints en docs.arbitrum.io antes de desplegar — pueden cambiar.)*

## Tecnologías del ecosistema (lo que cuenta para el 20%)

| Tecnología | Qué es |
|---|---|
| **Arbitrum One / Nova** | Las redes donde despliegas |
| **Stylus** | Escribir contratos en **Rust/C/C++** además de Solidity → ver `05-stylus-rust.md` |
| **Orbit** | Lanzar tu propia cadena L3 |
| **Nitro** | El motor interno de Arbitrum (compila EVM a WASM) |
| **Arbitrum Bridge** | Puente L1↔L2 |
| **Stylus SDK (Rust)** | Librería para escribir contratos Stylus |
| **cargo-stylus** | CLI para compilar, verificar y desplegar contratos Stylus |

Usar **Stylus** es la forma más fuerte y menos común de demostrar "uso significativo del
ecosistema Arbitrum", porque es una tecnología exclusiva de Arbitrum. Un ERC-20 en Solidity
funciona igual en cualquier cadena EVM — no demuestra nada específico de Arbitrum.

## Diferencia con Ethereum que sí notarás al programar

1. **Gas**: en Arbitrum el gas se compone de costo L2 (ejecución) + costo L1 (publicar datos).
   Es barato pero no gratis.
2. **`block.number`** en Arbitrum devuelve el número de bloque de **L1**, no del L2.
   Si necesitas tiempo, usa `block.timestamp`. Es la trampa clásica.
3. **Precompilados propios** (`ArbSys`, `ArbGasInfo`, etc.) en direcciones `0x64`, `0x6c`…
4. Todo lo demás (Solidity, ethers/viem, wallets, ABI) funciona **idéntico**.
