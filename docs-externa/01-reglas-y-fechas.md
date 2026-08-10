# Reglas, elegibilidad y fechas

## Fechas críticas

*(Verificado el 2026-08-07 contra hackathon.ethlima.org)*

| Momento | Fecha/hora | Fuente |
|---|---|---|
| KickOff — primer commit válido a partir de aquí | **31 de julio, 4:00 p.m.** | bases del track |
| Hackathon & Workshops | **31 jul – 12 ago** | timeline del sitio |
| "Build & Explore" presencial (UPC San Isidro) | **8 de agosto** | Luma |
| **Cierre de entregas** | **12 de agosto, 3:00 p.m. (GMT-5)** | banner del sitio |
| Corte de evaluación (según bases del track) | 12 de agosto, **4:00 p.m.** | bases del track |
| Evaluación | 15 – 20 de agosto | timeline |
| Anuncio de ganadores | dentro del 15 – 20 de agosto | timeline |
| Post-hackathon (charlas, mentoría) | 22 ago – 6 sep | timeline |
| Hoy | 7 de agosto de 2026 | — |

> **Quedan ~5 días.** Esto condiciona el alcance: MVP demostrable > producto completo.

### ✅ Discrepancia de hora — RESUELTA

El contador de la plataforma oficial (4d 16h 46m restantes al 7 ago 11:13 p.m. GMT-4)
confirma que el cierre es **12 de agosto, 4:00 p.m. GMT-4 = 3:00 p.m. GMT-5**.
Las bases y el banner dicen lo mismo en husos distintos. **Desde Bolivia: 4:00 p.m.**

### ⚠️ Discrepancia pendiente — confirmar con los organizadores

1. **"Demo Day".** El timeline del sitio etiqueta el **8 de agosto** como *Demo Day*, pero
   el evento de Luma de esa fecha ("Build & Explore", UPC San Isidro) se describe como una
   exploración interactiva con "misiones por pasaporte" donde los asistentes conversan con
   los equipos y prueban proyectos — **no** como pitches formales ante jurado.
   Las bases sí exigen "presentar un MVP funcional durante el Demo Day".
   → **Preguntar en el Discord si hay que presentar el 8 de agosto.** Cambia todo el plan.

### Consecuencia práctica inmediata
El historial de commits **es evidencia**. El jurado puede pedirlo. Hay que hacer `git init`
y commits frecuentes con fechas dentro de la ventana. Un repo con un solo commit gigante
al final se ve mal y puede levantar sospechas de reutilización.

## Requisitos generales (obligatorios)

- [ ] Desarrollado durante el período oficial del hackathon.
- [ ] Desplegado en **Arbitrum One**, **Arbitrum Nova** o una **testnet del ecosistema Arbitrum**.
- [ ] Usar tecnologías del ecosistema Arbitrum como **parte fundamental**, no decorativa.
- [ ] Código fuente **público en GitHub**, con instrucciones de instalación y ejecución.
- [ ] Registrar el proyecto en la plataforma oficial antes de la fecha límite.
- [ ] MVP funcional durante el Demo Day.
- [ ] Pitch y demo dentro del tiempo asignado.
- [ ] Equipo de 1 a 4 personas, todos registrados, todos mayores de 18.

*(Equipo de 1 está permitido — este proyecto es solo.)*

## Elegibilidad del código

- El trabajo principal debe hacerse **durante** la hackathon.
- Se permite reutilizar proyectos previos, librerías o infraestructura propia **solo si**
  lo hecho durante la hackathon es una mejora sustancial y verificable.
- Se permite reutilizar material del Bootcamp: investigación, wireframes, prototipos,
  pruebas de concepto. Pero **el MVP y la integración técnica evaluada deben ser de la hackathon**.
- El jurado puede pedir evidencia: commits, historial, demos intermedias.

## Software de terceros

**Permitido:** frameworks, SDKs, APIs, modelos de IA, librerías open source.

**Condiciones:** respetar licencias, **citar su uso en la documentación**, y que sean
herramientas de apoyo — no el producto completo.

> Acción: mantener un archivo `CREDITOS.md` en el proyecto listando todo lo de terceros
> (Scaffold-ETH/Stylus, OpenZeppelin, el modelo de IA que usemos, Render, etc.).

## Conducta ética — prohibido

- Copiar código de otros equipos.
- Sabotear proyectos ajenos.
- Acceder sin autorización a sistemas de terceros.
- Manipular votos o evaluaciones.
- Presentar información falsa.
- Ocultar el uso de herramientas externas cuando se requiera declararlas.

## Riesgo principal a vigilar

> *"El incumplimiento de los requisitos generales podrá descalificar al proyecto."*

Los descalificadores más fáciles de cometer por descuido:
1. Repo privado el día de la entrega.
2. Contrato desplegado solo en local (Hardhat/Anvil) y no en una red Arbitrum real.
3. No registrar el proyecto en la plataforma oficial a tiempo.
4. README sin instrucciones de instalación.
