# Cómo funciona cada proyecto ganador

Explicación del mecanismo de cada proyecto y del papel exacto de la blockchain.

> **Nota sobre las fuentes.** Los proyectos de ETH Lima 2025 tienen la ficha completa
> **restringida** en TAIKAI ("Sorry, you don't have permissions to access this content").
> De ellos solo es público el resumen de una línea. Por eso, en esa sección separo
> explícitamente **[DOCUMENTADO]** (lo que dice la fuente) de **[RECONSTRUCCIÓN]**
> (cómo funcionaría un sistema así, inferido del patrón — no es lo que ellos hicieron
> necesariamente). Los proyectos globales sí están documentados públicamente.

> **Nota sobre Arbitrum.** Los 4 ganadores de Lima 2025 usaron **Starknet y Scroll**,
> no Arbitrum — ese año no existía el track de Arbitrum. Para cada uno indico cómo se
> traduciría a Arbitrum, que es lo que a nosotros nos sirve.

---

# PARTE 1 — Ganadores ETH Lima 2025

## 1. Ocean Sense Network 🥇 (track Starknet, $2,500)

**[DOCUMENTADO]** *"Red DePIN (Infraestructura Física Descentralizada) que democratiza el
monitoreo oceánico del litoral peruano mediante boyas IoT operadas por pescadores artesanales."*

### El problema
El monitoreo oceánico (temperatura, salinidad, oleaje, oxígeno, corrientes) lo hacen
instituciones estatales o universidades con presupuesto limitado y pocos puntos de medición.
Los pescadores artesanales — que son quienes están en el mar todos los días — no tienen
acceso a esos datos ni participan en generarlos. Datos escasos, centralizados y caros.

### Qué es un DePIN
**Decentralized Physical Infrastructure Network.** El patrón: en vez de que una empresa
despliegue hardware, **personas comunes lo despliegan y operan, y la red les paga en tokens
por los datos que aportan**. Helium lo hizo con antenas de red; aquí con boyas oceánicas.

Invierte la economía de la infraestructura: el costo de capital se reparte entre miles de
participantes, y el incentivo lo pone el token en vez de un contrato con el Estado.

### **[RECONSTRUCCIÓN]** Cómo funciona un sistema así
```
Boya IoT (sensores)
   ↓ mide temperatura, salinidad, oleaje...
   ↓ firma la lectura con su clave privada
Gateway / móvil del pescador
   ↓ envía la lectura firmada
Smart contract
   ↓ verifica la firma (¿la boya es de la red?)
   ↓ registra el dato (o su hash)
   ↓ acredita tokens al operador
Consumidores de datos (pesqueras, científicos, Estado) pagan por acceder
```

### Dónde entra la blockchain
Tres funciones que no son decorativas:
1. **Registro de identidad del hardware** — qué boyas son legítimas y quién las opera.
2. **Prueba de aportación** — el dato queda anclado con timestamp e inmutable, así que la
   medición es auditable y nadie puede reescribir el histórico.
3. **Pago automático de incentivos** — el contrato paga al pescador sin intermediario ni
   trámite. Esto es lo que hace viable el modelo: no hay planilla ni burocracia.

### Cómo se traduciría a Arbitrum
Directo. Y **Stylus mejoraría el punto débil**: verificar miles de firmas de sensores y
validar/agregar lecturas es exactamente el tipo de cómputo que la EVM cobra carísimo.
Un contrato Stylus podría verificar firmas en lote y calcular agregados (medias móviles,
detección de valores anómalos) on-chain — en Solidity eso sería inviable por gas.

### Por qué ganó
Usuario con cara y nombre (pescadores artesanales del litoral peruano), problema medible,
y la blockchain es **estructuralmente necesaria** — sin ella no hay forma barata de pagar
a cientos de operadores dispersos por datos verificables.

---

## 2. Colectiva 🥈 (track Starknet)

**[DOCUMENTADO]** *"Agrupa a comerciantes para comprar directo del mayorista. Consigues
precios que antes eran imposibles, tu inversión está protegida y todos deciden juntos.
Ahorro real e inteligente."*

### El problema
Un comerciante de mercado compra poco volumen → paga precio minorista. El mayorista exige
un mínimo que un solo comerciante no alcanza. Si diez se juntan sí llegan — pero entonces
aparece el problema de siempre: **¿quién guarda el dinero de todos?** Confianza. Ese es el
verdadero bloqueo, no la logística.

### **[RECONSTRUCCIÓN]** Cómo funciona
Es una **compra colectiva con custodia programable** (mecánica tipo *crowdfunding con escrow*):

```
1. Alguien abre una compra: "500 kg de arroz, mínimo S/5,000, cierra el viernes"
2. Los comerciantes depositan su parte en el contrato
3. El contrato retiene el dinero — nadie puede sacarlo, ni el organizador
4a. Si se alcanza el mínimo → se libera el pago al mayorista
4b. Si NO se alcanza → cada uno recupera su dinero automáticamente
5. Las decisiones (a qué proveedor, aceptar la entrega) se votan on-chain
```

### Dónde entra la blockchain
**"Tu inversión está protegida"** es literalmente la frase clave. El contrato reemplaza al
tesorero de confianza:
- El dinero está en un contrato con reglas públicas, no en la cuenta de una persona.
- La condición "si no se llena, todos recuperan" **se ejecuta sola**; no depende de que
  alguien cumpla su palabra.
- **"Todos deciden juntos"** = gobernanza on-chain, voto proporcional al aporte.

Sin blockchain esto es un grupo de WhatsApp con un tesorero — y ahí es donde estos esquemas
mueren en la vida real.

### Cómo se traduciría a Arbitrum
Igual de directo, es un contrato de escrow + votación, funciona en cualquier EVM.
**Justamente por eso es el ganador con el "por qué Stylus" más débil**: no hay cómputo pesado.
Para el track de Arbitrum habría que añadir algo — reputación de proveedores calculada
on-chain, matching automático entre compradores y ofertas, algoritmo de asignación.

---

## 3. Semilla Microlending 🥇 (track Scroll)

**[DOCUMENTADO]** *"Plataforma descentralizada de microcréditos que permite a comunidades,
ONGs y empresas crear sus propios fondos de préstamo."*

### El problema
El microcrédito funciona (Grameen Bank, premio Nobel), pero administrarlo es caro: hace falta
una institución que lleve la contabilidad, cobre, y rinda cuentas a los donantes. Para una
ONG chica o una comunidad, ese costo administrativo se come el impacto. Y el donante nunca
sabe realmente adónde fue su dinero.

### **[RECONSTRUCCIÓN]** Cómo funciona
Lo interesante es que es **infraestructura, no un prestamista**: no presta su propio dinero,
te da la herramienta para crear **tu** fondo.

```
Una ONG despliega su fondo:
   ├── define reglas: monto máximo, plazo, tasa (o cero), criterios
   ├── deposita capital
   └── el contrato administra todo

Un prestatario solicita → se aprueba según las reglas del fondo
   → el contrato desembolsa
   → registra cada pago recibido
   → construye historial crediticio on-chain del prestatario

El donante ve en todo momento: cuánto se prestó, a cuántos, cuánto se repagó
```

### Dónde entra la blockchain
1. **Transparencia radical para el donante** — el libro contable es público y no se puede
   maquillar. Esto resuelve el problema #1 de la filantropía: la desconfianza.
2. **Costo administrativo casi cero** — el contrato es el back-office. Una comunidad de 50
   personas puede tener un fondo formal sin contratar a nadie.
3. **Historial crediticio portátil** — quien paga puntualmente acumula un récord que le
   pertenece y sirve en cualquier otro fondo. Un no-bancarizado empieza a construir crédito.
4. **Reglas que nadie puede saltarse** — ni el administrador del fondo.

### Cómo se traduciría a Arbitrum
Directo. Y aquí **Stylus tiene un "por qué" fuerte y evidente**: el *credit scoring*.
Calcular un puntaje crediticio a partir del historial de pagos — con ponderaciones,
decaimiento temporal, penalizaciones por mora — es cómputo con matemática de precisión
que en Solidity es carísimo y en Rust es trivial. Es justo el caso que Arbitrum menciona
en su blog: *"algoritmos de scoring de reputación"*.

> Nota: en el mismo hackathon 2025 hubo **Haku Finance** (*"scoring crediticio con IA +
> blockchain para PYMEs informales en Perú"*) y **Chambita$** (*"convierte el trabajo
> informal en score financiero verificable"*). Tres proyectos sobre lo mismo. El scoring
> crediticio para informales es claramente **el tema saturado** de este hackathon.

---

## 4. Turi 🥈 (track Scroll)

**[DOCUMENTADO]** *"Plataforma que da beneficios a turistas en base a su reputación obtenida
en sus visitas a los sitios turísticos de Perú y LATAM."*

### El problema
El turismo se concentra brutalmente: todos van a Machu Picchu, y cientos de sitios quedan
vacíos. Los negocios locales no tienen forma de premiar al visitante recurrente ni de
atraerlo a lugares menos conocidos. Los programas de fidelidad existentes son de cada
empresa por separado y no sirven entre negocios.

### **[RECONSTRUCCIÓN]** Cómo funciona
Es un **sistema de reputación con prueba de presencia física**:

```
El turista visita un sitio
   ↓ prueba que estuvo ahí (QR en el lugar, NFC, geolocalización firmada)
   ↓ el contrato verifica y registra la visita
   ↓ acumula reputación / recibe un NFT de la visita
   ↓ la reputación desbloquea beneficios en negocios aliados
```

El reto técnico real es la **prueba de presencia**: evitar que alguien reclame visitas sin ir.

### Dónde entra la blockchain
1. **Reputación portátil y no falsificable** — le pertenece al turista, no a una empresa.
   Sirve en cualquier negocio de la red, sin que estos tengan que integrarse entre sí.
2. **Coordinación sin intermediario** — decenas de negocios independientes comparten un
   mismo sistema de fidelidad sin que ninguno controle la base de datos ni cobre comisión.
3. **Los NFT de visita como recuerdo** — coleccionable con valor emocional, que además es
   la prueba.

### Cómo se traduciría a Arbitrum
Directo. **Stylus encajaría en la verificación de la prueba de presencia**: validar firmas
geográficas, verificar pruebas criptográficas de ubicación o Merkle proofs de check-ins en
lote. Y el cálculo de reputación con decaimiento temporal, otra vez, es matemática que
conviene en Rust.

---

## 📌 El patrón común de los 4 ganadores de Lima

| | Ocean Sense | Colectiva | Semilla | Turi |
|---|---|---|---|---|
| **Usuario** | Pescadores artesanales | Comerciantes de mercado | Comunidades/ONGs | Turistas + negocios locales |
| **Qué reemplaza la blockchain** | El intermediario que paga | El tesorero de confianza | La institución administradora | La empresa dueña del programa de puntos |
| **Función central** | Incentivos + datos verificables | Custodia + gobernanza | Contabilidad + historial | Reputación portátil |

**Los cuatro eliminan a un intermediario de confianza en un contexto peruano concreto.**
Ninguno es un primitivo financiero global. Ninguno usa jerga. Todos se explican en una
frase que entiende cualquiera.

---

# PARTE 2 — Ganadores de hackathons Arbitrum globales

Aquí sí está todo documentado públicamente, y el nivel técnico es bastante más alto.

## 5. Orbital AMM Protocol 🥇 ($40,000 — Bengaluru Hacker House)

*Equipo de 4 del IIT Roorkee. También 🥈 en el buildathon online.*

### Qué es un AMM
Un **Automated Market Maker** es un exchange sin libro de órdenes: un pool con reservas de
dos o más tokens y una fórmula matemática (la *invariante*) que fija el precio según las
proporciones. Uniswap usa `x · y = k`.

### El problema que resuelve
Los pools de stablecoins tradicionales manejan 2-4 monedas. Con más, la matemática se vuelve
inmanejable y el capital se usa pésimo: los proveedores de liquidez deben reservar fondos
para cubrir el escenario de que **cualquiera** de las monedas se despeguen del dólar, aunque
el 99% del trading ocurra cerca de $1.

### Cómo funciona
Se basa en el diseño **Orbital de Paradigm** (investigación publicada en 2025). La idea:

> En vez de una curva en 2D, se modela la liquidez como una **esfera en un espacio de
> n dimensiones** — una dimensión por stablecoin. Las operaciones mueven el sistema por la
> superficie de esa esfera, lo que mantiene la simetría entre reservas.

Y extiende la **liquidez concentrada** a esas dimensiones: los "ticks" se dibujan como
órbitas alrededor del punto donde todas valen $1. Los ticks cercanos a $1 no necesitan
reservar capital para un despegue, así que los proveedores concentran sus recursos donde
realmente ocurre el trading. Resultado: **miles de stablecoins en un solo pool**, con
eficiencia de capital muy superior. Y si una moneda colapsa a 0, el tick sigue operando
las demás a precio justo.

El equipo añadió **segmentación de órdenes**: partir órdenes grandes para evitar picos de
slippage.

### 🔑 Dónde entra Arbitrum — y por qué es el mejor ejemplo de Stylus
> *"Implementaron una capa matemática de alta precisión **en Stylus** para computar
> invariantes multi-activo a alta velocidad."*

Esto es la definición de "no trivial". Calcular una invariante esférica en n dimensiones
requiere raíces, potencias y aritmética de punto fijo con muchos decimales — **en Solidity
sería tan caro en gas que el AMM no podría existir**. En Rust/WASM el cómputo cuesta órdenes
de magnitud menos.

**El "por qué Stylus" en una frase:** *"la matemática de nuestro AMM es imposible de pagar en
la EVM."* Por eso ganó $40,000.

---

## 6. Shinobi.Cash 🥈 ($20,000)

### El problema
Toda transacción en una blockchain pública es visible: cualquiera ve tu saldo y tu historial
completo. Para un negocio o un salario, eso es inaceptable.

### Cómo funciona un privacy pool
```
1. Depositas fondos en un pool común junto a muchos otros usuarios
2. Al retirar, generas una prueba de conocimiento cero (ZK) que demuestra
   "tengo derecho a retirar este monto" SIN revelar cuál de todos los
   depósitos era el tuyo
3. El contrato verifica la prueba matemáticamente y paga
```
El rastro on-chain se rompe: se ve que entró dinero y que salió dinero, pero no qué entrada
corresponde a qué salida.

### Lo que añadieron: cross-chain
Depositas en **cualquier cadena EVM** y retiras privadamente en **otra**, desde un **único
despliegue en Arbitrum**. Arbitrum funciona como el hub de privacidad de todas las cadenas.

### Dónde entra Arbitrum
1. **Un solo despliegue en Arbitrum sirve a todas las cadenas** — Arbitrum es el punto central
   por su costo bajo. Verificar pruebas ZK es caro en gas; en L1 sería prohibitivo.
2. **Paymasters de account abstraction** — un *paymaster* es un contrato que **paga el gas por
   ti**. Aquí resuelve un problema real de privacidad: si tienes que pagar el gas del retiro
   desde tu propia wallet, esa wallet te delata y arruinas el anonimato. El paymaster rompe
   ese vínculo y además abarata el retiro.
3. **Open Intent Framework** para los circuitos ZK y el flujo cross-chain.

---

## 7. GuardChain.ai 🥉 ($10,000) — el molde más parecido a lo que sirve en Lima

### El problema
Trabajadores *gig* (repartidores, conductores) y grupos de autoayuda en India: sin seguro
formal. Las aseguradoras no los atienden porque las pólizas pequeñas no son rentables —
procesar un reclamo cuesta más que el reclamo mismo. Y cuando existe, el proceso es opaco:
no sabes por qué te rechazaron.

### Cómo funciona
Reclamos de seguro on-chain, con **IA + transparencia**:
```
El trabajador presenta un reclamo (fotos, documentos)
   ↓
La IA evalúa: ¿procede? ¿es fraude? ¿cuánto corresponde?
   ↓
El contrato registra la decisión y su razón — públicamente auditable
   ↓
Si procede, paga automáticamente
```
La IA baja el costo de procesar reclamos pequeños hasta hacerlos viables. La blockchain
hace que la decisión sea auditable: si te rechazan, queda registrado por qué, y no se puede
alterar después.

### Dónde entra Arbitrum
Diseñaron una **cadena Orbit dedicada a seguros**. Orbit permite lanzar **tu propia L3** sobre
Arbitrum. La razón: **costos de procesamiento predecibles**. En una cadena compartida, si sube
la congestión sube el costo de procesar reclamos y el modelo deja de cerrar. Con tu propia
cadena controlas el gas.

### 🔑 Por qué este es el molde a estudiar
Tiene **exactamente el esqueleto que premió el jurado de Lima 2025**:
- Problema social local y concreto (trabajadores gig en India ≈ informales en Perú)
- Usuario identificable
- **IA como parte esencial del flujo** (requisito del bounty Advanced)
- Tecnología específica de Arbitrum con justificación técnica real (Orbit)

Ganó $10,000 en un hackathon con premios de $40k. La combinación *impacto social + IA +
tech de Arbitrum* funciona.

---

## 8. Plexi 🥇 ($15,000 — buildathon online)

**Vault ERC-4626 componible para yield farming.**

**ERC-4626** es el estándar de "bóveda de rendimiento": depositas un token, recibes *shares*
que representan tu parte, y el vault invierte por ti. Al estar estandarizado, cualquier otro
protocolo puede integrarse sin código a medida — eso es la **componibilidad**: piezas que
encajan como Lego.

"Componible" aquí significa que el vault puede a su vez invertir en otros vaults, encadenando
estrategias. Es un proyecto **DeFi puro** — la categoría opuesta a los ganadores de Lima.

---

## 9. TriggerX 🥉 ($2,500) — automatización descentralizada

### El problema (uno real y poco conocido)
**Los smart contracts no pueden ejecutarse solos.** No hay `cron` en la blockchain. Un
contrato solo actúa si alguien le envía una transacción. Así que si necesitas "liquidar esta
posición cuando el precio caiga" o "pagar la suscripción cada mes", alguien tiene que apretar
el botón. En la práctica, casi todos los protocolos usan **un bot centralizado** — que es
justamente el punto único de fallo que la descentralización pretendía eliminar.

### Cómo funciona
Una **red descentralizada de *keepers*** (operadores) que vigilan condiciones y ejecutan tareas:
```
Listen  → los keepers monitorean nuevas tareas del Task Manager
Perform → ejecutan la transacción, o validan la que ejecutó otro
Prove   → devuelven el resultado o una atestación a la red
```
Soporta automatización por **tiempo, evento o condición**, y usa **agregación de firmas BLS**
para consenso (muchas firmas se comprimen en una sola, verificable barato) y reparto
balanceado de tareas. Se apoya en el framework **AVS de EigenLayer**, que aporta garantías
económicas: los keepers ponen colateral y lo pierden si hacen trampa.

### Dónde entra Arbitrum
Es infraestructura cross-chain donde Arbitrum es una de las cadenas soportadas. **Verificar
agregación BLS es cómputo criptográfico pesado — caso de libro para Stylus.**

---

## 10. Stylish Stylus 🥇 ($4,000 — ETHIndia, track Arbitrum Stylus)

Añadió soporte del lenguaje **Zig** a Stylus, y construyó un **IDE/playground** web para
escribir y desplegar contratos Stylus desde el navegador.

### Por qué ganó
No resuelve un problema de usuario final: resuelve un problema **de desarrolladores**.
Como Stylus compila a WASM, en teoría cualquier lenguaje que compile a WASM podría servir —
pero hace falta el SDK y el *tooling*. Ellos lo hicieron para Zig.

**Lección:** *dev tooling* es una categoría con menos competencia y muy premiada por Arbitrum
(mira el Stylus Sprint: 6 de 17 proyectos financiados son herramientas). **Pero encaja mal con
la rúbrica de Lima**, que exige "problema real" y "usuarios identificados" — un jurado de
impacto social no premia un compilador.

---

## 11. RayStylus 🥈 (Arbitrum Stylus Mini Hackathon APAC)

*"Primer motor de ray tracing on-chain del mundo, en Rust."*

El **ray tracing** renderiza imágenes simulando el recorrido de rayos de luz y sus rebotes.
Es de lo más costoso computacionalmente que existe en gráficos — se usa en cine y en juegos
de gama alta con GPUs dedicadas.

Hacerlo **dentro de un smart contract** en la EVM es sencillamente imposible: el costo de gas
sería astronómico. En Stylus se vuelve viable.

### Por qué importa
No tiene utilidad práctica obvia — es una **demostración de fuerza**. Y funcionó, porque
comunica en tres palabras la tesis de Stylus: *"esto la EVM no puede."*

**Lección:** un proyecto con un "por qué Stylus" espectacular y evidente puede ganar aunque
el caso de uso sea débil. Lo contrario (buen caso de uso, Stylus trivial) no gana el track.

---

## 12. ArbitrumOnchainAgent — IA corriendo dentro del contrato

*Creado para el ETHGlobal Agentic Ethereum Hackathon. Repo público.*

### Qué hace
Un agente de **aprendizaje por refuerzo** que corre **enteramente on-chain**:
```
1. Un laberinto de 5x5 vive en el contrato
2. El agente aprende a resolverlo por prueba y error usando Q-learning
3. Cada llamada al contrato ejecuta iteraciones del algoritmo y actualiza
   la "Q-table" (la tabla de qué tan buena es cada acción en cada casilla)
4. Cuando aprende el camino óptimo, lo renderiza como SVG
   dentro de los metadatos de un NFT ERC-721
```

**Q-learning** es un algoritmo clásico de refuerzo: el agente prueba acciones, recibe
recompensas, y ajusta una tabla de valores hasta converger a la política óptima.

### 🔑 Por qué es el ejemplo más importante para el bounty Advanced
Casi todos los proyectos "de IA" con blockchain hacen lo mismo: la IA corre en un servidor
(o llaman a una API), y el contrato solo guarda el resultado. Eso es **IA al lado de la
blockchain**, y es lo que el bounty llama "decorativa".

Aquí **el modelo entrena y decide dentro del contrato**. Eso es *IA on-chain* de verdad, y
solo es posible por Stylus: un algoritmo iterativo con actualizaciones de tabla es
inasumible en la EVM.

> El README es explícito: la implementación en Rust *"sería impracticablemente cara o
> imposible en Solidity nativo"*. No publica números de gas — es una prueba de viabilidad,
> no un benchmark.

---

## 13. ERC-8004 y x402 — lo que Arbitrum destaca oficialmente

Del blog *"AI and Stylus: The Builder's New Toolkit"*:

### ERC-8004 — registro de agentes
Estándar de **registro de agentes de IA** desplegado en Arbitrum One. Cuando los agentes
autónomos empiecen a transaccionar entre sí, hace falta saber cuáles son confiables.
Usa **Stylus para los algoritmos de scoring de reputación**, porque en la EVM serían
ineficientes.

### x402 — pagos máquina a máquina
**Inferencia de IA medida con liquidación automática por lotes en USDC.** Un agente consume
inferencias de otro y paga por uso, sin humano en el medio. El nombre alude al código HTTP
`402 Payment Required`, que existe en el estándar desde siempre y nunca se usó.

### Los tres casos que Arbitrum señala para IA + Stylus
1. **Infraestructura de IA on-chain** — tareas *compute-heavy* "impracticables en Solidity".
   Citan textualmente: **scoring de reputación, verificación de pruebas, operaciones de
   registro complejas, validación intensiva de datos**.
2. **Agent commerce** — sistemas autónomos que transaccionan solos.
3. **Asistencia al desarrollador** — IA que genera código Stylus con contexto del SDK.

---

# Síntesis: los tres modelos de "por qué Stylus"

| Modelo | Ejemplos | Cómo suena la frase |
|---|---|---|
| **Matemática imposible en la EVM** | Orbital AMM, RayStylus | *"la invariante de nuestro AMM no se puede pagar en Solidity"* |
| **Algoritmo iterativo / IA on-chain** | ArbitrumOnchainAgent, ERC-8004 | *"el modelo entrena dentro del contrato, no en un servidor"* |
| **Criptografía pesada** | Shinobi.Cash, TriggerX | *"verificamos pruebas ZK / agregación BLS on-chain"* |

Y el molde de producto que gana en **Lima** específicamente:

> **problema peruano concreto con usuario nombrable** + **la blockchain elimina a un
> intermediario de confianza** + **un contrato Stylus con una razón técnica real**

GuardChain.ai es el ejemplo global que mejor combina las tres cosas.

---

## Fuentes

- Listado de proyectos ETH Lima 2025: https://taikai.network/en/ethereum-lima/hackathons/hackathon-eth-lima/projects *(fichas completas restringidas)*
- Recap ganadores 2025: https://hackathon.ethlima.org/2025/
- Ganadores Bengaluru: https://blog.arbitrum.foundation/arbitrum-open-house-india-concludes-with-bengaluru-hacker-house-full-recap/
- Diseño Orbital (Paradigm): https://www.paradigm.xyz/2025/06/orbital
- TriggerX docs: https://triggerx.gitbook.io/triggerx-docs
- ArbitrumOnchainAgent: https://github.com/hammertoe/ArbitrumOnchainAgent
- AI and Stylus: https://blog.arbitrum.foundation/ai-and-stylus-the-builders-new-toolkit/
