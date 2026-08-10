# Briefing de ideación — todo lo necesario para diseñar la idea ganadora

Documento único de consulta para crear el concepto. Consolida y amplía el resto de la doc.

---

# 1. El track en una página

**Un solo track: Arbitrum.** Todos los participantes compiten por el mismo pozo (+$2,000,
🥇 y 🥈). No hay track alternativo.

**El reto, literal:** *"Presenta un proyecto para cualquier industria o sector que implemente
tecnologías del ecosistema Arbitrum para resolver un problema real o crear una nueva
oportunidad de valor. La solución deberá materializarse en una dApp funcional, con una
propuesta clara, una implementación técnica sólida y un MVP listo para ser demostrado."*

### Las 3 categorías oficiales (campo del formulario, combinables)
| Categoría | Incluye |
|---|---|
| **DeFi e Infraestructura Financiera** | DEXs, lending, borrowing, **remesas**, stablecoins, RWA, staking, yield, derivados |
| **IA y Tecnologías Emergentes** | **Agentes autónomos**, AI copilots, **automatización onchain**, ZK, interoperabilidad |
| **Aplicaciones Descentralizadas** | SocialFi, GameFi, educación, identidad, DAOs, NFTs, ticketing, loyalty, account abstraction |

→ Yendo a Advanced (Stylus + IA), **"IA y Tecnologías Emergentes"** es la categoría natural.
Se puede combinar con otra si el caso de uso lo justifica.

### La rúbrica (plataforma oficial — la que manda)
| Criterio | % |
|---|---|
| Implementación Técnica | **25%** |
| Problema e Impacto | 20% |
| Producto y UX | 20% |
| Uso del Ecosistema Arbitrum | 20% |
| Pitch y Demo | 15% |

**Desempate:** Técnica → Arbitrum → Impacto → jurado.

---

# 2. Qué exige exactamente el bounty Advanced

> **Advanced — Scaffold-Stylus + IA**
> *Objetivo: desarrollar aplicaciones que combinen contratos Stylus con funcionalidades
> impulsadas por Inteligencia Artificial.*

### Requisitos mínimos
1. Cumplir **todos** los requisitos del Intermediate:
   - Al menos un smart contract desarrollado con **Stylus** mediante **Scaffold-Stylus**
   - Desplegado en una red compatible con Arbitrum
   - La aplicación demuestra **interacción completa** con el contrato Stylus
   - *"Se valorará el aprovechamiento de las capacidades de Stylus **más allá de una
     implementación trivial**"*
2. Integrar una funcionalidad de IA que forme **parte esencial del flujo** del proyecto
3. La IA debe aportar funcionalidad **relevante** — análisis, generación, clasificación,
   agentes, recomendaciones — y **no ser únicamente decorativa**
4. La interacción entre la IA y la aplicación debe estar **claramente demostrada durante el demo**

### Cómo se evalúa el bounty
| Criterio | Qué significa en la práctica |
|---|---|
| **Integración efectiva entre IA y blockchain** | No que convivan: que se necesiten mutuamente |
| **Originalidad de la solución** | Que no sea el enésimo scoring crediticio |
| **Complejidad técnica** | Que el contrato Stylus haga algo difícil |
| **Calidad de la implementación** | Que funcione, con código limpio |
| **Potencial de adopción e impacto** | Que alguien lo usaría de verdad |

### 🔑 La prueba de fuego de la IA
La pregunta que decide si tu IA es "esencial" o "decorativa":

> **Si quito la IA, ¿el producto sigue funcionando igual?**
> Si la respuesta es sí → es decorativa → pierdes el bounty Advanced.

Patrones **decorativos** (evitar): un chatbot lateral que explica la app · un resumen
generado que nadie lee · autocompletar un formulario · un "asistente" opcional.

Patrones **esenciales**: la IA **produce el dato** que el contrato consume · la IA **decide**
algo que dispara una transacción · el contrato **verifica** o **puntúa** la salida de la IA ·
un agente autónomo que opera on-chain sin humano.

### 🔑 La prueba de fuego de Stylus
> **Completa esta frase: "usamos Stylus porque hacer esto en Solidity sería ______"**

Si no puedes completarla con algo concreto (imposible / carísimo / inviable por gas),
tu contrato es trivial y pierdes en "Uso del Ecosistema" y en el bounty.

---

# 3. Obligatorio vs. no obligatorio (versión ideación)

## 🔴 Obligatorio — condiciona la idea
| Requisito | Cómo limita la idea |
|---|---|
| ≥1 smart contract **desplegado y funcional** en red Arbitrum | La idea debe tener algo que valga la pena poner on-chain |
| **Interacción real** frontend ↔ contrato, demostrable | Debe haber un flujo de usuario que escriba en la cadena |
| Arbitrum como **componente principal**, uso **verificable** | La blockchain no puede ser un adorno |
| **MVP funcional** que demuestre el caso de uso | El alcance debe caber en 4 días |
| Scaffold-Stylus + contrato Rust + IA esencial | Define el stack, no la idea |
| Repo público con instrucciones | — |
| Los 7 entregables | Presupuestar ~4-5 h al final |

## ⚠️ Regla explícita sobre uso real de blockchain
> *"No se evaluará favorablemente el uso superficial o innecesario de blockchain. Los equipos
> deberán justificar **por qué Arbitrum aporta valor** a su solución y demostrar que la
> interacción con la red es una **parte esencial del funcionamiento**, y no únicamente un
> componente agregado para cumplir con los requisitos de la competencia."*

**El jurado va a preguntar: "¿esto no funcionaría igual con una base de datos?"**
La idea debe tener la respuesta incorporada, no improvisada.

## 🟢 NO obligatorio — libertad total
- **Cualquier industria o sector** (literal en las bases)
- **Cualquier país o problema** — no tiene que ser peruano ni local
- Desplegar en **testnet** (Arbitrum Sepolia) — permitido explícitamente, gratis
- Usar librerías, frameworks, APIs, modelos de IA open source (citándolos)
- Base de datos off-chain (Postgres)
- Que el proyecto sea nuevo o continuación (si la mejora es sustancial y verificable)
- Equipo de 1 persona

---

# 4. Herramientas enseñadas en el evento

| Herramienta | Qué hace | Rol en tu proyecto |
|---|---|---|
| **Scaffold-Stylus** | Monorepo: Next.js + RainbowKit + Wagmi + Foundry + Stylus. Trae contract hot reload, burner wallet y faucet local | **Base obligatoria** del bounty |
| **Scaffold-ETH 2** | Igual pero con Solidity | Solo para bounty Basic |
| **Arbitrum Stylus** | Segunda VM (WASM) junto a la EVM. Contratos en Rust/C/C++ interoperables con Solidity | **El diferenciador** |
| **Stylus SDK (Rust)** | `#[storage]`, `#[public]`, `#[entrypoint]` | Cómo escribes el contrato |
| **cargo-stylus** | `new` · `check` · `deploy` · `export-abi` | Todo el ciclo de despliegue |
| **Nitro devnode** | Nodo local pre-fondeado, RPC `localhost:8547` | Iterar sin gastar ni esperar faucet |
| **Arbitrum Sepolia** | Testnet, chainId 421614 | Donde despliegas |
| **Arbiscan** | Explorador | Entregable obligatorio |
| **Arbitrum One / Nova** | Mainnets | No las necesitas |
| **Orbit** | Tu propia L3 | Fuera de alcance (días de trabajo) |

**Formación del evento (material de estudio, no competencia):**
01 Principiante · 02 Intermedio · 03 Avanzado (Solidity/Remix/Foundry) ·
04 **Experto** (Stylus Rust Quickstart + Stylus Rust SDK) ← el que te toca.

---

# 5. 🔥 Tecnología TOP **exclusiva de Arbitrum** no nombrada en el evento

**Filtro aplicado: solo cosas que existen únicamente en Arbitrum.** Nada de ERC-4337,
ZK genérico, The Graph, Chainlink u otros estándares de Ethereum — esos no suman en el
20% de "Uso del Ecosistema".

## 5.1 Los precompilados — contratos nativos en direcciones fijas

Son **exclusivos de Arbitrum** y muy poco usados en hackathons. Usar uno con criterio es
una señal fuerte de dominio del ecosistema.

| Precompilado | Dirección | Qué hace | Qué habilita en una idea |
|---|---|---|---|
| **ArbSys** | `0x64` | Funciones de sistema: número de bloque **real de L2**, envío de mensajes L2→L1 | Timestamps y bloques correctos; comunicación hacia Ethereum |
| **ArbGasInfo** | `0x6c` | Desglose de precios de gas (componente L1 y L2) | Mostrar al usuario el costo real; optimizar dinámicamente; UX de "esto te costó $0.003" |
| **ArbAddressTable** | `0x66` | **Comprime direcciones**: registra una dirección y luego la referencias por un índice corto | Ahorro real de calldata en apps con muchas direcciones repetidas. Muy poco explotado |
| **ArbWasm** | `0x71` | **Gestiona contratos Stylus** (activación) | El corazón de Stylus |
| **ArbWasmCache** | `0x72` | **Gestiona la caché de Stylus** | Ver 5.2 |
| **ArbRetryableTx** | `0x6e` | Gestiona *retryables* (mensajes L1→L2 con reintento) | Flujos que empiezan en Ethereum y terminan en Arbitrum |
| **ArbInfo** | `0x65` | Info de cuentas | Consultas de estado |
| **ArbOwner** | `0x70` | Administración de la cadena (solo chain owner) | Solo relevante en Orbit |
| **ArbOwnerPublic** | `0x6b` | Info pública de chain owners | — |
| **ArbAggregator** | `0x6d` | Configuración de agregación de transacciones | — |
| **ArbNativeTokenManager** | `0x73` | Acuñar/quemar el token de gas nativo (ArbOS 41+) | Solo en Orbit con gas token propio |
| **ArbStatistics** | `0x6f` | Estado pre-Nitro | Histórico |
| **ArbDebug** | `0xff` | Herramientas de prueba | Desarrollo |

> ⚠️ Recordatorio: en Arbitrum `block.number` devuelve el bloque de **L1**. El de L2 se
> pide a `ArbSys`. Demostrar que lo sabes es un punto técnico gratis.

## 5.2 Activación y caché de Stylus — la capa que casi nadie usa

Un contrato Stylus no se despliega y ya: pasa por **activación**, donde el WASM se compila
al código máquina nativo del nodo y se le añaden las verificaciones de seguridad (medición
de gas, control de profundidad, cobro de memoria). Ese paso se registra vía **ArbWasm**.

Y luego está el **CacheManager**:
- Mantiene contratos **en memoria** en vez de leerlos de disco
- Reduce drásticamente el **costo de inicialización** en cada llamada
- Los contratos **compiten por espacio** en la caché mediante un sistema de pujas
- **Solo entran por llamada explícita** al CacheManager — acceder a un contrato no lo cachea
- Si sale de la caché, llamarlo vuelve a ser más caro

**Qué habilita:** una idea con muchas llamadas repetidas al mismo contrato pesado puede
argumentar caching como parte de su diseño de costos. Es un nivel de detalle que casi
ningún proyecto de hackathon toca.

## 5.3 Timeboost — subasta de ordenamiento (exclusivo de Arbitrum)

Ya vivo en Arbitrum One y Nova. Cambia la guerra de gas por una **subasta fuera de cadena**
por un "carril express" de ordenamiento prioritario. Protege al usuario del MEV dañino
(*front-running*, *sandwich attacks*) y hace que la cadena capture ese valor.

**Qué habilita:** cualquier idea donde el **orden de las transacciones importe** — subastas,
mercados, asignación de recursos escasos, ticketing, drops. Poder decir "diseñamos para
Timeboost" es un argumento de ecosistema muy poco visto.

## 5.4 Orbit / Arbitrum Chains — tu propia L3

Lanzar una cadena propia sobre Arbitrum, con control de gas, reglas y rendimiento.
Incluye la opción de **token de gas personalizado** (pagar el gas en tu propio token).

**Qué habilita:** costos predecibles y gas en moneda propia. GuardChain.ai ganó $10k con esto.
**Fuera de alcance para 4 días**, pero mencionarlo como *roadmap* en el pitch suma visión.

## 5.5 AnyTrust y el Comité de Disponibilidad de Datos (Nova)

En **Arbitrum One** todos los datos van a Ethereum (seguridad completa, más caro).
En **Nova**, un **DAC de 20 miembros** guarda los datos y solo se publica un resumen —
asume al menos 2 honestos, y si falla **cae automáticamente a modo Rollup**.

**Qué habilita:** ideas con **volumen masivo de transacciones micro** — gaming, social,
telemetría, IoT, check-ins — donde el costo por transacción importa más que la garantía máxima.

## 5.6 BoLD — validación sin permisos

Cualquiera puede correr un validador y desafiar estados inválidos, con tope de 7 días
para resolver disputas. **Qué habilita:** el argumento de descentralización real cuando el
jurado pregunte por las garantías de seguridad de un L2.

## 5.7 Nitro, ArbOS y el Sequencer

**Nitro** es el motor (compila la EVM a WASM — por eso Stylus fue posible).
**ArbOS** es el sistema operativo de la cadena.
**El Sequencer** ordena las transacciones y da confirmación blanda en **~250 ms** —
antes de publicar nada en Ethereum.

**Qué habilita:** UX de **respuesta casi inmediata**. Ideas que requieren interacción fluida
(juegos, chat, subastas en vivo, colaboración) pueden apoyarse en esa latencia.

## 5.8 Interoperabilidad EVM ↔ WASM

Un contrato Stylus puede llamar a uno de Solidity y viceversa, compartiendo estado y
direcciones. **Qué habilita:** arquitectura híbrida — Solidity para la lógica estándar
(tokens, permisos) y Stylus solo para el núcleo de cómputo pesado. Es un argumento de
arquitectura elegante que se ve muy bien en la nota técnica.

## 5.9 Retryable tickets

Mensajería confiable L1→L2 con reintentos. **Qué habilita:** flujos que arrancan en Ethereum
y se completan en Arbitrum.

---

## 📋 Tabla resumen: qué capacidad de Arbitrum habilita qué tipo de idea

| Si tu idea necesita… | Usa | Argumento de ecosistema |
|---|---|---|
| Cómputo pesado, matemática, criptografía | **Stylus** | *"en Solidity es impagable"* |
| IA/algoritmo corriendo dentro del contrato | **Stylus** | *"el modelo decide on-chain"* |
| Verificar muchas firmas o pruebas en lote | **Stylus** | *"validación intensiva de datos"* |
| Muchísimas transacciones baratas | **Nova / AnyTrust** | *"costo por transacción de céntimos"* |
| Que el orden de transacciones importe | **Timeboost** | *"protegemos al usuario del MEV"* |
| Muchas direcciones repetidas | **ArbAddressTable** | *"comprimimos calldata"* |
| Mostrar/optimizar costos reales | **ArbGasInfo** | *"transparencia de costos al usuario"* |
| Tiempo/bloque correcto o mensajes a L1 | **ArbSys** | *"usamos el precompilado, no `block.number`"* |
| Llamadas repetidas a contrato pesado | **CacheManager** | *"diseñamos el costo de inicialización"* |
| Costos predecibles a escala | **Orbit** (roadmap) | *"cadena dedicada"* |
| Respuesta inmediata en la UI | **Sequencer ~250ms** | *"confirmación blanda"* |

---

# 6. El criterio de Impacto — qué vale y qué juega a tu favor

## 6.1 Qué mide exactamente

> **Problema e Impacto (20%):** *"El proyecto aborda un problema **real**, **identifica
> claramente a sus usuarios** y demuestra un **impacto potencial**."*

Tres exigencias separadas. Casi todos los proyectos fallan en la segunda:

| Exigencia | Cómo se demuestra | Error típico |
|---|---|---|
| **Problema real** | Datos, cifras, fuentes verificables | "la gente necesita más transparencia" |
| **Usuarios identificados** | Un grupo nombrable y acotado | "todos los que usen internet" |
| **Impacto potencial** | Magnitud cuantificada, aunque sea estimada | "puede revolucionar la industria" |

**La regla:** si no puedes nombrar a **una persona concreta** que usaría esto mañana,
el criterio está perdido.

## 6.2 Qué impacto valoró este jurado antes

Los 4 ganadores de ETH Lima 2025 y su usuario:

| Proyecto | Usuario nombrable |
|---|---|
| Ocean Sense Network 🥇 | Pescadores artesanales del litoral |
| Colectiva 🥈 | Comerciantes de mercado |
| Semilla Microlending 🥇 | Comunidades y ONGs sin acceso a crédito |
| Turi 🥈 | Turistas y negocios locales |

**Patrón:** población **económicamente vulnerable o excluida del sistema formal**, con un
intermediario de confianza que la blockchain elimina. Ninguno fue un primitivo DeFi global.

**Tema saturado:** scoring crediticio para informales. Ya hubo 3 proyectos (Semilla, Haku
Finance, Chambita$). Entrar ahí es competir contra un ganador previo.

## 6.3 🎯 Tu ventaja de impacto — la que nadie más tiene

**Eres boliviano, vives en Santa Cruz, y Bolivia atraviesa una crisis económica documentada.**
Eso te da acceso de primera mano a un problema que la mayoría de los participantes solo
puede investigar en Google. La rúbrica premia *"identifica claramente a sus usuarios"* —
y eso se nota cuando hablas de algo que vives.

### Datos duros verificables (contexto boliviano 2026)

| Dato | Cifra | Fuente |
|---|---|---|
| Contracción del PIB 2026 (proyectada) | **-3,2%** | Bloomberg Línea |
| Contracción 2025 | -2,1% | Bloomberg Línea |
| Contracción 2024 | -3,1% | Bloomberg Línea |
| **Tres años consecutivos de decrecimiento** | — | — |
| Escasez de dólares | Desde **2024**, disparó la cotización paralela | Varios |
| **Remesas ene–may 2026** | **$460 millones** | El Deber |
| Exportaciones de gas ene–may 2026 | **$283,8 millones** | El Deber |

> 🔑 **El dato más potente:** *Bolivia recibe más dólares por remesas de sus ciudadanos en
> el exterior que por exportar su principal recurso natural.* Es un cambio histórico en la
> estructura de ingreso de divisas — y un síntoma de una economía que genera cada vez menos
> oportunidades internas.

Ese tipo de cifra, dicha en el primer slide, ancla el criterio de impacto de inmediato.

### Otros vectores de contexto disponibles
- Alta **informalidad** económica y dolarización informal
- Restricciones cambiarias y sistema de remesas intervenido
- **Remesas** aparece explícitamente en la categoría oficial *DeFi e Infraestructura Financiera*

### ⚠️ Advertencias
1. **No es obligatorio que el problema sea local.** Es una ventaja competitiva, no una regla.
2. **Ni "local" significa Lima.** El hackathon convoca a toda Latinoamérica y el formulario
   pide "País de representación". Bolivia es plenamente legítimo.
3. Si eliges un problema boliviano, **muestra por qué aplica a LATAM** — amplía el impacto
   potencial sin perder la credibilidad de conocerlo de cerca.
4. **No fuerces la conexión.** Un problema global bien fundamentado vence a uno local forzado.

## 6.4 A quién le estás hablando

**Tonio Romero — Evaluador Técnico.** Founder de Osom.biz · **IBM AI Engineering
Professional** · Cofundador de ETH Kipu · Ex-líder de Ethereum Lima · Profesor de Posgrado
UCEMA · Ejecutivo con experiencia en **Control y Finanzas**.

Implicaciones directas para la idea:
- **Certificación en IA** → evaluará la IA con criterio técnico. Una IA decorativa no pasa.
- **Control y Finanzas** → responde bien a impacto **cuantificado en dinero**: cuánto se
  ahorra, cuánto se pierde hoy, cuál es el tamaño del mercado.
- **Ex-líder de Ethereum Lima** → conoce el ecosistema local y detecta proyectos inflados.

Hay **3 evaluadores técnicos de 4 jurados**. La nota técnica no es simbólica.

---

# 7. ✅ Validador de idea

Pasa cada candidata por esto. Si falla alguna de las cinco primeras, descártala.

### Las 5 preguntas eliminatorias
| # | Pregunta | Si la respuesta es… |
|---|---|---|
| 1 | ¿Puedo nombrar al usuario concreto que lo usaría mañana? | No → **descartar** |
| 2 | ¿Funcionaría igual con una base de datos normal? | Sí → **descartar** (regla explícita del track) |
| 3 | "Usamos Stylus porque en Solidity esto sería ___" ¿puedo completarla? | No → contrato trivial → **descartar** |
| 4 | Si quito la IA, ¿el producto sigue igual? | Sí → IA decorativa → **pierdes Advanced** |
| 5 | ¿Cabe un MVP demostrable en 4 días trabajando solo? | No → **recortar o descartar** |

### Las 5 preguntas de puntaje
| # | Pregunta | Criterio que sube |
|---|---|---|
| 6 | ¿Tengo un dato duro que dimensione el problema? | Impacto 20% |
| 7 | ¿El flujo completo se demuestra en 2 minutos de video? | Producto/UX 20% + Pitch 15% |
| 8 | ¿Uso alguna capacidad de Arbitrum además de Stylus? (precompilado, Nova, Timeboost…) | Arbitrum 20% |
| 9 | ¿La arquitectura se explica en un diagrama simple? | Técnica 25% |
| 10 | ¿Es distinta de los 20 proyectos de 2025 y del tema saturado (scoring crediticio)? | Originalidad del bounty |

### Plantilla para fijar el concepto
```
PROBLEMA:   ____ le pasa a ____ , y hoy cuesta ____ (dato duro)
USUARIO:    ____ (nombrable, acotado)
SOLUCIÓN:   una dApp que ____
ON-CHAIN:   el contrato guarda/verifica/calcula ____ porque ____
POR QUÉ STYLUS: en Solidity esto sería ____
ROL DE LA IA:   la IA ____ , y sin ella el producto ____ (no funciona / pierde el núcleo)
EXTRA ARBITRUM: además usamos ____ (precompilado / Nova / Timeboost / caching)
DEMO EN 2 MIN:  el usuario entra, ____ , ____ , y ve ____
```

---

## Fuentes
- Plataforma oficial: platform.ethlima.org (requiere login)
- Track público: https://hackathon.ethlima.org/es/tracks/arbitrum-track/
- Precompilados: https://docs.arbitrum.io/arbitrum-essentials/precompiles/reference
- Activación Stylus: https://docs.arbitrum.io/stylus/concepts/activation
- Caché de contratos: https://docs.arbitrum.io/stylus/how-tos/caching-contracts
- Timeboost: https://docs.arbitrum.io/how-arbitrum-works/timeboost/gentle-introduction
- AnyTrust: https://docs.arbitrum.io/how-arbitrum-works/inside-anytrust
- Bolivia PIB 2026: https://www.bloomberglinea.com/latinoamerica/bolivia/por-que-bolivia-se-mantendra-en-recesion-en-2026-pese-a-las-reformas-del-gobierno/
- Remesas vs. gas: https://eldeber.com.bo/dinero/bolivia-recibe-dolares-remesas-exterior-exportacion-gas_1785879573
