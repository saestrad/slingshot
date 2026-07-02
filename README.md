# Slingshot 🎯

> Disparar con una resortera; que el resultado sea una explosión intergaláctica.

Skill de optimización de tokens, contexto y costo de modelos para Claude Code
y cualquier agente que lea `AGENTS.md`, con ciclo de aprendizaje persistente y
una capa **siempre activa** instalada como regla en el archivo raíz del agente.

Arquitectura inspirada en [Impeccable](https://impeccable.style/): una skill,
N comandos, gates no opcionales, instalador multi-agente, y separación
estricta entre código (actualizable) y datos (tus aprendizajes, intocables).

## Las dos capas

1. **Siempre activa** — un bloque administrado que el instalador inyecta en
   `CLAUDE.md` (y `AGENTS.md` si existe) entre marcadores
   `<!-- SLINGSHOT:BEGIN -->` / `<!-- SLINGSHOT:END -->`. Son ~20 líneas que
   viajan en **cada request**: reglas de economía + auto-triggers (destilar
   peticiones vagas, enrutar trabajo delegable, registrar y consumir
   aprendizajes). Esto se ejecuta sí o sí, sin invocar nada.
2. **Profunda** — la skill con los protocolos completos, cargada solo cuando
   un movimiento o comando se activa (progressive disclosure: la capa honda
   no cuesta nada hasta que se usa).

Opcional y más fuerte todavía: un hook `SessionStart` que inyecta tus dos
libros de aprendizajes automáticamente al inicio de **cada sesión**
(`--hook` en el instalador).

## Comandos

`/slingshot <comando> [target]` — o se disparan solos vía auto-triggers.

| Comando | Qué hace |
|---|---|
| `distill [petición]` | Intención vaga → Spec Block ejecutable |
| `route [tarea]` | Modelo mínimo suficiente + prompt de delegación |
| `budget` | Auditoría de economía de contexto de la sesión |
| `learn` | Extrae aprendizajes de la sesión a los ledgers |
| `recall [tema]` | Consume los ledgers; muestra entradas por tema |
| `teach` | Escaneo del repo + 1 entrevista → siembra el ledger del proyecto |
| `status` | Versión, estado de instalación, stats de ledgers |
| `install` / `update` / `uninstall` | Ciclo de vida vía script |

El patrón que hace que un modelo inferior rinda como uno superior:

```
modelo fuerte DESTILA → modelo barato EJECUTA → script o modelo fuerte VERIFICA
```

## Los ledgers (datos, nunca los toca un update)

| Ledger | Ruta | Contenido |
|---|---|---|
| Genérico | `~/.claude/slingshot/generic.md` | Técnicas válidas en cualquier proyecto (sembrado con 18 aprendizajes curados) |
| De proyecto | `.claude/slingshot.md` en cada repo | Quirks de ese repo — commitealo y todo el equipo lo hereda |

Formato de una línea por aprendizaje, topes (80/60 líneas), dedupe, y borrado
inmediato de lo falsificado.

## Instalación

Requiere Node 18+.

```bash
# Global (todos tus proyectos, regla en ~/.claude/CLAUDE.md):
node slingshot/scripts/slingshot.mjs install

# Por proyecto (regla en CLAUDE.md y AGENTS.md del proyecto):
node slingshot/scripts/slingshot.mjs install --scope=project --project-dir=<ruta>

# Con inyección automática de ledgers en cada sesión:
node slingshot/scripts/slingshot.mjs install --hook
```

El instalador respeta todo lo existente: solo reemplaza entre sus marcadores,
hace backup de `settings.json` antes de tocar hooks, y jamás pisa un ledger.

## Actualización

```bash
git pull                                          # traer la nueva versión
node slingshot/scripts/slingshot.mjs update       # re-copia código + re-inyecta regla
```

`update` reemplaza el código completo (SKILL.md, references, scripts, regla)
y **nunca** lee ni escribe los ledgers — tus aprendizajes viven fuera de la
unidad actualizable, igual que PRODUCT.md/DESIGN.md en Impeccable. La versión
vive en el frontmatter de `SKILL.md` y en el marcador del bloque inyectado.

```bash
node slingshot/scripts/slingshot.mjs status       # ver qué versión hay dónde
node slingshot/scripts/slingshot.mjs uninstall    # quita regla, hook y skill; conserva ledgers
```

## Estructura

```
slingshot/
├── SKILL.md                  # Router: comandos, gates, movimientos (version en frontmatter)
├── rules/
│   └── rule-block.md         # Fuente de verdad del bloque siempre-activo
├── references/               # Un protocolo por comando, carga bajo demanda
│   ├── distill.md  route.md  budget.md
│   ├── learn.md    recall.md teach.md
│   └── manage.md
├── learnings/
│   └── seed.md               # Semilla del ledger genérico (solo primera instalación)
└── scripts/
    ├── slingshot.mjs         # install | update | status | uninstall
    └── session-start.mjs     # Hook SessionStart: inyecta ledgers como additionalContext
```

## Anti-metas

- Nunca sacrificar correctitud por tokens.
- Cero ceremonia en tareas triviales.
- Cero burocracia visible: los movimientos se aplican en silencio.
