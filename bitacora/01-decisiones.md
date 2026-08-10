# Decisiones tomadas durante la construcción

> Decisiones que tomé yo mientras Rodrigo dormía, con su autorización explícita.
> Todas son reversibles; las marcadas con 🔄 son las que más vale la pena revisar.

---

## Producto

| # | Decisión | Por qué |
|---|---|---|
| 1 | 🔄 **Nombre: Ayni** | Principio andino de reciprocidad (*hoy por ti, mañana por mí*). Es literalmente la mecánica del proyecto y ancla en la región sin sonar forzado. Cambiarlo cuesta 5 minutos |
| 2 | El nivel **sube por conocimiento, baja por tesorería** | Castigar a todos por el spam de un troll haría que la gente se fuera. "No hay con qué pagar" es honesto, automático y auditable |
| 3 | Los puntos **se reinician cada época** | Mucho más simple de implementar y explicar que un saldo perpetuo con valor flotante. Evita además la pregunta regulatoria |
| 4 | El pozo se reparte **30 % aportantes / 70 % inferencia** | La inferencia tiene que sostener el acceso gratuito de todos, que es la tesis del proyecto |
| 5 | **Panel de temas** incluido en el MVP | Es barato (una lista con votos) y resuelve el problema de "¿qué aporto?". Alto retorno por poco código |

## Técnicas

| # | Decisión | Por qué |
|---|---|---|
| 6 | Embeddings **truncados a 64 dimensiones** | 64 × int8 = 64 bytes = exactamente 2 palabras de storage. Con 768 dims sería inviable on-chain |
| 7 | Cuantización **int8** con vectores normalizados | Para vectores unitarios la similitud coseno *es* el producto punto. Sin coma flotante, que además no es determinista entre nodos |
| 8 | **Ventana de 256 vectores** en la comparación | Sin tope, el costo de aportar crecería sin límite hasta no caber en un bloque. El barrido histórico completo es trabajo off-chain |
| 9 | Umbral de duplicado en **0,90 de coseno** | Por encima de eso, dos textos dicen lo mismo con otras palabras. Ajustable si en pruebas resulta muy estricto o muy laxo |
| 10 | **Salida temprana** al detectar duplicado | Seguir comparando cuando ya se sabe que es duplicado es gas quemado |
| 11 | **ArbSys (`0x64`)** para el número de bloque | En Arbitrum `block.number` devuelve el bloque de **L1**. Usarlo daría un reloj ~12× más lento. Además es un punto técnico regalado en la rúbrica |
| 12 | Respaldo a `vm().block_number()` si ArbSys falla | Permite tests nativos y devnode local sin precompilados |
| 13 | **ETH nativo** en la tesorería del MVP, no USDC | El USDC de Arbitrum Sepolia que circula en blogs **no existe** (bytecode vacío, verificado). Meter un ERC-20 propio era alcance que no sobra. USDC queda para el modo x402 |
| 14 | Tesorería en el contrato, **keeper sin poder de retiro** | El keeper solo gasta el presupuesto de inferencia ya autorizado, nunca el pozo de los aportantes. Es lo que hace verdadera la frase "nadie puede desviar ese dinero" |
| 15 | **API compatible con OpenAI**, no SDK propio | Con eso, cualquier IDE o agente existente funciona apuntando la `base_url`. Costo casi cero, impacto alto en Producto/UX |
| 16 | Embedding local de respaldo | El proyecto arranca y se demuestra sin API key. Se declara honestamente que es léxico, no semántico |
| 17 | Solo **modelos de pesos abiertos** | Revender acceso a modelos propietarios choca con sus términos de servicio |

## Alcance — lo que quedó fuera a propósito

| Fuera del MVP | Dónde va |
|---|---|
| x402 en producción (gateway propio) | Código preparado (`AYNI_MODO_PAGO`), falta conectar |
| SDK propio en npm | La API compatible ya cubre el caso |
| Disputas optimistas con stake | Roadmap — es la frase de pitch, no código |
| Juez LLM sobre muestra | Roadmap |
| Filtro del marketplace por dominio | Roadmap |
| ERC-8004 | Solo mención: es estándar genérico de Ethereum, **no suma** en el 20 % de Arbitrum |
| Compra de puntos | **Descartado por diseño**, no por tiempo. Diluiría al contribuyente y sería vender un valor |

---

## Cosas que verifiqué y cambiaron el plan

1. **El USDC "oficial" de Arbitrum Sepolia no existe.** La dirección que circula
   (`0x75faf...`) devuelve bytecode vacío. → tesorería en ETH nativo para el MVP.
2. **OpenRouter todavía no acepta x402.** Verificado contra su propia referencia de API.
   → se documenta como limitación honesta en vez de fingir autonomía total.
3. **El facilitador de Coinbase no cubre Arbitrum Sepolia; el de PayAI sí.** Ahorra ir por
   el camino equivocado.
4. **Scaffold-Stylus no está en OffchainLabs** sino en `Arb-Stylus/scaffold-stylus`.
5. **Hay un ataque de cadena de suministro npm activo** que empezó 5 días antes. Ver
   `03-seguridad.md`.
