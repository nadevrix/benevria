# BenevrIA

> Una IA gratuita para todos, cuyo **nivel de modelo lo decide un contrato inteligente**
> según el conocimiento que la comunidad le enseña.

**Hackathon Ethereum Lima 2026 · Track Arbitrum · Categoría: IA y Tecnologías Emergentes**

---

## Contrato desplegado

| Contrato | Red | Dirección | Explorador |
|---|---|---|---|
| `BenevriaCore` | Arbitrum Sepolia (421614) | `0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d` | [Arbiscan](https://sepolia.arbiscan.io/address/0xdf48b19ad2c77050fe08fef0dde577f4e5066e6d) |

---

## Qué hay en este repositorio

| Carpeta | Contenido |
|---|---|
| **[`proyecto/`](./proyecto)** | **El código entregable.** Contrato Stylus en Rust, aplicación Next.js, scripts de despliegue y siembra. [Ver documentación completa →](./proyecto/README.md) |
| [`bitacora/`](./bitacora) | Registro de construcción: decisiones tomadas y por qué, verificaciones hechas contra fuentes, endurecimiento de seguridad y guion del pitch |
| [`docs-externa/`](./docs-externa) | Investigación previa del hackathon: reglas, rúbrica, ecosistema Arbitrum |
| [`entregables/`](./entregables) | Pitch deck en PDF |

---

## Arranque rápido

```bash
cd proyecto
yarn install
yarn start          # http://localhost:3000
```

Los detalles —requisitos, variables de entorno, tests y despliegue— están en
**[`proyecto/README.md`](./proyecto/README.md)**.

---

## En una frase

Las IAs se entrenaron con el conocimiento de todos y después nos lo cobran. BenevrIA le da
la vuelta: aportas lo que sabes, **un contrato Stylus verifica on-chain que sea
genuinamente nuevo**, y eso sube el nivel del modelo *que todos usan* — aporten o no.
Cuando entra dinero, cobra quien enseñó, en proporción exacta a su novedad verificada.

La razón de que viva en una cadena y no en un servidor: un backend puede calcular
exactamente lo mismo, pero no puede **probarlo**. Las tres decisiones que están on-chain
—si tu aporte es nuevo, qué modelo corre y cuánto le toca a cada quien— son justo aquellas
donde el operador tendría incentivo a mentir.

## Licencia

MIT
