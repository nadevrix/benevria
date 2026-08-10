# Formulario de entrega — desglose completo

Campos reales de la plataforma oficial. **6 secciones, 12+ requisitos verificables.**

## Deadline confirmado

| | |
|---|---|
| Cierre | **12 de agosto, 4:00 p.m. Bolivia (GMT-4)** = 3:00 p.m. Lima (GMT-5) |
| Verificado | Contador de la plataforma: 4d 16h 46m desde el 7 ago 11:13 p.m. GMT-4 |

Queda resuelta la discrepancia entre las bases ("4pm") y el banner del sitio ("3pm GMT-5"):
**es la misma hora en husos distintos.** Las bases están escritas en GMT-4.

---

## 🔑 El hallazgo importante

El formulario tiene **tres campos de texto largo** que no aparecían en el listado de
entregables de las bases:

| Campo | Límite | Criterio de la rúbrica que alimenta |
|---|---|---|
| **Descripción detallada** | 500 palabras | Producto y UX (20%) + Implementación Técnica (25%) |
| **Uso de Arbitrum** | 5000 caracteres | **Uso del Ecosistema Arbitrum (20%)** |
| **Problema e impacto** | 5000 caracteres | **Problema e Impacto (20%)** |

Los nombres son literalmente los criterios de la rúbrica. **Esto es donde se califica el 40%
"blando" del puntaje**, probablemente antes de que el jurado abra el demo o el repo.

Consecuencia: escribir bien estos tres textos vale tanto como una feature más. No dejarlos
para las últimas dos horas.

---

## Estrategia: llenar el formulario NO es tarea del último día

> *"Los borradores se guardan aunque todavía no sean enlaces HTTPS completos."*
> *"Guardado. Todavía no hay un título."*

La plataforma guarda borradores. Hay campos que se pueden cerrar **hoy**, sin una sola
línea de código:

### Se pueden llenar ya (sin proyecto)
- [ ] País de representación
- [ ] Modalidad de Demo Day (Presencial / Virtual)
- [ ] Rol del integrante (Rodrigo Ricaldez Martinez — entrega individual)
- [ ] Título del proyecto (se puede cambiar después)

### Se pueden llenar apenas exista la idea
- [ ] Categorías (se pueden combinar; "Ninguno" es exclusivo)
- [ ] Problema e impacto (5000 car.)
- [ ] Uso de Arbitrum (5000 car.)
- [ ] Tecnologías (1–20 nombres)

### Solo al final
- [ ] Logo, links, contratos, videos, PDF

---

## Checklist completo por sección

### 1. Overview — *Sin empezar*
| Campo | Formato | Notas |
|---|---|---|
| ⬜ Logo del proyecto | PNG o SVG, **≤5 MB** | El SVG se muestra sin ejecutar contenido |
| ⬜ Título del proyecto | ≤120 car. | No tiene que ser único |

### 2. Datos de participación
| Campo | Notas |
|---|---|
| ⬜ País de representación | Entrega individual |
| ⬜ Modalidad de Demo Day | **Presencial** o **Virtual** ← decisión con consecuencias, ver abajo |
| ⬜ Categorías | Se pueden combinar. Al menos una. "Ninguno" es exclusivo |

### 3. Equipo — *1 de 1 requisitos*
| Campo | Estado |
|---|---|
| ✅ Integrante: Rodrigo Ricaldez Martinez | Guardado |
| ⬜ Asignar rol al integrante | Requerido para completar la entrega |

### 4. Historia — *0 de 3 requisitos*
| Campo | Límite |
|---|---|
| ⬜ Descripción detallada | 500 palabras |
| ⬜ Uso de Arbitrum | 5000 caracteres |
| ⬜ Problema e impacto | 5000 caracteres |

### 5. Construcción — *0 de 4 requisitos*
| Campo | Notas |
|---|---|
| ⬜ Tecnologías | Entre **1 y 20** nombres únicos |
| ⬜ Smart contracts | Entre **1 y 20**, desplegados en redes Arbitrum elegibles |
| ⬜ Enlace al código | HTTPS, ≤2048 car. *No verifican visibilidad — pero las bases exigen repo público* |
| ⬜ Enlace a arquitectura | HTTPS a diagrama o documento |

> ⚠️ *"No verificamos el proveedor ni la visibilidad"* del repo. Esto **no** te libera:
> las bases exigen repo público y el jurado lo va a abrir. Si está privado, no puntúa.

> ⚠️ El campo de arquitectura pide **un enlace HTTPS**, no un archivo. Un Mermaid dentro
> del README de GitHub sirve (el link apunta al README o a un `ARQUITECTURA.md`).

### 6. Demo y pitch — *0 de 4 requisitos*
| Campo | Notas |
|---|---|
| ⬜ Video de presentación (pitch) | HTTPS. **2–3 min** según las bases |
| ⬜ Demo funcional | HTTPS. ← la URL de Render |
| ⬜ Recorrido en video de la demo | HTTPS. Distinto del pitch |
| ⬜ Pitch Deck | **PDF, ≤25 MB.** Se valida antes de quedar disponible |

> ⚠️ El PDF *"se validará antes de quedar disponible"*. Si la validación tarda o falla,
> quieres enterarte el día 11, no a las 3:55 p.m. del 12. **Subir el deck con antelación,
> aunque sea una versión preliminar, y reemplazarlo después.**

### 7. Documentos adicionales — *opcional*
| Campo | Notas |
|---|---|
| ⬜ Material adicional | Hasta 10. **La etiqueta es obligatoria** por cada uno |

Opcional pero gratis de sumar: link al contrato en Arbiscan, README técnico, capturas,
resultados de tests.

---

## Decisión pendiente: Presencial o Virtual

El formulario obliga a elegir. Consideraciones:

- El evento presencial del **8 de agosto** es en UPC San Isidro, **Lima**.
- Estás en **Bolivia** (GMT-4).
- El hackathon es explícitamente **híbrido**, y la opción "Virtual" existe en el formulario
  → presentar virtualmente es una vía legítima y prevista.

→ Salvo que viajes, la respuesta es **Virtual**. Confirmar en el Discord cómo funciona
el pitch virtual y en qué fecha/hora exacta.

---

## Riesgos de última hora (por orden de probabilidad)

| Riesgo | Mitigación |
|---|---|
| El PDF no pasa validación a última hora | Subir un borrador del deck el día 11 |
| Grabar 2 videos toma más de lo esperado | Presupuestar **3 horas reales** para pitch + demo |
| Render con cold start el día del demo | Abrir la URL antes; el video demo es el respaldo |
| Contrato no desplegado a tiempo | Desplegar un stub a Sepolia el día 1 |
| Los 3 textos largos escritos con prisa | Escribirlos apenas exista la idea, no al final |
| Faltó asignar el rol del integrante | 30 segundos, pero bloquea la entrega |
