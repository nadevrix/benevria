# Guion del pitch y del demo

> Material para los entregables 1, 2 y 4 (video pitch, deck, video demo).
> Los tienes que grabar tú; el guion está listo.

---

## Video pitch (2–3 min) — el "por qué"

### 0:00–0:25 · El problema, con una frase que se clava

> "Las IAs se entrenaron con el conocimiento de todos nosotros. Después nos lo cobran de
> vuelta a veinte dólares al mes.
>
> Y hay conocimiento que ni siquiera tienen: el trámite que solo sabe quien lo hizo, la
> jerga del oficio, el procedimiento que ningún manual escribió. Eso los modelos lo
> alucinan. Y quien lo sabe no recibe nada por saberlo."

### 0:25–0:50 · La solución en una imagen

> "BenevrIA es una IA gratuita para todos, que la comunidad enseña.
>
> Aportas conocimiento, y un contrato verifica que sea genuinamente nuevo. Ese
> conocimiento sube el nivel del modelo **que todos usan** —aporten o no—. Y cuando entra
> dinero, se reparte entre quienes enseñaron, en proporción exacta a lo que aportaron.
>
> BenevrIA: benevolencia más IA. Una inteligencia artificial que es un bien común."

### 0:50–1:30 · Por qué necesita blockchain (la pregunta del jurado, respondida antes)

> "La pregunta obvia es: ¿esto no funcionaría con una base de datos?
>
> Un servidor puede calcular exactamente lo mismo. Lo que no puede es **probarlo**.
>
> Si mi servidor decide si tu aporte es novedoso, puedo decirte 'es duplicado, no cobras'
> y no tienes cómo comprobarlo. Si mi servidor decide qué modelo corre, puedo decir 'bajó
> de nivel' y quedarme la diferencia. Si mi servidor reparte, el reparto es opaco.
>
> Esas tres decisiones son justo donde yo tendría incentivo a mentir. Por eso están en el
> contrato."

### 1:30–2:10 · Por qué Stylus (completar la frase)

> "El ataque real contra un sistema de 'aporta y gana' no es escribir basura —eso lo filtra
> un `if`—. Es **reenviar lo que ya está, con otras palabras**.
>
> Detectarlo exige comparar el aporte nuevo contra todo el corpus: dieciséis mil
> multiplicaciones y sumas por transacción. **En Solidity eso es impagable en gas.** En
> Stylus, compilado a WASM nativo, es aritmética de registro.
>
> Usamos Stylus porque sin Stylus este contrato no existiría."

### 2:10–2:40 · Ecosistema e impacto

> "Además usamos el precompilado ArbSys para el número real de bloque de L2 —en Arbitrum
> `block.number` te da el de L1, y con eso las épocas de reparto estarían mal—.
> Y x402 para que la tesorería pague su propia inferencia en USDC.
>
> El primer corpus que queremos construir es el conocimiento que los modelos manejan peor:
> el de nuestra región. Ahí hay gente que sabe cosas que valen, y que hoy no cobra por
> saberlas."

---

## Video demo — el orden que hay que grabar

**No expliques mientras haces clic. Haz clic y deja que se vea.**

| # | Acción | Qué se ve |
|---|---|---|
| 1 | Abrir el panel | Nivel actual, corpus, barra de progreso, tesorería. Todo con enlace a Arbiscan |
| 2 | Ir a `/chat` y preguntar algo local | La IA falla o responde pobre. **Este es el "antes"** |
| 3 | Ir a `/temas` y pedir ese tema | Aparece en el panel de demanda con 1 voto |
| 4 | Ir a `/aportar` y pegar basura | Rechazado por las heurísticas, **sin gastar transacción** |
| 5 | Pegar conocimiento real → "Analizar" | Muestra embedding, datos removidos, hash |
| 6 | "Enviar al contrato" → firmar | ✅ Aceptado. Puntos emitidos. Link a Arbiscan |
| 7 | **Volver a enviar lo mismo reformulado** | ❌ **Rechazado: reenvío parafraseado.** Este es el momento clave del video |
| 8 | Volver al panel | El corpus creció, la barra avanzó |
| 9 | Repetir aportes hasta cruzar el umbral | **El nivel cambia en vivo** |
| 10 | Volver a `/chat` | Cabecera muestra el modelo nuevo. **Mismo pregunta, mejor respuesta: el "después"** |
| 11 | Depositar ingreso desde otra wallet | La tesorería sube, la cuota sube |
| 12 | Reclamar de una época cerrada | USDC/ETH cae en la billetera del aportante |

**El plano estrella es el 7.** Que se vea el rechazo del duplicado con el número de
similitud es lo que prueba que el contrato realmente está pensando, no solo guardando.

---

## Estructura del deck (8–10 slides)

1. **Portada** — BenevrIA · IA colectiva sobre Arbitrum · ETH Lima 2026
2. **Problema** — "Se entrenan con tu conocimiento y te lo cobran". Usuario nombrable:
   el profesional que sabe lo que la IA alucina
3. **Solución** — el circuito en una imagen (aportar → verificar → subir nivel → repartir)
4. **Demo** — captura del rechazo del duplicado
5. **Arquitectura** — el diagrama Mermaid del README
6. **Por qué Arbitrum + Stylus** — la frase completada + ArbSys + x402
7. **Por qué no una base de datos** — la tabla de las tres decisiones
8. **Modelo económico** — créditos se venden, puntos se ganan
9. **Roadmap** — x402 directo, disputas optimistas con stake, corpus por dominio
10. **Equipo y contacto**

---

## Preguntas que te van a hacer, y la respuesta

| Pregunta | Respuesta |
|---|---|
| *"¿Esto no funciona con una BD?"* | Un servidor calcula lo mismo pero no puede probarlo. Las tres decisiones on-chain son justo donde el operador tendría incentivo a mentir |
| *"¿La IA corre en el contrato?"* | **No, y sería mentira decir que sí.** El modelo corre fuera. Lo que corre dentro es la verificación. La IA produce el dato, el contrato lo juzga |
| *"¿Por qué no Solidity?"* | 16.000 multiplicaciones-sumas por transacción. Impagable en gas en la EVM |
| *"¿Cómo evitas el farmeo?"* | En capas: heurísticas fuera (baratas), deduplicación dentro (la que decide el pago). El ataque racional es el reenvío, y eso lo mata la similitud coseno on-chain |
| *"¿La tesorería es realmente autónoma?"* | El contrato autoriza y audita; el keeper solo ejecuta y no puede tocar el pozo de los aportantes. **El último tramo hacia el proveedor todavía pasa por una API key porque OpenRouter aún no acepta x402** — lo decimos, no lo disimulamos |
| *"¿Los puntos son un token especulativo?"* | No se pueden comprar. Solo se emiten contra aporte verificado, y son un derecho de cobro proporcional sobre ingresos reales |
| *"¿Qué pasa si nadie compra?"* | La tesorería drena, el nivel baja y la IA se apaga. **No es una máquina de movimiento perpetuo: es un negocio que necesita clientes.** El mecanismo corre solo; la economía necesita demanda |

---

## Lo que NO hay que decir

- ❌ "La IA corre on-chain" — es falso y te lo tumban en 10 segundos
- ❌ "Es completamente autónomo" — el último tramo todavía no lo es
- ❌ "Ayudamos a estudiantes con sus tareas" — no es un slide ganador
- ❌ Prometer que el filtro de datos personales es infalible — ninguno lo es
- ❌ Llamarlo "DePIN" — DePIN es infraestructura física; esto es un mercado de datos
