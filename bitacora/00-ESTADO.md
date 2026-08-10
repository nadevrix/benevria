# Estado del trabajo — Ayni

> Bitácora viva. Se actualiza en cada avance.
> **Última actualización:** 2026-08-10

## Reloj

| | |
|---|---|
| Cierre de entregas | **12 de agosto, 4:00 p.m. (hora Bolivia)** |
| Tiempo restante al empezar | ~2 días |
| Estado general | 🟡 En construcción |

---

## ✅ Hecho

- [x] Concepto cerrado y validado contra las 5 preguntas eliminatorias del briefing
- [x] Verificación web de x402, facilitadores y soporte de red (ver `02-verificaciones.md`)
- [x] `git init` y repositorio inicializado
- [x] `.npmrc` endurecido contra el ataque de cadena de suministro activo (ver `03-seguridad.md`)
- [x] Bitácora creada

## 🔄 En curso

- [ ] Monorepo Scaffold-Stylus
- [ ] Contrato `AyniCore` en Rust/Stylus

## ⬜ Pendiente

- [ ] Tests del contrato + `cargo stylus check`
- [ ] Despliegue en Arbitrum Sepolia (**requiere fondear wallet — ver `04-para-rodrigo.md`**)
- [ ] Frontend: aportar / chat / dashboard
- [ ] API routes: embeddings + inferencia
- [ ] Despliegue del frontend en Render
- [ ] README con instalación + diagrama Mermaid
- [ ] `CREDITOS.md`
- [ ] Entregables 1–4 (videos, deck) — **los tiene que hacer Rodrigo, no los puedo grabar yo**

---

## El concepto en una pantalla

**Ayni** — del principio andino de reciprocidad: *hoy por ti, mañana por mí*.

Una IA colectiva gratuita cuyo **nivel de modelo lo decide un contrato Stylus** que puntúa
on-chain la calidad y novedad de lo que la comunidad le enseña, con una tesorería auditable
que paga su propia inferencia y reparte los ingresos entre quienes aportaron.

```
Contribuyente aporta conocimiento
        ↓
backend: heurísticas + embedding (truncado a 64 dims)
        ↓
CONTRATO STYLUS (Arbitrum Sepolia)
  · similitud coseno contra el corpus → ¿es novedoso?
  · emite puntos al aportante
  · acumula puntaje colectivo → fija el TIER del modelo
        ↓
Cualquiera pregunta → el frontend lee el tier del contrato → usa ese modelo
        ↓
keeper (solo gasta lo que el contrato autorizó esta época)
        ↓
x402 → USDC → proveedor de inferencia
        ↓
Empresa compra créditos con USDC → tesorería
        ↓
Fin de época: cada aportante reclama su % → USDC a su billetera
```

### Las dos separaciones que sostienen el diseño

| | Colectivo | Individual |
|---|---|---|
| **Nivel del modelo** | ✅ lo gana la comunidad, lo usan todos | |
| **Cuota gratis base** | ✅ tan generosa como permita la tesorería | |
| **Puntos / dinero** | | ✅ solo quien aporta, proporcional |
| **Cuota extra de uso** | | ✅ solo quien aporta |

| | Se vende | Se gana |
|---|---|---|
| **Créditos** (consumibles, no transferibles) | ✅ | |
| **Puntos** (derecho de cobro sobre tesorería) | ❌ nunca | ✅ |

### Por qué pasa los filtros del hackathon

| Filtro | Respuesta |
|---|---|
| ¿Usuario nombrable? | El profesional que sabe algo que la IA alucina y que nadie escribió nunca |
| ¿Funcionaría con una BD? | No: el punto es que el reparto y el nivel sean auditables **sin confiar en el operador** |
| ¿Por qué Stylus? | Similitud coseno sobre el corpus en cada aporte — en Solidity es impagable en gas |
| ¿IA decorativa? | La IA **es** el objeto que sube y baja de nivel, y el juez de calidad |
| ¿Cabe en el tiempo? | Sí con el alcance recortado (ver `01-decisiones.md`) |
