# Formulario de entrega — todo listo para copiar y pegar

> Cierre: **12 de agosto, 4:00 p.m. (Bolivia, GMT-4)**
> Plataforma: platform.ethlima.org

---

## 1 · Overview

**Logo del proyecto**
`entregables/logo-benevria.png` — 512 × 512, 24 KB
*(alternativa vectorial: `entregables/logo-benevria.svg`, 1 KB)*

**Título del proyecto**
```
BenevrIA
```

---

## 2 · Datos de participación

| Campo | Valor |
|---|---|
| **País de representación** | Bolivia |
| **Modalidad de Demo Day** | Virtual |
| **Categorías** | IA y Tecnologías Emergentes |

> Sobre las categorías: se pueden combinar. **IA y Tecnologías Emergentes** es la que
> corresponde. Si quieres añadir una segunda, *Aplicaciones Descentralizadas* es
> defendible por el panel de demanda y el reparto comunitario. No añadas *DeFi* — el
> proyecto no hace finanzas, y un jurado lo notaría.

---

## 3 · Equipo

| Campo | Valor |
|---|---|
| **Integrante** | Rodrigo Ricaldez Martinez |
| **Rol** | Desarrollador full-stack y de contratos inteligentes |

> ⚠️ Asignar el rol es obligatorio para poder completar la entrega. Son 30 segundos y
> bloquea todo lo demás.

---

## 4 · Historia

### Descripción detallada  *(máx. 500 palabras — este texto usa 470)*

```
BenevrIA es una inteligencia artificial de acceso gratuito cuyo nivel de modelo lo decide
un contrato inteligente, no un operador. La comunidad le enseña conocimiento; el contrato
verifica on-chain que cada aporte sea genuinamente nuevo, y la novedad acumulada desbloquea
modelos más capaces para todos los usuarios, hayan aportado o no. Cuando entra dinero al
protocolo, se reparte entre quienes enseñaron, en proporción exacta a la novedad verificada
de su aporte.

El flujo de usuario tiene cuatro pasos. Primero, una persona escribe conocimiento que los
modelos grandes suelen alucinar: un trámite local, un procedimiento de su oficio, jerga
técnica de su región. Segundo, ese texto pasa por una capa fuera de la cadena que aplica
heurísticas baratas (longitud, repetición, proporción de símbolos), filtra datos personales
y calcula un embedding que se trunca a 64 dimensiones y se cuantiza a enteros de 8 bits.
Tercero, el contrato Stylus recibe ese vector y lo compara mediante similitud coseno en
punto fijo contra el corpus ya almacenado: si supera el 90 % de similitud lo rechaza como
reenvío parafraseado, y si pasa emite puntos proporcionales a cuán distinto es. Cuarto, la
novedad acumulada eleva el nivel colectivo, y al cierre de cada época cada aportante puede
reclamar su parte del pozo con una fórmula pública: pozo por puntos propios entre puntos
totales.

La aplicación incluye además un panel de demanda donde la comunidad publica qué necesita
que la IA aprenda y vota los temas, lo que convierte la contribución en una respuesta a una
petición concreta en vez de un envío a ciegas.

La decisión técnica central es qué corre dentro y qué fuera de la cadena. El modelo de
lenguaje no vive en el contrato: no cabe, y afirmar lo contrario sería falso. Lo que vive
dentro es la verificación. Esa asimetría es deliberada, porque la comparación contra el
corpus es exactamente la decisión donde el operador tendría incentivo a mentir: si un
servidor dictamina "esto es duplicado, no cobras", nadie puede auditarlo.

El contrato está escrito en Rust sobre Arbitrum Stylus y desplegado en Arbitrum Sepolia.
Cuenta con 28 pruebas automatizadas que cubren la matemática vectorial, el rechazo de
duplicados exactos y parafraseados, la subida de nivel por conocimiento, el tope por
tesorería, el reparto proporcional y los límites de permisos del keeper. El frontend está
construido con Next.js, wagmi y viem, y expone una API compatible con la de OpenAI, de modo
que cualquier herramienta existente puede apuntar a BenevrIA cambiando una URL base.

Los modelos servidos son exclusivamente de pesos abiertos, seleccionados tras probar uno por
uno los disponibles y descartar los que devuelven respuestas vacías o filtran su
razonamiento interno. Cada nivel tiene modelos de respaldo, porque los proveedores gratuitos
devuelven errores de saturación de forma intermitente y una demostración no puede depender
de un único endpoint.
```

---

### Uso de Arbitrum  *(máx. 5000 caracteres — este texto usa ~2900)*

```
BenevrIA usa Arbitrum en cuatro capas, y en cada una hay una razón concreta.

STYLUS: EL NÚCLEO DEL PROYECTO

El contrato central verifica si un aporte de conocimiento es genuinamente nuevo comparando
su vector contra el corpus almacenado. Con una ventana de 256 vectores de 64 dimensiones,
eso son aproximadamente 16.000 multiplicaciones y sumas enteras por transacción.

En la EVM esa operación es inviable: cada multiplicación consume gas de opcode y el corpus
se lee palabra por palabra desde storage, de modo que el costo crece hasta volver la
transacción impagable. En Stylus, compilado a WebAssembly y de ahí a código máquina nativo,
es aritmética de registro.

Esto no es un uso decorativo de Stylus: sin Stylus este contrato no existiría, y el
mecanismo entero del proyecto —que la verificación de novedad sea auditable y no dependa de
confiar en el operador— se caería.

Detalles de la implementación: los embeddings llegan normalizados, truncados a 64
dimensiones y cuantizados a int8, de modo que cada vector ocupa exactamente dos palabras de
storage. Para vectores unitarios la similitud coseno es el producto punto, así que todo el
cálculo es aritmética entera sin coma flotante, que además no sería determinista entre
nodos. La comparación incluye salida temprana al detectar un duplicado, porque seguir
recorriendo el corpus cuando ya se sabe el resultado es gas quemado.

PRECOMPILADO ARBSYS (0x64)

Las épocas de reparto se calculan a partir del número de bloque. En Arbitrum,
block.number devuelve el bloque de Ethereum L1, no el de L2. Usarlo daría un reloj
desalineado con la cadena donde el contrato realmente vive y con una granularidad
equivocada.

El contrato consulta ArbSys en la dirección 0x64 para obtener el número real de bloque de
L2. Se puede verificar en el despliegue: la función bloqueL2() devuelve un valor por encima
de los 297 millones, mientras que L1 Sepolia va por 11,4 millones — la llamada al
precompilado resuelve de verdad y no está cayendo a un valor por defecto.

La llamada se hace con un static_call explícito a través de la capa de host del SDK y no
con la macro sol_interface!, porque esa macro emite una llamada que baja directamente al
hostio del nodo y resulta imposible de simular en pruebas. Con la llamada explícita, el
mismo código corre en cadena y bajo test.

ARBITRUM SEPOLIA

Red de despliegue, chainId 421614. El contrato está activo, verificado y con datos reales:
9 aportes en el corpus, 4 temas pedidos y tesorería depositada.

Contrato: 0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d

X402 SOBRE ARBITRUM

La tesorería del contrato está diseñada para pagar su propia inferencia mediante x402, el
estándar de pago por request en USDC sobre HTTP 402. Se verificó que el facilitador de PayAI
soporta la red arbitrum-sepolia, mientras que el facilitador de Coinbase no la cubre.

El contrato ya implementa la parte difícil: autoriza un presupuesto por época y el keeper
solo puede retirar lo autorizado, nunca el pozo de los aportantes. Se declara con claridad
lo que aún falta: el proveedor de inferencia todavía no acepta x402, de modo que el último
tramo del pago pasa por una credencial. El protocolo está listo; falta que el proveedor
complete su migración.
```

---

### Problema e impacto  *(máx. 5000 caracteres — este texto usa ~3200)*

```
EL PROBLEMA

Los modelos de lenguaje se entrenaron con el conocimiento acumulado de millones de personas
y después lo devuelven mediante suscripción. Hay dos consecuencias, y las dos afectan a la
misma región.

La primera es de acceso. Una suscripción mensual a una IA de calidad cuesta alrededor de
veinte dólares. En Bolivia, con una economía que acumula tres años consecutivos de
contracción del PIB, eso no es una cifra menor: es una barrera real que deja fuera a
estudiantes, docentes y pequeños negocios.

La segunda es de compensación, y es más profunda. Hay conocimiento que los modelos
simplemente no tienen y por eso alucinan: cómo se hace un trámite concreto en una oficina
concreta, el paso que ningún manual escribe pero todo el que trabaja en el oficio conoce,
la jerga técnica de una región, el procedimiento que se transmite de persona a persona.

Ese conocimiento existe, tiene valor comprobable —los laboratorios pagan por datos
curados— y quien lo posee no recibe absolutamente nada por poseerlo.

QUIÉN LO USARÍA

El usuario no es "todo el que use internet". Son dos grupos distintos y ambos son
nombrables.

El contribuyente es el profesional cuyo conocimiento cumple tres condiciones: es escaso en
internet, es verificable por otros, y hoy nadie le paga por él. El contador que sabe cómo
se calcula realmente un finiquito. El maestro de obra que conoce el vocabulario que ningún
manual técnico recoge. El gestor que hizo el trámite y sabe en qué orden pedir los papeles.

El consumidor es cualquiera que no pueda pagar una suscripción mensual. Y aquí está el
punto que sostiene el diseño: el consumidor no tiene que aportar nada. Usa la IA al nivel
que la comunidad ganó, aporte o no. Que el free-rider se beneficie no es un defecto del
sistema: es la tesis. Una IA concebida como bien común.

POR QUÉ TIENE QUE SER ON-CHAIN

La objeción evidente es que un servidor haría exactamente lo mismo. Es cierto que un
servidor puede calcular lo mismo. Lo que no puede es probarlo.

Tres decisiones del sistema son justo aquellas donde el operador tendría incentivo a mentir.
Si mi servidor decide si tu aporte es novedoso, puedo decirte "es duplicado, no cobras" y no
tienes cómo comprobarlo. Si mi servidor decide qué modelo corre, puedo decir que bajó de
nivel y embolsarme la diferencia. Si mi servidor reparte el dinero, el reparto es opaco.

Por eso esas tres decisiones viven en el contrato, y solo esas. El resto —el modelo, los
embeddings, las heurísticas— corre fuera, que es donde corresponde.

IMPACTO POTENCIAL

A corto plazo, el impacto medible es el acceso: una IA utilizable sin costo para quien no
puede pagarla, cuya calidad mejora con lo que la propia comunidad enseña.

A mediano plazo, el impacto es la creación de un corpus que hoy no existe: conocimiento
procedimental y local, verificado, con procedencia auditable y con sus contribuyentes
identificados y compensados. Ese tipo de dato es exactamente el que los modelos manejan
peor, y por el que hay un mercado documentado — existen contratos de licenciamiento de
datos entre plataformas y laboratorios por decenas de millones de dólares al año.

La diferencia con esos acuerdos es de quién cobra. Hoy cobra la plataforma que aloja el
contenido. Aquí cobra quien lo escribió, en proporción exacta a la novedad que aportó, con
una fórmula que cualquiera puede recalcular desde los datos públicos de la cadena.
```

---

## 5 · Construcción

**Tecnologías** *(entre 1 y 20 nombres únicos)*
```
Rust
Arbitrum Stylus
Stylus SDK
WebAssembly
Solidity ABI
Next.js
React
TypeScript
viem
wagmi
RainbowKit
Tailwind CSS
Node.js
Arbitrum Sepolia
ArbSys
x402
OpenRouter
Embeddings vectoriales
Similitud coseno
Scaffold-Stylus
```

**Smart contracts**

| Nombre | Red | Dirección |
|---|---|---|
| BenevriaCore | Arbitrum Sepolia | `0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d` |

**Enlace al código**
```
https://github.com/nadevrix/benevria
```

**Enlace a arquitectura**
```
https://github.com/nadevrix/benevria/blob/main/proyecto/README.md#arquitectura
```

---

## 6 · Demo y pitch

| Campo | Valor | Estado |
|---|---|---|
| **Video de presentación (pitch)** | *pendiente de grabar* | ⬜ |
| **Demo funcional** | *URL de Render, pendiente* | ⬜ |
| **Recorrido en video de la demo** | *pendiente de grabar* | ⬜ |
| **Pitch Deck** | `entregables/BenevrIA-presentacion.pdf` (2,24 MB) | ✅ |

> ⚠️ El PDF **se valida antes de quedar disponible**. Súbelo hoy mismo aunque sea como
> versión preliminar: si la validación falla, quieres enterarte ahora y no a las 3:55 p.m.

---

## 7 · Documentos adicionales *(opcional, hasta 10 — la etiqueta es obligatoria)*

| Etiqueta | Enlace |
|---|---|
| Contrato en Arbiscan | `https://sepolia.arbiscan.io/address/0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d` |
| Transacción de despliegue | `https://sepolia.arbiscan.io/tx/0x51561c91ac45dadc3333984cd61846c6c94443c61544cf71a2c98228da5bb3af` |
| Documentación técnica | `https://github.com/nadevrix/benevria/blob/main/proyecto/README.md` |
| Créditos de software de terceros | `https://github.com/nadevrix/benevria/blob/main/proyecto/CREDITOS.md` |
| Bitácora de decisiones y verificaciones | `https://github.com/nadevrix/benevria/tree/main/bitacora` |

> Los dos últimos suman más de lo que parece: `CREDITOS.md` cumple el requisito explícito de
> declarar software de terceros, y la bitácora muestra el proceso de verificación —
> incluidas las cosas que se comprobaron y resultaron falsas.

---

## Orden recomendado para hoy

1. **Ahora**: logo, título, país, modalidad, categoría, rol del integrante *(10 min)*
2. **Ahora**: los tres textos largos, copiados de arriba *(10 min)*
3. **Ahora**: tecnologías, contrato, enlaces al código y la arquitectura *(5 min)*
4. **Ahora**: subir el PDF, para que la validación corra con tiempo *(2 min)*
5. **Después**: conectar Render y pegar la URL del demo
6. **Al final**: los dos videos

Con los pasos 1 a 4 cierras **cinco de las seis secciones** del formulario en menos de
media hora, sin depender de nada más.
