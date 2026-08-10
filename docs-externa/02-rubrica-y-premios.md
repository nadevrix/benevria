# Rúbrica de evaluación, categorías y premios

> ✅ **Discrepancia RESUELTA (2026-08-08).** La rúbrica que rige es la de
> **platform.ethlima.org** (la plataforma oficial de entrega y evaluación).
> La web pública `hackathon.ethlima.org` muestra una versión distinta y desactualizada.

---

## ✅ Rúbrica oficial (platform.ethlima.org)

| Criterio | Descripción | % |
|---|---|---|
| **Implementación Técnica** | Arquitectura, integración frontend↔contratos, buenas prácticas, funcionamiento general | **25%** |
| **Problema e Impacto** | Problema real, usuarios claramente identificados, impacto potencial | 20% |
| **Producto y Experiencia de Usuario** | MVP funcional, intuitivo, coherente | 20% |
| **Uso del Ecosistema Arbitrum** | Aprovecha significativamente One, Nova, **Stylus**, Orbit u otras herramientas, como parte esencial | 20% |
| **Pitch y Demo** | Claridad, demo funcional, propuesta de valor, **capacidad de responder preguntas del jurado** | **15%** |

### Desempate (orden explícito)
1. Implementación Técnica
2. Uso del Ecosistema Arbitrum
3. Problema e Impacto
4. Decisión final del jurado

### Lectura estratégica
- **Técnico + Arbitrum = 45%** y son los **dos primeros desempates**. Ahí se gana.
- **El pitch vale 15%, no es una nota al pie.** Merece ensayo real, no improvisación.
- "Capacidad para responder preguntas del jurado" está en la rúbrica: hay que anticipar
  la pregunta *"¿esto no funcionaría igual sin blockchain?"*.

<details>
<summary>Versión descartada (web pública de marketing) — solo por registro</summary>

Impacto del problema 20% · Innovación con Blockchain 15% · Implementación técnica 25% ·
Uso de Arbitrum 20% · Experiencia del Usuario 15% · Presentación Final 5%

No usar. La plataforma oficial manda.
</details>

---

## 🗂️ Categorías Oficiales del track

Son las opciones del campo "Categorías" del formulario de entrega. Se pueden combinar.

| Categoría | Qué incluye |
|---|---|
| **DeFi e Infraestructura Financiera** | DEXs, lending, borrowing, **remesas**, stablecoins, RWA, staking, yield, derivados |
| **Inteligencia Artificial y Tecnologías Emergentes** | **Agentes autónomos**, AI copilots, **automatización onchain**, ZK, interoperabilidad |
| **Aplicaciones Descentralizadas (dApps)** | SocialFi, GameFi, educación, identidad, DAOs, NFTs, ticketing, loyalty, account abstraction |

> Yendo al bounty Advanced (Stylus + IA), la categoría natural es
> **"IA y Tecnologías Emergentes"**.

---

## ⚠️ Regla explícita: "Uso real de blockchain"

Cita literal de la web:

> *"**No se evaluará favorablemente el uso superficial o innecesario de blockchain.**
> Los equipos deberán justificar por qué Arbitrum aporta valor a su solución y demostrar
> que la interacción con la red es una parte esencial del funcionamiento del proyecto, y
> no únicamente un componente agregado para cumplir con los requisitos de la competencia.
> Esto ayuda a evitar proyectos donde la blockchain no aporta una utilidad real."*

El anti-patrón está escrito como regla. **La pregunta "¿esto funcionaría igual sin blockchain?"
la va a hacer el jurado.** Hay que tener la respuesta preparada.

---

## Requisitos técnicos obligatorios (web)

1. Uso **verificable** de Arbitrum como **componente principal** de la solución.
2. **Evidencia en el repositorio** entregado (smart contracts, integraciones).
3. Para el bounty **Best Stylus Project**, el uso de Stylus debe ser **parte esencial de la lógica**.

> 🆕 "Best Stylus Project" es un bounty que no aparecía en el texto de bases. Confirmar.

## Requisitos para los premios generales (web)

- Desplegado en red compatible con Arbitrum (One, Sepolia u otra habilitada).
- **Al menos un smart contract desplegado y funcional.**
- **MVP funcional** que demuestre el caso de uso.
- Toda la documentación entregada antes de la fecha límite.
- Cumplir las reglas.
- Equipos de hasta 4 integrantes.

> *"Los proyectos que no cumplan estos requisitos podrán participar en actividades de la
> hackathon, pero **no serán elegibles para los premios generales**."*

---

## 💰 Premios

| Fuente | Estado |
|---|---|
| Portada del sitio + texto de bases | **+$2,000** — 🥇 Primer lugar, 🥈 Segundo lugar |
| Pestaña "Premios" del track (2026-08-08) | **"Por anunciar [PRONTO]"** |

El desglose exacto todavía no está publicado.

---

## 🎯 Bounties — **preliminares**

Cita literal de la web:

> *"Además de los premios generales, existirán bounties patrocinados por el ecosistema
> Arbitrum. **Cada bounty tendrá requisitos técnicos específicos que serán publicados
> oportunamente.** De manera **preliminar**, las categorías incluyen:"*

| Nivel | Descripción (web) |
|---|---|
| **Advanced** | Desarrollo utilizando **Scaffold-Stylus** e integración de funcionalidades de **Inteligencia Artificial** |
| **Intermediate** | Desarrollo utilizando **Scaffold-Stylus** |
| **Basic** | Desarrollo utilizando **Scaffold-ETH** |

### Requisitos detallados (del texto de bases — pueden cambiar)

**🟢 Basic — Scaffold-ETH**
- Scaffold-ETH como base · ≥1 contrato en red compatible Arbitrum · interacción real con el frontend
- *Evalúan:* integración con Scaffold-ETH, calidad del contrato, funcionalidad del MVP, UX

**🟡 Intermediate — Scaffold-Stylus**
- Scaffold-Stylus como base · ≥1 contrato **Stylus (Rust)** desplegado · interacción completa
- *"Se valorará el aprovechamiento de las capacidades de Stylus más allá de una implementación trivial"*
- *Evalúan:* uso correcto de Stylus, arquitectura, calidad del código, innovación del caso de uso

**🔴 Advanced — Scaffold-Stylus + IA**
- Todo lo de Intermediate **+** IA como **parte esencial del flujo** (no decorativa), demostrada en el demo
- La IA debe aportar: análisis, generación, clasificación, agentes, recomendaciones
- *Evalúan:* integración IA+blockchain, originalidad, complejidad técnica, calidad, potencial de adopción

> ⚠️ **Ninguno de los tres niveles es obligatorio en sí.** Hay que cumplir **uno**.
> Los tres compiten por los premios generales. Ver `15-ecosistema-arbitrum-completo.md`.

---

## ⚠️ NO confundir con las rutas de Formación

Existen **dos** secciones llamadas "Formación", en sitios distintos, con distinto número
de niveles. **Ninguna de las dos es de competencia** — son material de estudio.
No se eligen, no se evalúan, no hay que completarlas.

### Versión A — web pública del track (4 niveles)
| Nivel | Contenido |
|---|---|
| 01 **Principiante** | Intro a Arbitrum, tutorial del puente, Portal de Arbitrum |
| 02 **Intermedio** | Layer3 (misiones), L2BEAT (panel de seguridad), Arbiscan |
| 03 **Avanzado** | Solidity Quickstart en Remix, Foundry en Arbitrum |
| 04 **Experto** | **Stylus Rust Quickstart**, Stylus Rust SDK (referencia completa) |

### Versión B — plataforma oficial (3 niveles)
| Nivel | Contenido |
|---|---|
| 1 **Fundamentos** | Introducción a Blockchain, Solidity Básico, Tu Primer Smart Contract |
| 2 **Intermedio** | Patrones de Smart Contracts, Seguridad en Solidity, Hardhat y Herramientas |
| 3 **Avanzado** | Patrones Avanzados, Optimización de Gas, Cross-Chain y L2 |

Más los **Bootcamp 25 y Bootcamp 26** (videos por módulos: Solidity, Rust, Scaffold-ETH,
Scaffold-Stylus, Stylus/Rust deployment, etc.).

### ⚠️ La confusión a evitar
Los nombres coinciden con los bounties pero **no tienen relación**:

| | Formación | Bounties |
|---|---|---|
| Qué es | Material que **estudias** | Nivel que **construyes** |
| Niveles | 4 (web) o 3 (plataforma) | Siempre **3**: Basic / Intermediate / Advanced |
| ¿Se evalúa? | No | **Sí** |
| "Avanzado"/"Experto" | Tutoriales de Solidity / Stylus | Scaffold-Stylus (+IA) |

---

## Fuente
https://hackathon.ethlima.org/es/tracks/arbitrum-track/ (pestañas Detalles del Track,
Premios, Etapas, Reglas) — consultado 2026-08-08
