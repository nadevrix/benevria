# Qué es OBLIGATORIO, qué es RECOMENDADO y qué es PERMITIDO

Separación explícita de las tres categorías. Fuente: bases oficiales del track Arbitrum
y sitio del hackathon (hackathon.ethlima.org).

---

## 🔴 OBLIGATORIO — si falta, te descalifican o no puedes puntuar

### Del proyecto
| # | Requisito | Nota |
|---|---|---|
| 1 | Ser desarrollado **durante** el hackathon | Primer commit ≥ 31 jul, 4:00 p.m. |
| 2 | **Desplegado** en Arbitrum One, Nova **o testnet del ecosistema** | Testnet cuenta. Local (Hardhat/Anvil) **no** |
| 3 | Usar tecnologías del ecosistema Arbitrum **como parte fundamental** | No decorativo |
| 4 | **Al menos un smart contract** desplegado | Mínimo absoluto en los tres bounties |
| 5 | **Interacción real** frontend ↔ contrato demostrada | No basta un contrato suelto |
| 6 | Código fuente **público en GitHub** | Privado el día de entrega = fuera |
| 7 | README con **instrucciones de instalación y ejecución** | Requisito explícito |
| 8 | **Registrar el proyecto** en la plataforma oficial antes del deadline | Trámite, pero descalifica |
| 9 | **MVP funcional** en el Demo Day | Debe correr, no ser un mockup |
| 10 | Pitch y demo dentro del tiempo asignado | — |
| 11 | **Citar en la documentación** todo software de terceros usado | Frameworks, SDKs, APIs, modelos de IA, librerías |
| 12 | Cumplir **uno** de los tres niveles de bounty | Basic, Intermediate o Advanced |

### Del equipo
| # | Requisito |
|---|---|
| 13 | 1 a 4 participantes (**1 está permitido**) |
| 14 | Todos registrados oficialmente en el hackathon |
| 15 | Todos mayores de 18 años |

### 🏆 Requisitos específicos para optar a los premios generales (🥇🥈)

Lista propia de la sección "Especificación de Premios". Se suma a lo anterior:

| # | Requisito | Qué exige en la práctica |
|---|---|---|
| A | Haber sido desarrollado **sobre el ecosistema Arbitrum** | — |
| B | MVP funcional, **completo y demostrable** durante el Demo Day | No un prototipo parcial |
| C | Resolver un problema real con propuesta de valor **clara, viable y coherente** | "Viable" = que podría existir de verdad |
| D | Nivel adecuado de **experiencia de usuario, diseño e integración de TODOS los componentes** | Nada a medio conectar. Frontend + contrato + IA + BD deben formar un todo |
| E | **Implementar correctamente la lógica on-chain y su integración con el frontend** | La calidad del contrato *y* del puente hacia la UI |
| F | Cumplir **todos** los entregables obligatorios | Código, despliegue, presentación y pitch |
| G | Cumplir **uno** de los tres niveles de implementación técnica | Basic, Intermediate o Advanced |

Y de la sección "Reglas" (requisitos mínimos de elegibilidad a premios):
- Desplegado en red compatible con Arbitrum (One, Sepolia u otra habilitada por la organización)
- **Al menos un smart contract desplegado y funcional**
- Aplicación funcional (MVP) que permita **demostrar el caso de uso**
- Toda la documentación entregada antes de la fecha límite
- Equipos de hasta 4 integrantes

> *"Los proyectos que no cumplan estos requisitos podrán participar en actividades de la
> hackathon, pero **no serán elegibles para los premios generales**."*

> 🔑 **Los puntos D y E son los que más se descuidan.** Dicen explícitamente que se evalúa
> la **integración de todos los componentes**, no solo que cada pieza exista por separado.
> Un contrato bueno + una UI buena mal conectados puntúan peor que dos piezas modestas
> bien integradas.

### Los 7 entregables (todos obligatorios)
| # | Entregable | Detalle |
|---|---|---|
| 16 | 🎥 Video Pitch | **2–3 min**. Problema, solución, valor, cómo usa Arbitrum |
| 17 | 📑 Pitch Deck | **En PDF** |
| 18 | 🚀 Link Demo | App desplegada y accesible por el jurado |
| 19 | 🎬 Video Demo | Funcionamiento y funcionalidades principales |
| 20 | 💻 Link Repositorio | Público, con código y documentación |
| 21 | 📜 Smart Contracts | Por cada contrato: **dirección + red + link a Arbiscan** |
| 22 | 🏗️ Link Arquitectura | Diagrama de interacción entre componentes |

### Requisitos por bounty (elegir uno)
| Nivel | Obligatorio |
|---|---|
| 🟢 Basic | **Scaffold-ETH** como base + ≥1 contrato desplegado en red compatible Arbitrum + interacción real con el frontend |
| 🟡 Intermediate | **Scaffold-Stylus** como base + ≥1 contrato **Stylus (Rust)** desplegado + interacción completa frontend↔contrato |
| 🔴 Advanced | Todo lo de Intermediate **+** funcionalidad de IA **esencial al flujo** (no decorativa), demostrada en el demo |

> ⚠️ Ojo: "usar Scaffold-X **como base del proyecto**" es requisito del bounty, no sugerencia.
> Arrancar con `create-next-app` desde cero deja el proyecto fuera de los tres bounties.

---

## 🟡 RECOMENDADO — no obligatorio, pero es donde se ganan los puntos

| Recomendación | Por qué |
|---|---|
| **Apuntar a Stylus (Intermediate/Advanced)** | El 20% "Uso del Ecosistema" pide tecnologías *de Arbitrum*. Un contrato Solidity corre igual en cualquier EVM: no demuestra nada específico |
| **Que el contrato Stylus haga algo no trivial** | Frase literal de las bases: *"se valorará el aprovechamiento de las capacidades de Stylus más allá de una implementación trivial"* |
| **Problema local y verificable (Perú / LATAM)** | Los 4 ganadores de 2025 fueron todos problemas peruanos concretos. Ver `11-investigacion-ganadores.md` |
| **Commits frecuentes y fechados** | El jurado *puede pedir* evidencia del trabajo. Un commit único al final se ve mal |
| **Desplegar a testnet el día 1, aunque sea un stub** | El despliegue es el riesgo binario. Todo lo demás se itera |
| **Grabar el Video Demo con antelación** | Seguro contra fallos de red/cold-start en vivo |
| **Diagrama en Mermaid dentro del README** | Cubre el entregable de arquitectura sin herramientas externas ni tiempo perdido |
| **Tabla de contratos en el README desde el primer deploy** | Cubre el entregable 📜 sin correr a última hora |
| **Ensayar el pitch de 2-3 min** | Es 15% de la nota y es el criterio más barato de mejorar |
| **`CREDITOS.md`** | Formaliza el requisito obligatorio #11 |
| **Tests del contrato** | Entra en "buenas prácticas de desarrollo" del 25% técnico |
| **Onboarding de wallet cuidado** | Entra en el 20% de UX. Es donde casi todos los proyectos fallan |

---

## 🟢 PERMITIDO — se puede, sin ser obligatorio ni penalizado

| Permitido | Condición |
|---|---|
| **Frameworks, SDKs, APIs, modelos de IA, librerías open source** | Respetar licencias + **citarlos** + que sean apoyo, no el producto completo |
| **Desplegar solo en testnet (Arbitrum Sepolia)** | Explícitamente permitido: *"o una red de pruebas del ecosistema Arbitrum"*. No hace falta gastar ETH real |
| **Participar solo (equipo de 1)** | El rango es 1 a 4 |
| **Reutilizar material del Bootcamp** | Documentos, investigación, prototipos, wireframes, PoCs. Pero **el MVP y la integración evaluada deben ser de la hackathon** |
| **Reutilizar proyectos/librerías/infra propios previos** | Solo si lo hecho en la hackathon es una **mejora sustancial y verificable** |
| **Desarrollar una idea presentada en el Bootcamp** | No da ventaja ni descalifica. Se evalúa el resultado de la hackathon |
| **Cualquier industria o sector** | Las bases dicen literalmente "cualquier industria o sector" |
| **Base de datos off-chain (Postgres)** | Nada lo prohíbe. Pero cuidado con el anti-patrón (ver abajo) |
| **Hosting donde quieras (Render, Vercel…)** | Solo importa que el "Link Demo" funcione |
| **Usar IA para escribir el código** | Es "software de terceros": permitido, **citándolo**. Prohibido es *ocultarlo* cuando se requiera declararlo |
| **Formato híbrido / remoto** | El hackathon es híbrido |

---

## ⛔ PROHIBIDO

- Copiar código de otros equipos
- Sabotear proyectos ajenos
- Acceder sin autorización a sistemas de terceros
- Manipular votos o evaluaciones
- Presentar información falsa
- **Ocultar el uso de herramientas externas cuando sea requerido declararlas**

---

## Anti-patrones que cuestan puntos (no descalifican, pero hunden la nota)

| Anti-patrón | Criterio que daña |
|---|---|
| El contrato es un adorno: la app funcionaría igual sin blockchain | 20% Arbitrum + 25% técnico |
| Postgres guarda lo que debería ser on-chain | 25% técnico |
| La IA es un chatbot pegado al costado, no parte del flujo | Descalifica del bounty Advanced |
| Contrato Stylus que es un "hola mundo" en Rust | *"más allá de una implementación trivial"* |
| Demo con pantallas rotas o flujo incompleto | 20% producto y UX |
| Problema genérico sin usuario identificado | 20% problema e impacto |
| README sin instrucciones | **Descalificación** (requisito obligatorio) |
