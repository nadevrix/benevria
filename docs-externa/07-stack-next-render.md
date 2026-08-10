# Stack de despliegue: Next.js + Postgres en Render

## Por qué Render aquí

Render da en su plan gratuito un **Web Service** (Node) y una **PostgreSQL** gestionada.
Suficiente para el entregable "🚀 Link Demo": una URL pública `https://algo.onrender.com`
donde el jurado abre la app y la usa.

### Advertencias del plan gratuito (importantes para el Demo Day)

1. **Cold start.** Los servicios gratuitos se duermen tras ~15 min sin tráfico y tardan
   ~30-60 s en despertar. → *Antes del pitch, abrir la URL y dejarla caliente.*
2. **Las bases de datos gratuitas expiran** tras un período (típicamente ~30 días).
   Irrelevante en 5 días, pero conviene saberlo.
3. **Build lento** en instancias free. Presupuestar tiempo en el primer deploy.

> Mitigación general: **grabar el Video Demo con anticipación.** Es el entregable que
> protege contra cualquier fallo de infraestructura en vivo.

## Configuración del Web Service (monorepo Scaffold)

Como el frontend vive en `packages/nextjs/`, hay que configurarlo así en Render:

| Campo | Valor |
|---|---|
| Root Directory | `proyecto/packages/nextjs` (ajustar a la ruta real del repo) |
| Build Command | `yarn install && yarn build` |
| Start Command | `yarn start` |
| Environment | Node |

Alternativa más simple: dejar Root Directory en la raíz y usar
`yarn install && yarn workspace @se-2/nextjs build`.

## Variables de entorno

Separadas por naturaleza:

| Variable | Ejemplo | Notas |
|---|---|---|
| `DATABASE_URL` | `postgres://...` | La da Render al crear la DB. **Usar la Internal URL** si app y DB están en la misma región (más rápido y no sale a internet) |
| `NEXT_PUBLIC_CHAIN_ID` | `421614` | Arbitrum Sepolia. `NEXT_PUBLIC_` = visible en el navegador |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x...` | Dirección del contrato desplegado |
| `NEXT_PUBLIC_RPC_URL` | `https://sepolia-rollup.arbitrum.io/rpc` | RPC público, o uno de Alchemy si hace falta más cuota |
| `ANTHROPIC_API_KEY` | — | **Sin** `NEXT_PUBLIC_`. Solo en el servidor |
| `DEPLOYER_PRIVATE_KEY` | — | **Nunca** en Render ni en el repo. Solo local, en `.env` ignorado por git |

> **Regla no negociable:** ninguna clave privada de wallet ni API key sale del entorno local
> sin `.gitignore`. Un repo público con una private key es descalificación por descuido y,
> peor, pérdida de fondos.

## Rol de Postgres

Ver la tabla on-chain vs off-chain en `06-scaffold-eth-vs-stylus.md`. En corto:

- **Índice de eventos**: un job lee los logs del contrato y los guarda en tablas
  consultables → permite listados, filtros y paginación rápidos que leyendo la cadena
  serían lentísimos.
- **Datos que no valen la pena on-chain**: textos largos, metadata, perfiles, imágenes (URLs).
- **Resultados de IA**: cachear inferencias para no repagar por cada visita.
- **Analítica del demo**: contadores, historial, dashboard.

### Acceso desde Next.js
Usar API routes / Server Actions (`app/api/...`). El navegador **nunca** habla directo con
Postgres. Cliente sugerido: `postgres.js` o `pg` directo (ligero, sin ORM pesado) o Drizzle
si se quieren migraciones tipadas. Para 5 días, lo más simple gana.

## Checklist de despliegue

- [ ] Repo en GitHub público
- [ ] Crear PostgreSQL en Render, copiar Internal Database URL
- [ ] Crear Web Service apuntando al repo, root dir `packages/nextjs`
- [ ] Cargar variables de entorno
- [ ] Verificar que el build pasa (Next.js falla el build si falta una env var usada en build time)
- [ ] Probar la URL pública desde otro dispositivo / red móvil
- [ ] Conectar wallet desde la URL pública y ejecutar una transacción real de punta a punta
- [ ] Anotar la URL en el entregable "Link Demo"
