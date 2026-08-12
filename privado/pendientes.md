# Lo que necesito de ti

> Esto es lo único que no puedo hacer yo. Está ordenado por urgencia.

---

## 🔴 1. Fondear la wallet de despliegue (bloquea el despliegue)

```
0x72736bFd6100DA7388C9Bc86c7d32819C465efd9
```

**Red:** Arbitrum Sepolia (chainId 421614)
**Cuánto:** con 0,05 ETH de testnet sobra. La activación del contrato cuesta
~0,000174 ETH; el resto es para las transacciones del demo.

**Faucets:**
- https://faucet.quicknode.com/arbitrum/sepolia
- https://www.alchemy.com/faucets/arbitrum-sepolia
- O puentear Sepolia ETH desde https://bridge.arbitrum.io/

La clave privada está en `proyecto/packages/stylus/.env`, que **está ignorado por git**
(verificado). Es una wallet desechable creada solo para esto: no le mandes fondos reales
ni la reutilices para nada más.

---

## 🟠 2. Decidir el proveedor de inferencia

Necesito una de estas dos:

**Opción A — la rápida:** una API key de OpenRouter (o Together / Groq / DeepInfra).
Se pone en `proyecto/packages/nextjs/.env.local` como `OPENROUTER_API_KEY=...`.
Con esto el chat funciona hoy.

**Opción B — la del pitch:** montar el gateway x402 contra el facilitador de PayAI en
`arbitrum-sepolia`. Está verificado que soporta esa red (ver `02-verificaciones.md`).
Requiere USDC de prueba en la wallet del keeper.

Dejé el código preparado para las dos: la ruta de inferencia lee `BENEVRIA_MODO_PAGO`
(`apikey` o `x402`) y cambia sola.

**Mi recomendación:** arranca con A para tener el demo grabado y seguro, y si sobra
tiempo el domingo, cambias a B. No al revés.

---

## 🟡 3. Los entregables que no puedo producir

| # | Entregable | Estado |
|---|---|---|
| 1 | 🎥 Video Pitch (2–3 min) | ⬜ **lo tienes que grabar tú** |
| 2 | 📑 Pitch Deck PDF | ⬜ te dejo el guion en `05-guion-pitch.md` |
| 3 | 🚀 Link Demo (Render) | 🟡 código listo; falta conectar tu cuenta de Render |
| 4 | 🎬 Video Demo | ⬜ **lo tienes que grabar tú** |
| 5 | 💻 Repo público | 🟡 commits hechos; falta `git remote add` y push a GitHub |
| 6 | 📜 Contratos + Arbiscan | 🟡 se llena solo al desplegar |
| 7 | 🏗️ Diagrama arquitectura | ✅ hecho, Mermaid en el README |

---

## 🟢 4. Trámites que solo puedes hacer tú

- [ ] Registrar el proyecto en la plataforma oficial (platform.ethlima.org)
- [ ] Crear el repo público en GitHub y hacer push
- [ ] Confirmar en el Discord si hay que presentar presencialmente
- [ ] Llenar el formulario de entrega

---

## Nombre del proyecto

**BenevrIA** — *benevolencia* + *IA*. Elegido por ti, y encaja mejor que la alternativa
anterior porque dice la **tesis** (una IA que es bien común) en vez de solo la mecánica.
Combina con la marca **nadevrix**.
