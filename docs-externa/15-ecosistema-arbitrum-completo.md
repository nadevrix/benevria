# El ecosistema Arbitrum completo — qué es cada cosa

Complementa `14-herramientas-arbitrum.md`. Aquí se explica **qué hace** cada pieza,
incluidas las que el hackathon no menciona.

---

# ❗ Aclaración: Stylus NO es obligatorio

Las bases exigen cumplir **uno** de los tres niveles. Los tres son válidos para los premios
generales (🥇 y 🥈).

| Nivel | ¿Stylus? | ¿Rust? | Lenguaje | Válido para premio general |
|---|---|---|---|---|
| 🟢 Basic | ❌ No | ❌ No | **Solidity** | ✅ Sí |
| 🟡 Intermediate | ✅ Sí | ✅ Sí | Rust | ✅ Sí |
| 🔴 Advanced | ✅ Sí | ✅ Sí | Rust + IA | ✅ Sí |

**Puedes ganar el primer lugar con Solidity puro y cero Rust.** El nivel Basic
(Scaffold-ETH + un contrato Solidity en Arbitrum) cumple todos los requisitos obligatorios.

### Entonces, ¿por qué recomendé Stylus?

Por la rúbrica, no por las reglas:

- **20% "Uso del Ecosistema Arbitrum"** — un contrato Solidity corre idéntico en Ethereum,
  Base, Polygon u Optimism. No demuestra nada *específico* de Arbitrum. Stylus solo existe
  en Arbitrum.
- **Los dos primeros desempates** son Implementación Técnica y Uso del Ecosistema.

Es una decisión de **estrategia y riesgo**, no de cumplimiento:

| | Basic (Solidity) | Intermediate/Advanced (Stylus) |
|---|---|---|
| Riesgo de no terminar | Bajo | Medio-alto |
| Techo de puntaje en el 20% de Arbitrum | Limitado | Alto |
| Curva de aprendizaje | Conocida | Rust + SDK nuevo |
| Ecosistema y ejemplos | Enorme | Más escaso |

> Con ~4 días y trabajando solo, **Basic bien ejecutado vence a Advanced a medio terminar**.
> Un MVP roto pierde en Producto/UX (20%) *y* en Implementación Técnica (25%) — más de lo
> que Stylus podría sumar.

---

# PARTE 1 — Las herramientas que el evento sí menciona

## Scaffold-ETH 2
**Qué es:** un monorepo plantilla con todo lo aburrido de una dApp ya cableado.
**Qué hace:** te da Next.js + wagmi + viem + RainbowKit + Hardhat/Foundry funcionando juntos.
Incluye conexión de wallet, hooks tipados desde la ABI, y una página `/debug` que
**autogenera una interfaz para llamar cualquier función de tu contrato** sin escribir UI.
**Por qué existe:** sin él, conectar wallet + tipar contratos + configurar redes toma un día entero.

## Scaffold-Stylus
**Qué es:** lo mismo, pero con los contratos en Rust en vez de Solidity.
**Qué hace:** mismo frontend (Next.js + RainbowKit + Wagmi + TypeScript), pero
`packages/stylus` con Rust y Foundry. Añade dos cosas valiosas:
- **Contract Hot Reload** — cambias el contrato y el frontend se re-adapta solo.
- **Burner Wallet + faucet local** — pruebas sin MetaMask ni pedir tokens al faucet público.

## Arbitrum Stylus
**Qué es:** una segunda máquina virtual (WASM) que corre junto a la EVM en la misma cadena.
**Qué hace:** te deja escribir contratos en **Rust, C o C++**, totalmente interoperables con
los de Solidity — comparten estado, direcciones y ABI. Desde el frontend se llaman igual.
**Para qué sirve de verdad:** cómputo que la EVM cobra carísimo. WASM es órdenes de magnitud
más eficiente, y la memoria no crece cuadráticamente en costo.

## Stylus SDK (Rust)
**Qué es:** la librería con la que escribes el contrato.
**Qué hace:** macros que convierten Rust normal en un contrato: `#[storage]` define el estado
persistente, `#[public]` expone métodos, `#[entrypoint]` marca el punto de entrada.
Se siente parecido a Solidity, pero en Rust.

## cargo-stylus
**Qué es:** el CLI oficial. Cuatro comandos y ya está todo el ciclo.

| Comando | Qué hace |
|---|---|
| `cargo stylus new` | Crea el proyecto desde plantilla |
| `cargo stylus check` | **Valida que el WASM sea desplegable** y estima el costo (necesita Docker) |
| `cargo stylus deploy` | Despliega y *activa* el contrato en la red |
| `cargo stylus export-abi` | Genera la ABI en formato Solidity para el frontend |

## Nitro devnode
**Qué es:** un nodo de Arbitrum corriendo en tu máquina, con cuentas ya fondeadas.
**Qué hace:** te deja desplegar y probar sin gastar, sin esperar al faucet y sin internet.
RPC en `localhost:8547`. Es donde deberías iterar el 90% del tiempo.

## Arbitrum One / Nova / Sepolia
- **One** (42161): la mainnet principal. Donde está el dinero real y el DeFi.
- **Nova** (42170): optimizada para volumen alto y costo ultrabajo — gaming, social.
- **Sepolia** (421614): la testnet. Gratis. **La que vas a usar.**

## Arbiscan
El explorador de bloques. Ahí ves tu contrato, sus transacciones, y puedes verificar el
código fuente. **El entregable de smart contracts pide el link de Arbiscan.**

## Arbitrum Orbit
**Qué es:** lanzar **tu propia cadena L3** encima de Arbitrum.
**Qué hace:** te da una cadena dedicada donde controlas el gas, las reglas y el rendimiento.
GuardChain.ai lo usó para tener costos de procesamiento predecibles.
**Para el hackathon:** son días de trabajo. Descartado con 4 días.

---

# PARTE 2 — Las piezas famosas que el evento NO menciona

Nada de esto es necesario para competir. Sirve para entender el ecosistema y, sobre todo,
**para responder preguntas del jurado** (que es el 15% de Pitch y Demo).

## 🔧 Infraestructura interna

### Nitro
El motor que hace funcionar Arbitrum. Compila la EVM a WASM y ejecuta las transacciones.
Es la razón por la que Stylus fue posible: la infraestructura ya corría sobre WASM.

### ArbOS
El "sistema operativo" de la cadena. Gestiona el gas, los mensajes entre L1 y L2, y las
funciones propias de Arbitrum. Se actualiza por votación de la DAO.

### Sequencer
El componente que recibe tu transacción y decide el orden. Es lo que hace que Arbitrum se
sienta instantáneo: te da confirmación blanda en ~250ms, antes de publicar nada en Ethereum.
**Es el punto más centralizado de la arquitectura** — un tema recurrente en críticas a los L2.

### AnyTrust — la tecnología detrás de Nova
La diferencia real entre One y Nova:
- **Arbitrum One (Rollup):** *todos* los datos se publican en Ethereum. Seguridad heredada
  completa, sin supuestos de confianza extra. Más caro.
- **Arbitrum Nova (AnyTrust):** los datos los guarda un **Comité de Disponibilidad de Datos
  (DAC)** de 20 miembros, y solo se publica un resumen. Asume que al menos 2 son honestos.
  Si el comité falla, la cadena **cae automáticamente a modo Rollup** y sigue funcionando.
  Mucho más barato, con un supuesto de confianza adicional.

> Por eso Nova sirve para gaming y social: millones de transacciones micro donde el costo
> importa más que la garantía máxima.

### BoLD (Bounded Liquidity Delay) — ya en mainnet
**El problema que resuelve:** antes, solo un grupo autorizado podía validar la cadena y
disputar estados fraudulentos. Eso es un permiso, y los permisos son centralización.
**Qué hace:** permite que **cualquiera** corra un validador y desafíe una actualización
inválida, con un límite fijo de **7 días** para resolver disputas — protege contra ataques
de retraso, donde un atacante alarga las disputas indefinidamente.
**Por qué importa:** es lo que acerca a Arbitrum al estándar de descentralización que se
espera de un L2.

### Timeboost — ya en Arbitrum One y Nova
**El problema que resuelve:** el **MEV** (*Maximal Extractable Value*). Cuando el orden de
las transacciones se decide por quién paga más gas, los bots hacen *front-running* y
*sandwich attacks* — se meten antes y después de tu operación para extraerte valor.
**Qué hace:** en vez de una guerra de gas, hay una **subasta fuera de la cadena** por un
"carril express" de ordenamiento prioritario. Resultado: la cadena captura ese valor en vez
de que se lo lleven los bots, se reduce el spam, y **se protege al usuario del MEV dañino**.

### Retryable tickets
El mecanismo de mensajería L1→L2. Permite que una transacción en Ethereum dispare una acción
en Arbitrum de forma confiable, con reintentos si falla. Es la base del puente oficial.

### Precompilados
Contratos nativos en direcciones fijas que exponen funciones propias de Arbitrum:
`ArbSys` (número de bloque real de L2, mensajes a L1), `ArbGasInfo` (desglose de costos
L1/L2), `ArbAddressTable` (comprime direcciones para ahorrar calldata).

> Recordatorio de `04-arbitrum-conceptos.md`: `block.number` en Arbitrum devuelve el bloque
> de **L1**. Si necesitas el de L2, se pide a `ArbSys`. Es la trampa clásica.

## 🏛️ Gobernanza y dinero

### ARB y la Arbitrum DAO
**ARB** es el token de gobernanza (no se usa para pagar gas — el gas se paga en ETH).
La **Arbitrum DAO** vota las actualizaciones del protocolo y administra una de las tesorerías
más grandes de cripto.

### Programas de financiamiento
- **Arbitrum Foundation Grants** — subvenciones generales.
- **Questbook** — programa de grants con dominios temáticos.
- **Stylus Sprint** — 5M ARB, 17 proyectos financiados. El catálogo de lo que Arbitrum
  considera buen uso de Stylus (ver `11-investigacion-ganadores.md`).
- **Arbitrum Expansion Program** — para quienes lanzan cadenas Orbit.

> Relevante para tu pitch: si el proyecto tiene continuidad, **hay dinero real después del
> hackathon**. Mencionarlo en la slide de "siguiente paso" es un punto barato.

## 🏗️ RaaS — Rollup as a Service
Proveedores que lanzan tu cadena Orbit por ti sin que administres infraestructura:
**Caldera**, **Conduit**, **Gelato**. Existe, pero fuera de alcance aquí.

## 💰 Las dApps famosas de Arbitrum
Útil para ubicarte en el ecosistema y para responder "¿qué más hay acá?":

| Proyecto | Qué es |
|---|---|
| **GMX** | El DEX de perpetuos insignia de Arbitrum. Su éxito puso a Arbitrum en el mapa |
| **Camelot** | DEX nativo, el hub de liquidez para proyectos nuevos del ecosistema |
| **Pendle** | Tokeniza rendimientos futuros: separa el capital del interés y los negocia aparte |
| **Radiant** | Préstamos cross-chain |
| **Treasure** | Ecosistema de gaming, muy ligado a Nova |
| **Aave, Uniswap, Curve** | Los grandes de Ethereum, desplegados también en Arbitrum |

---

# Resumen: qué de todo esto te importa hoy

| Prioridad | Piezas |
|---|---|
| **Vas a usar** | Un scaffold, Arbitrum Sepolia, Arbiscan, wagmi/viem, Nitro devnode |
| **Vas a usar si eliges Stylus** | Stylus SDK, cargo-stylus, Docker |
| **Solo para responder al jurado** | Nitro, AnyTrust, BoLD, Timeboost, sequencer, precompilados |
| **Ignorar por ahora** | Orbit, RaaS, retryable tickets, `@arbitrum/sdk`, Cache Manager |

---

## Fuentes
- Cadenas públicas: https://docs.arbitrum.io/arbitrum-essentials/public-chains
- AnyTrust: https://docs.arbitrum.io/how-arbitrum-works/inside-anytrust
- Timeboost: https://docs.arbitrum.io/how-arbitrum-works/timeboost/gentle-introduction
- BoLD en mainnet: https://www.theblock.co/post/340278/offchain-labs-releases-arbitrum-bold-on-mainnet-for-permissionless-validation
- Glosario oficial: https://docs.arbitrum.io/intro/glossary
- Quickstart Stylus: https://docs.arbitrum.io/stylus/quickstart
