# Bitácora de decisiones

Registro de qué decidimos y por qué. Sirve para el pitch y para no re-discutir lo mismo.

| # | Fecha | Decisión | Motivo | Estado |
|---|---|---|---|---|
| 1 | 2026-08-07 | Separar `docs-externa/` (contexto) y `proyecto/` (código) | El repo entregable debe ser navegable; la doc de estudio no ensucia el código | ✅ |
| 2 | 2026-08-07 | Frontend en Next.js, base de datos Postgres, ambos en Render | Definido por el usuario. Compatible con los scaffolds, que ya son Next.js | ✅ |
| 3 | 2026-08-08 | **Apuntar al bounty 🔴 Advanced** (Scaffold-Stylus + Rust + IA) | Decisión del usuario. Con la rúbrica de la web, lo técnico+blockchain pesa 60%. Además tiene experiencia previa en Rust on-chain (top global Stellar) | ✅ |
| 4 | 2026-08-08 | Base: **Scaffold-Stylus** | Obligatorio para el bounty Advanced | ✅ |
| 5 | 2026-08-08 | Red: **Arbitrum Sepolia** | Gratis, permitida explícitamente, soporta Stylus | ✅ |
| 6 | 2026-08-08 | Categoría: **IA y Tecnologías Emergentes** (probable) | Es la categoría oficial que corresponde a Stylus + IA | 🟡 tentativa |
| 7 | — | Idea / caso de uso | — | ⬜ **pendiente — bloqueante** |
| 8 | — | Rol exacto de la IA en el flujo | — | ⬜ pendiente |

## Preguntas abiertas

### Bloqueantes
- **¿Qué problema resolvemos y para qué usuario?** (define todo lo demás)
- ¿Qué hace el contrato Stylus que no sería razonable hacer en Solidity?
- ¿Qué rol exacto tiene la IA en el flujo, y por qué no es decorativa?

### Por confirmar con los organizadores (Discord)
- **¿Qué rúbrica rige?** La de la web (6 criterios, pitch 5%) o la del texto de bases
  (5 criterios, pitch 15%). Ver `02-rubrica-y-premios.md`
- ¿Hay que presentar presencialmente el 8 de agosto, o basta la modalidad Virtual?
- ¿Cuándo se publican los requisitos definitivos de los bounties? (hoy son "preliminares")
- ¿Qué es el bounty **"Best Stylus Project"** que aparece en la web?
- ¿Cuál es el desglose de premios? (la pestaña dice "Por anunciar")

### Trámites
- ¿Se registró ya el proyecto en la plataforma oficial?
- Llenar los campos del formulario que no dependen de la idea (ver `12-formulario-entrega.md`)
