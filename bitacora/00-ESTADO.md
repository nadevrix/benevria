# Estado del trabajo — BenevrIA

> Bitácora viva. **Última actualización: 2026-08-10, madrugada.**

## Reloj

| | |
|---|---|
| Cierre de entregas | **12 de agosto, 4:00 p.m. (hora Bolivia)** |
| Estado general | 🟢 MVP construido y probado · 🔴 bloqueado en fondeo para desplegar |

---

## ✅ Hecho

### Contrato
- [x] `BenevriaCore` en Rust/Stylus: verificación de novedad on-chain por similitud coseno
- [x] Matemática vectorial en punto fijo (módulo `vector.rs` separado y testeado)
- [x] Rechazo de duplicados exactos (hash) y parafraseados (coseno > 0,90)
- [x] Nivel colectivo = mín(conocimiento acumulado, tesorería disponible)
- [x] Épocas vía precompilado **ArbSys `0x64`**, con respaldo a `block_number`
- [x] Tesorería: ingreso partido 30/70, reparto proporcional, keeper acotado
- [x] Panel de demanda de temas con votos
- [x] **28/28 tests pasan**
- [x] **`cargo stylus check` OK** — 33,1 KB, activación 0,000174 ETH
- [x] ABI exportado

### Frontend
- [x] Panel: nivel, barra de progreso, qué frena el nivel, tesorería, época, bloque L2
- [x] `/aportar`: separa visualmente las dos capas (fuera vs dentro de la cadena)
- [x] `/chat`: lee el nivel del contrato para elegir modelo
- [x] `/temas`: panel de demanda
- [x] `/api/embedding`: heurísticas + filtro de datos personales + embedding + empaquetado
- [x] `/api/chat`: nivel on-chain → modelo, con modos `apikey` y `x402`
- [x] Embedding local de respaldo (arranca sin API key)
- [x] **`next build` OK, TypeScript sin errores**, 12 rutas

### Infraestructura y seguridad
- [x] Scaffold-Stylus clonado desde el repo correcto y endurecido
- [x] Defensas contra el ataque npm activo (ver `03-seguridad.md`)
- [x] Yarn verificado por hash contra el release oficial
- [x] Pipeline de despliegue probado de punta a punta
- [x] Wallet de despliegue generada
- [x] 3 commits con fechas dentro de la ventana del hackathon

### Documentación
- [x] `README.md` con instalación, arquitectura y limitaciones declaradas
- [x] **Diagrama Mermaid** (entregable 7 ✅)
- [x] `CREDITOS.md` (requisito del hackathon)
- [x] Bitácora completa: decisiones, verificaciones, seguridad, guion de pitch

---

## 🔴 Bloqueado — necesita a Rodrigo

**Fondear `0x72736bFd6100DA7388C9Bc86c7d32819C465efd9` en Arbitrum Sepolia.**

El despliegue está listo y falla **únicamente** por esto:

```
not enough funds in account 0x72736bFd6100DA7388C9Bc86c7d32819C465efd9
balance 0 < 167479783972923 wei
```

Con fondos, un solo comando lo despliega:
```bash
cd proyecto && yarn deploy --network arbitrumSepolia
```

Detalle en `04-para-rodrigo.md`.

---

## ⬜ Pendiente después del despliegue

- [ ] Rellenar `NEXT_PUBLIC_BENEVRIA_ADDRESS` y la tabla de contratos del README
- [ ] Desplegar el frontend en Render
- [ ] Sembrar el corpus con 5–10 aportes reales para que el demo tenga sustancia
- [ ] Grabar video pitch y video demo (guion listo en `05-guion-pitch.md`)
- [ ] Armar el deck (estructura lista en `05-guion-pitch.md`)
- [ ] Push a GitHub público
- [ ] Registrar en la plataforma oficial

---

## El concepto en una pantalla

**BenevrIA** — *benevolencia* + *IA*: una IA concebida como bien común.

Una IA colectiva gratuita cuyo **nivel de modelo lo decide un contrato Stylus** que puntúa
on-chain la calidad y novedad de lo que la comunidad le enseña, con una tesorería auditable
que paga su propia inferencia y reparte los ingresos entre quienes aportaron.

### Las dos separaciones que lo sostienen

| | Colectivo | Individual |
|---|---|---|
| Nivel del modelo | ✅ lo gana la comunidad, lo usan todos | |
| Puntos / dinero | | ✅ solo quien aporta, proporcional |

| | Se vende | Se gana |
|---|---|---|
| Créditos (consumibles) | ✅ | |
| Puntos (derecho de cobro) | ❌ nunca | ✅ |

### Por qué pasa los filtros

| Filtro | Respuesta |
|---|---|
| ¿Usuario nombrable? | El profesional que sabe lo que la IA alucina y hoy no cobra por ello |
| ¿Funcionaría con una BD? | No: un servidor calcula lo mismo pero no puede **probarlo** |
| ¿Por qué Stylus? | ~16.000 mult-sumas por transacción — impagable en Solidity |
| ¿IA decorativa? | La IA **es** el objeto que sube y baja de nivel |
| ¿Cabe en el tiempo? | Ya cabe: está construido y probado |
