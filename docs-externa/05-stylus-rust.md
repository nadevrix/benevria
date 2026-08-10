# Arbitrum Stylus (contratos en Rust)

## Qué es

Normalmente los smart contracts se escriben en **Solidity** y corren en la **EVM**.
**Stylus** añade una segunda máquina virtual, basada en **WASM**, que corre *junto* a la EVM
en la misma cadena. Eso permite escribir contratos en **Rust**, C o C++ y desplegarlos en Arbitrum.

Los dos mundos son **interoperables**: un contrato Stylus puede llamar a uno de Solidity y
viceversa, comparten el mismo estado y las mismas direcciones. Desde el frontend se llama
igual: ABI + `viem`/`ethers`, sin saber en qué lenguaje está escrito.

## Por qué importa (más allá de "es Rust")

1. **Costo de ejecución mucho menor.** WASM es órdenes de magnitud más eficiente que la EVM
   para cómputo. Operaciones que en Solidity serían inviables por gas se vuelven prácticas.
2. **Memoria barata.** En la EVM la memoria crece cuadráticamente en costo; en Stylus no.
   Esto habilita algoritmos con estructuras de datos reales.
3. **Ecosistema de librerías de Rust.** Criptografía, matemática, parsing, compresión —
   crates existentes y auditados, en vez de reimplementar en Solidity.
4. **Seguridad del lenguaje.** Rust elimina clases enteras de bugs por su sistema de tipos.

## La frase clave del bounty

> *"Se valorará el aprovechamiento de las capacidades de Stylus **más allá de una
> implementación trivial**."*

Traducción: un contador o un ERC-20 portado a Rust **no impresiona**. Lo que impresiona es
un contrato que hace algo que **sería imposible o carísimo en Solidity**. Ideas de esa clase:

- **Verificación criptográfica on-chain**: firmas BLS/Ed25519, verificación de pruebas,
  Merkle proofs grandes, hashing no nativo de la EVM.
- **Cómputo numérico**: scoring, matemática de punto fijo, estadística, simulaciones,
  motores de precio o riesgo.
- **Procesamiento de datos**: parsing de estructuras, compresión/descompresión,
  validación de payloads grandes.
- **Inferencia ligera de ML on-chain**: evaluar un modelo pequeño (regresión, árbol de
  decisión, red neuronal diminuta) con pesos guardados en el contrato.
- **Motores de reglas / matching**: order books, matching de ofertas, algoritmos de asignación.
- **Estructuras de datos avanzadas**: bitmaps, tries, índices, colas de prioridad.

> El punto: elegir un caso de uso donde el jurado pueda ver el "por qué Stylus" en una frase.

## Herramientas

- **Stylus SDK for Rust** — macros y tipos para definir storage, métodos y eventos.
  Se parece a Solidity pero en Rust: `#[storage]`, `#[public]`, `#[entrypoint]`.
- **`cargo stylus`** — CLI oficial. Comandos principales:
  - `cargo stylus new <nombre>` — plantilla de proyecto
  - `cargo stylus check` — valida que el WASM sea desplegable y estima el costo
  - `cargo stylus deploy` — despliega a la red
  - `cargo stylus export-abi` — genera la ABI Solidity para el frontend
- **Target de compilación**: `wasm32-unknown-unknown`

### Preparación del entorno (verificar contra docs oficiales antes de correr)
```bash
rustup target add wasm32-unknown-unknown
cargo install --force cargo-stylus
```

## Flujo de trabajo típico

```
escribir contrato Rust
        ↓
cargo stylus check          ← valida WASM + estima gas de despliegue
        ↓
cargo stylus deploy         ← a Arbitrum Sepolia
        ↓
cargo stylus export-abi     ← ABI Solidity
        ↓
frontend Next.js con viem/wagmi usando esa ABI
```

## Riesgos a tener presentes (quedan pocos días)

| Riesgo | Mitigación |
|---|---|
| Curva de Rust + SDK | Mantener el contrato Stylus pequeño y con una sola responsabilidad clara |
| Tamaño del WASM excede el límite | Compilar en release, `opt-level="z"`, evitar dependencias pesadas |
| Fallo en el despliegue el último día | Desplegar algo mínimo a Sepolia **el día 1**, aunque sea un stub |
| Bloqueo total con Stylus | Plan B: Solidity + Scaffold-ETH (bounty Basic) |

**Regla de oro:** conseguir una dirección de contrato Stylus en Arbiscan lo antes posible.
Todo lo demás (features, UI, IA) se puede iterar; el despliegue es el riesgo binario.
