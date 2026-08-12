# Estado del proyecto

> Resumen de lo construido y de lo verificado, con enlaces a lo que puede comprobarse
> de forma independiente.
>
> Última actualización: **12 de agosto de 2026**.

---

## Despliegue

| | |
|---|---|
| **Aplicación** | https://benevria.onrender.com |
| **Repositorio** | https://github.com/nadevrix/benevria |
| **Contrato** | [`0xdf48b19a…5066e6d`](https://sepolia.arbiscan.io/address/0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d) |
| **Red** | Arbitrum Sepolia · chainId 421614 |

---

## Estado en cadena

| Métrica | Valor |
|---|---|
| Corpus verificado | 9 aportes |
| Puntaje colectivo | 44.265 |
| Temas pedidos | 4 |
| Nivel por conocimiento | Base — faltan 5.735 para Bronce |
| Nivel por tesorería | Plata |
| **Nivel efectivo** | **Base** (el mínimo de los dos) |
| Presupuesto de inferencia | 0,056 ETH |
| Pozo de aportantes | 0,024 ETH |

El nivel efectivo es Base aunque la tesorería alcance para Plata: **falta enseñanza, no
dinero**. Es la mecánica funcionando, y se observa en el panel de la aplicación.

---

## Componentes

### Contrato — Rust sobre Arbitrum Stylus

- Verificación de novedad on-chain mediante similitud coseno en punto fijo sobre
  embeddings de 64 dimensiones cuantizados a `int8`
- Rechazo de duplicados exactos (por hash) y de reenvíos parafraseados (coseno > 0,90),
  con salida temprana para acotar el gas
- Nivel colectivo = mínimo entre conocimiento acumulado y tesorería disponible
- Épocas calculadas con el precompilado **ArbSys `0x64`**, con respaldo a `block_number`
- Tesorería con reparto proporcional; el keeper no puede acceder al pozo de los aportantes
- Panel de demanda de temas con voto único por dirección
- **28 pruebas automatizadas**, todas en verde
- `cargo stylus check` correcto — 32,6 KB

### Aplicación — Next.js

| Ruta | Requiere wallet | Función |
|---|---|---|
| `/` | no | Portada: problema, funcionamiento y justificación técnica |
| `/chat` | **no** | La IA, gratuita para cualquiera |
| `/aportar` | sí | Aportar conocimiento |
| `/temas` | sí | Panel de demanda |
| `/panel` | no | Estado del protocolo leído de la cadena |
| `/recompensas` | sí | Cobro proporcional, con el cálculo a la vista |

Compilación de producción sin errores de TypeScript.

### Infraestructura

- Endurecimiento frente a la campaña de ataques a npm de agosto de 2026 (ver
  [`03-seguridad.md`](./03-seguridad.md))
- Despliegue continuo desde `main` mediante Blueprint de Render
- Sin credenciales en el repositorio: verificado sobre el historial completo

---

## Comprobaciones independientes

**ArbSys resuelve en producción.** `bloqueL2()` devuelve un valor por encima de los 297
millones, mientras que el bloque de L1 Sepolia va por 11,4 millones. La llamada al
precompilado `0x64` está resolviendo de verdad y no cae al valor de respaldo.

**La detección de reenvíos está medida, no supuesta.** Un mismo trámite escrito de tres
formas, comparado contra el original:

| Variante | Similitud | Veredicto |
|---|---|---|
| Reenvío casi idéntico | 99,3 % | Rechazado |
| Reescrito con otras palabras | 67,5 % | Aceptado |
| Tema distinto | 22,1 % | Aceptado |

**El circuito funciona desde internet.** La API de la aplicación desplegada lee el nivel
del contrato y sirve el modelo correspondiente, con cadena de respaldo cuando el proveedor
se satura.

---

## Documentos de este registro

| Documento | Contenido |
|---|---|
| [`01-decisiones.md`](./01-decisiones.md) | Decisiones de producto, técnicas y de alcance, con su razonamiento |
| [`02-verificaciones.md`](./02-verificaciones.md) | Comprobaciones contra fuentes primarias, incluidas las que cambiaron el plan |
| [`03-seguridad.md`](./03-seguridad.md) | Endurecimiento frente al ataque de cadena de suministro de npm |

La documentación técnica de instalación y arquitectura está en
[`proyecto/README.md`](../proyecto/README.md).
