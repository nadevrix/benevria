# Investigación: qué gana en hackathons de Arbitrum

Recopilado el 2026-08-07 de fuentes públicas. Objetivo: entender el patrón, no copiar ideas.

---

## A) Lo más relevante: ETH Lima 2025 (edición anterior, mismo organizador)

**Escala:** +25 proyectos, +80 asistentes, formato híbrido.
**Tracks 2025:** Starknet y Scroll (dos tracks). En 2026 solo hay Arbitrum.

### Ganadores 2025

| Track | Puesto | Proyecto | Qué hace |
|---|---|---|---|
| Starknet | 🥇 1° | **Ocean Sense Network** | DePIN que democratiza el monitoreo oceánico en la costa peruana con boyas IoT operadas por **pescadores artesanales** |
| Starknet | 🥈 2° | **Colectiva** | Agrupa comerciantes para comprar directo a mayoristas: precios antes imposibles, inversión protegida, decisiones colectivas |
| Scroll | 🥇 1° | **Semilla Microlending** | Plataforma de micropréstamos donde comunidades, ONGs y negocios crean sus propios fondos de préstamo |
| Scroll | 🥈 2° | **Turi** | Recompensa a turistas según su reputación por visitar sitios turísticos de Perú y LATAM |

### 🔑 El patrón, que es imposible de ignorar

**Los cuatro ganadores son problemas peruanos/latinoamericanos concretos, con un usuario
que se puede nombrar con cara y nombre:** pescadores artesanales, comerciantes de mercado,
comunidades sin acceso a crédito, turistas.

Ninguno es un primitivo DeFi global. Ninguno es "un DEX", "un lending protocol genérico",
"un marketplace de NFTs". Este jurado premia **impacto local visible**.

Además: jurado con roles separados — hubo *Technical Judges* explícitos (Arturo Mena,
Javier Arteaga) además de jurados de negocio. La nota técnica no es simbólica.

---

## B) Hackathons de Arbitrum a nivel global — ganadores top

### Arbitrum Open House · Bengaluru Hacker House (India)
*Criterios declarados: calidad del equipo, alineación con Arbitrum, ejecución técnica,
product-market fit e innovación.*

| Puesto | Proyecto | Qué hace | Cómo usó Arbitrum |
|---|---|---|---|
| 🥇 $40,000 | **Orbital AMM Protocol** | AMM que soporta miles de stablecoins en un solo pool, extendiendo liquidez concentrada a dimensiones superiores | **Capa matemática de alta precisión en Stylus** para computar invariantes multi-activo a alta velocidad + segmentación de órdenes |
| 🥈 $20,000 | **Shinobi.Cash** | Pools de privacidad cross-chain: depositas en cualquier EVM, retiras privadamente en otra, con un solo despliegue en Arbitrum | Paymasters de account abstraction en Arbitrum + circuitos ZK vía Open Intent Framework |
| 🥉 $10,000 | **GuardChain.ai** | Seguros con reclamos on-chain para **trabajadores gig y grupos de autoayuda en India**, combinando asistencia de IA con transparencia on-chain | Cadena **Orbit** dedicada a seguros para costos de procesamiento predecibles |

**Buildathon online (mismo programa):** 🥇 Plexi (vault ERC-4626 componible), 🥈 Orbital, 🥉 TriggerX (protocolo de automatización descentralizada).

### Otros ganadores documentados

| Proyecto | Evento | Qué lo hizo ganar |
|---|---|---|
| **Stylish Stylus** (🥇 $4,000) | ETHIndia, track Arbitrum Stylus | Añadió soporte de **Zig** a Stylus + un IDE/Playground para crear y desplegar contratos |
| **RayStylus** (🥈) | Arbitrum Stylus Mini Hackathon APAC | *"Primer motor de ray tracing on-chain del mundo, en Rust"* |
| **ArbitrumOnchainAgent** | ETHGlobal Agentic Ethereum | Agente de IA que corre **on-chain** usando Q-learning (aprendizaje por refuerzo) dentro de un contrato Stylus |

### Premios ETHGlobal en el track Stylus (referencia de categorías)
Best Stylus Project ($4,000 + $1,000 runner-up), Best Library/Framework, Most Original,
Best Technology. Priorizan proyectos WASM y **dev tooling**.

---

## C) Qué financia Arbitrum con dinero real: el Stylus Sprint

17 proyectos seleccionados de un pozo de 5M ARB. Sirve como catálogo de "lo que Arbitrum
considera buen uso de Stylus":

| Categoría | Proyectos |
|---|---|
| **Dev tooling** | Thirdweb Stylus Integration, Remix IDE for Stylus, SDK AssemblyScript→WASM, GUI del Cache Manager, Walnut (debugging), Arbos-foundry |
| **Privacidad** | DeBid/Fairblock (subastas de puja sellada), Enclave (operaciones privadas sobre datasets) |
| **Oráculos** | RedStone Oracles (versión Rust para reducir costos) |
| **Finanzas** | Surety Protocol (fondos on-chain respaldados por reservas fiat multi-moneda) |
| **Identidad** | Passport XYZ (consolidación de pruebas de ID, resistencia Sybil) |
| **Analítica** | Open Source Observer |
| **IA / mercados de predicción** | Angel (agentes de IA en framework Rust), 9 Lives (mercado de predicción movido por agentes de IA) |
| **Seguridad** | Stateful Fuzzing de Trail of Bits (fuzzing mixto EVM+Stylus) |
| **Migración / educación** | StylusPort (migrar proyectos de Solana a Stylus), Stylus Saturdays |

---

## D) Qué dice Arbitrum sobre combinar IA + Stylus

Del blog oficial (*"AI and Stylus: The Builder's New Toolkit"*):

**Casos de uso que destacan:**
1. **Infraestructura de IA on-chain**: Stylus habilita tareas *compute-heavy* que son
   "impracticables en Solidity" — citan textualmente: **algoritmos de scoring de reputación,
   verificación de pruebas, operaciones de registro complejas y validación intensiva de datos**.
2. **Agent commerce**: sistemas autónomos que transaccionan sin intervención humana.
3. **Asistencia al desarrollador**: IA que genera código Stylus con contexto del SDK.

**Proyectos que nombran:**
- **ERC-8004** — registro de agentes desplegado en Arbitrum One, usa Stylus para
  *algoritmos de scoring de reputación* que serían ineficientes en la EVM.
- **x402 Protocol** — inferencia de IA medida con liquidación automática por lotes en USDC
  (pagos máquina-a-máquina).

---

## E) Conclusiones accionables

1. **El "por qué Stylus" debe caber en una frase.** Todos los ganadores técnicos la tienen:
   *"matemática de alta precisión imposible en Solidity"*, *"ray tracing on-chain"*,
   *"Q-learning dentro del contrato"*, *"scoring de reputación que la EVM no aguanta"*.
   Si no puedes completar la frase "usamos Stylus porque en Solidity esto sería ___",
   el contrato es trivial.

2. **En ETH Lima el impacto local pesa más que en un hackathon global.** Los ganadores
   globales son primitivos DeFi sofisticados; los de Lima son problemas peruanos. Este
   hackathon es de Lima. El combo ganador plausible: **problema peruano concreto +
   contrato Stylus con justificación técnica real**.

3. **GuardChain.ai (3° global) es el molde más parecido a lo que aquí funcionaría:**
   problema social local (trabajadores gig en India) + IA + tecnología específica de
   Arbitrum (Orbit). Mismo esqueleto que premió el jurado de Lima en 2025.

4. **Dev tooling es una categoría subestimada.** Tanto ETHGlobal como el Stylus Sprint
   premian herramientas para desarrolladores. Menos competencia, pero encaja peor con
   la rúbrica de Lima, que pide "problema real" y "usuarios identificados".

5. **La competencia es pequeña.** ~25 proyectos en 2025, y un solo track en 2026 concentra
   a todos. Un proyecto bien ejecutado y bien presentado tiene probabilidades reales.

---

## Fuentes

- Sitio oficial: https://hackathon.ethlima.org · recap 2025: https://hackathon.ethlima.org/2025/
- Arbitrum Open House Bengaluru (recap con ganadores): https://blog.arbitrum.foundation/arbitrum-open-house-india-concludes-with-bengaluru-hacker-house-full-recap/
- AI and Stylus, The Builder's New Toolkit: https://blog.arbitrum.foundation/ai-and-stylus-the-builders-new-toolkit/
- Stylus Sprint Recipients: https://blog.arbitrum.io/stylus-sprint-recipients/
- ETHGlobal, premios Arbitrum: https://ethglobal.com/events/istanbul/prizes/arbitrum
- Stylus Blitz Hackathon: https://arbitrumfoundation.medium.com/welcome-to-the-stylus-blitz-hackathon-0d8b27e0c057
- Ejemplo de agente on-chain en Stylus: https://github.com/hammertoe/ArbitrumOnchainAgent
