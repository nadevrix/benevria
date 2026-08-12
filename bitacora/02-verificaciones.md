# Verificaciones hechas contra fuentes reales

> Cada afirmación de este documento fue comprobada contra la fuente primaria —una consulta
> a la cadena, un endpoint del proveedor o la documentación oficial— y no contra artículos
> de terceros. Se incluyen las comprobaciones cuyo resultado obligó a cambiar el plan.
>
> Fecha de verificación: **10 de agosto de 2026**.

---

## x402 y Arbitrum

| Pregunta | Respuesta | Cómo se verificó |
|---|---|---|
| ¿Existe un facilitador x402 que soporte Arbitrum Sepolia? | **Sí** | Consulta directa a `facilitator.payai.network/supported` |
| ¿Cuál? | **PayAI** | Expone `{"scheme":"exact","network":"arbitrum-sepolia"}` (v1) y `eip155:421614` (v2) |
| Dirección del facilitador | `0xc6699d2aadA6c36Dfea5C248DD70f9CB0235cB63` | misma fuente |
| ¿Sirve el facilitador de Coinbase? | **No** | Solo base, base-sepolia, ethereum, polygon |
| ¿OpenRouter ya acepta x402? | **No, todavía no** | Se leyó su referencia de API: cero menciones de x402/402/USDC. Solo `Authorization: Bearer`. La prensa dice "está migrando", pero no está vivo |

**Consecuencia de diseño:** el circuito completo puede vivir en Arbitrum Sepolia, pero el
último tramo (gateway → proveedor) sigue pasando por una API key hasta que OpenRouter
termine su migración. **Esto se dice explícitamente en el pitch**, no se disimula.

---

## USDC en Arbitrum Sepolia

La dirección que circula en blogs como "USDC de Arbitrum Sepolia"
(`0x75faf114eafb1BDbe23229901F1749E870f20967`) **no tiene bytecode desplegado**.
Se comprobó con `eth_getCode` contra el RPC público: devuelve `0x` vacío.

→ **Decisión:** desplegar un ERC-20 de prueba propio con EIP-3009
(`transferWithAuthorization`), que es lo que x402 necesita. El USDC bridgeado no
siempre lo implementa; el nativo de Circle sí.

Faucet oficial de Circle para testnets: https://faucet.circle.com/

---

## Scaffold-Stylus

| Dato | Valor |
|---|---|
| Repo oficial | `github.com/Arb-Stylus/scaffold-stylus` (**no** OffchainLabs) |
| Docs | https://arb-stylus.github.io/scaffold-stylus-docs/ |
| `cargo-stylus` requerido | **0.10.8** exacto — coincide con el instalado |
| `rustc` requerido | **1.91.0** (pinneado en `rust-toolchain.toml`) |
| Stack | Rust + Next.js + RainbowKit + Wagmi + Viem + TypeScript |

⚠️ La doc advierte explícitamente: **no usar `stylusup`**, instala versiones incompatibles.

---

## ERC-8004 (consultado, no adoptado)

Es real: estándar de Ethereum para **agentes de IA** con tres registros — Identity
(ERC-721 por agente), Reputation (feedback) y Validation (resultados de validadores).
Avanzó por revisión pública durante 2025 y principios de 2026.

**Decisión: mencionar, no implementar.** Dos razones:
1. Es un estándar genérico de Ethereum, así que **no suma en el 20 % de "Uso del
   Ecosistema Arbitrum"** — el briefing es explícito en eso.
2. Adoptar un borrador a dos días del cierre es alcance que no sobra.

Sí sirve como frase de pitch: la capa de verificadores de BenevrIA sigue ese patrón.

---

## Seguridad de la cadena de suministro npm

Ver `03-seguridad.md` — hay un ataque **activo** que empezó el 4 de agosto de 2026.
