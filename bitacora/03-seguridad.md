# Endurecimiento contra el ataque de cadena de suministro activo

> Esto no es paranoia genérica: hay una campaña **en curso** que empezó cinco días antes
> de que montáramos el proyecto, y afecta a dependencias que Next.js arrastra sola.

## Qué está pasando

**ChainDrop / Shai-Hulud — 4 al 6 de agosto de 2026.**

Atacantes comprometieron la cuenta de GitHub del mantenedor de `keyv` y publicaron un
gusano autopropagante en **~444 paquetes y más de 2.234 versiones**, con más de 2.000
millones de descargas mensuales combinadas.

Paquetes afectados incluyen `keyv`, `cacheable`, `flat-cache` y `file-entry-cache`.
**`flat-cache` y `file-entry-cache` son dependencias de eslint**, así que entran solas
en cualquier proyecto Next.js.

El payload añade un hook `preinstall` que descarga el runtime Bun y ejecuta un stealer
ofuscado de 728 KB que roba: tokens de `.npmrc`, tokens de GitHub CLI, credenciales de
AWS, tokens de Vault, configs de Kubernetes y **wallets de cripto**.

### Por qué la procedencia firmada no sirvió de nada

El ataque no fue contra npm, fue contra **GitHub**. Empujaron a `main` y cortaron un
release, así que las versiones envenenadas se publicaron **con procedencia válida
firmada por GitHub Actions**. Toda herramienta que verifica "¿este paquete viene del repo
que dice?" respondía que sí — porque venía.

Otros incidentes de 2026 relevantes: `axios` 1.14.1 y 0.30.4 (marzo, RAT),
`viem-js` (paquete falso que imita a `viem`; el legítimo es `viem` a secas),
`@bitwarden/cli` 2026.4.0, `@redhat-cloud-services` (32 paquetes, junio).

---

## Qué se hizo en este proyecto

### 1. `ignore-scripts` — la defensa que no depende de confiar en nadie

En `.npmrc` y en `.yarnrc.yml` (`enableScripts: false`).

El vector **siempre** es un hook `preinstall`/`postinstall`. Desactivarlos significa que
aunque se descargue una versión envenenada, **el payload nunca se ejecuta**. No hay que
saber qué paquete está comprometido.

### 2. `before=2026-07-27` — corte temporal

npm resuelve versiones como si fuera esa fecha. Las 2.234 versiones envenenadas del 4 de
agosto quedan **fuera de alcance por construcción**, no por confianza.

### 3. Clonar desde git, no `npx create-*`

`npx` descarga y **ejecuta** código arbitrario de inmediato. Scaffold-Stylus se clonó con
`git clone`, que solo baja archivos.

### 4. Verificación por hash del binario de yarn

El repo trae su propio ejecutable (`.yarn/releases/yarn-3.2.3.cjs`, 2,1 MB) que hay que
correr. Se descargó el yarn 3.2.3 oficial de `repo.yarnpkg.com` y se comparó:

```
311cd84f5f144680cc21b4bbbdeba97d1a5f32ee8a2eae7037ccbdeff8a3c1ce  (repo)
311cd84f5f144680cc21b4bbbdeba97d1a5f32ee8a2eae7037ccbdeff8a3c1ce  (oficial)
✅ idénticos
```

### 5. Eliminación de código ejecutable no pedido

- `.husky/` y el script `postinstall: husky install` — instalaban git hooks que corren
  en cada commit.
- **`.claude/skills/`** — el repo clonado traía instrucciones dirigidas a un agente de IA.
  Un repo de terceros puede incluir texto diseñado para que un asistente haga algo que el
  usuario no pidió. No se necesitaban: fuera.

### 6. Escaneo de patrones

Se revisó todo el código del repo (excluyendo `node_modules`) buscando `curl | bash`,
`eval(`, `atob(`, `Buffer.from(...base64)`, `child_process` y lecturas de
`process.env.NPM_TOKEN` / `.npmrc`.

Resultado: los `child_process` encontrados son de los scripts de despliegue del propio
scaffold (legítimos) y los `curl | bash` son texto de ayuda que se imprime, no se ejecuta.

### 7. Orden de operaciones

La wallet de despliegue se generó **después** de instalar y auditar, nunca antes. Si algo
hubiera tenido acceso a credenciales durante la instalación, no había ninguna que robar.

---

## Lo que queda pendiente de vigilar

- La clave privada vive en `packages/stylus/.env`, **ignorado por git** (verificado con
  `git check-ignore`). Es una wallet desechable de testnet.
- Antes de hacer push al repo público, revisar que no haya secretos: `git log -p | grep -i`
  buscando `PRIVATE_KEY`, `API_KEY`, `0x[a-f0-9]{64}`.
- No correr `yarn install` sin `enableScripts: false` en el `.yarnrc.yml`.
