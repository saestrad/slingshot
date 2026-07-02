# Changelog

## 2.4.0 — 2026-07-02

Dynamic workflows como cuarto vehículo de delegación (doc oficial de Claude
Code, tema del artículo de @ecommartinez que motivó la investigación).

- `route.md`: sección nueva "Beyond subagents: dynamic workflows" — script
  que orquesta hasta 1,000 agentes con resultados intermedios en variables
  (la ventana solo recibe la respuesta final); cuándo enrutar ahí; trigger
  por tarea (`ultracode` en el prompt) vs por sesión (`/effort ultracode`);
  controles de costo (piloto en slice pequeño, modelos baratos por stage,
  guardar el workflow como comando amortiza el plan a cero).
- 3 entradas nuevas en seed + ledger vivo (35 total).

## 2.3.0 — 2026-07-02

Aprendizajes de la era Fable 5 (guía oficial de prompting de Anthropic,
reporte técnico independiente de harness, mediciones de Simon Willison).

- `route.md`: el routing ahora es bidimensional (tier × effort) — frontier
  `low` suele superar el `xhigh` de la generación previa; down-effort antes
  que down-tier. Economía de equipos paralelos (en tareas fáciles un equipo
  de 10 agentes ≈ 0.8x break-even; async > blocking; subagentes long-lived
  amortizan vía cache). Línea EVIDENCE en el prompt de delegación
  (anti-fabricación de estados). Verificador con contexto fresco > autocrítica.
  Frontera de límites: modelos más fuertes necesitan NON-GOALS más estrictos.
- `distill.md`: densidad de spec inversamente proporcional a la capacidad del
  ejecutor (micro-pasos degradan a los modelos frontier); el porqué junto al
  GOAL (intent mejora resultados).
- `rules/rule-block.md`: regla 7 nueva — densidad de spec según ejecutor.
- 6 entradas nuevas en seed + ledger vivo (32 total).

## 2.2.0 — 2026-07-02

Verificación de fuentes + números duros del API oficial de Anthropic.

- Las 10 herramientas del arsenal verificadas contra la API de GitHub
  (existencia, estrellas, actividad, licencia); licencias ELv2/PolyForm
  confirmadas.
- `route.md`: tabla de precios real por MTok (Haiku $1/$5 → Fable $10/$50),
  palancas `output_config.effort` y Batches API (50% dcto).
- `budget.md`: mecánica exacta del prompt cache (prefix match, lecturas
  ~0.1x, escrituras 1.25x, invalidadores silenciosos), `count_tokens` vs
  tiktoken.
- 5 entradas nuevas en el seed del ledger genérico (26 total).

## 2.1.0 — 2026-07-02

- Nuevo comando `arsenal` + `references/arsenal.md`: catálogo verificado de
  herramientas externas de ahorro de tokens (RTK, Token Savior,
  code-review-graph, Context Mode, claude-context, etc.) con veredictos
  honestos, licencias y protocolo de recomendación (máx. 2 por usuario).
- 3 entradas nuevas en el seed del ledger genérico: variantes terse de CLI,
  auditoría de MCP servers instalados (tool definitions = costo fijo por
  request), split de CLAUDE.md gordo en core + docs bajo demanda.

## 2.0.0 — 2026-07-02

Arquitectura Impeccable-style.

- **Capa siempre activa**: bloque administrado inyectado en `CLAUDE.md`/`AGENTS.md`
  entre marcadores `SLINGSHOT:BEGIN/END` (reglas de economía + auto-triggers).
- **8 comandos** `/slingshot <cmd>`: distill, route, budget, learn, recall,
  teach, status, install/update/uninstall.
- **Instalador** `scripts/slingshot.mjs` (Node, cero dependencias):
  scopes global/proyecto, inyección idempotente por marcadores, backup de
  settings, `--hook` opcional.
- **Hook SessionStart** `scripts/session-start.mjs`: inyecta ambos ledgers
  como `additionalContext` en cada sesión.
- **Separación código/datos**: el ledger genérico se muda de la carpeta de la
  skill a `~/.claude/slingshot/generic.md`; `update` reemplaza código
  wholesale sin tocar ledgers. La skill ahora incluye `learnings/seed.md`
  (siembra solo en primera instalación).
- Nuevos references: `recall.md` (consumo de ledgers), `teach.md` (siembra
  deliberada del ledger de proyecto), `manage.md` (ciclo de vida).
- Renombrados: `routing.md`→`route.md`, `context-budget.md`→`budget.md`,
  `learning.md`→`learn.md` (paridad nombre-comando).
- Frontmatter: `version`, `user-invocable`, `argument-hint`, `allowed-tools`.

## 1.0.0 — 2026-07-02

Versión inicial: SKILL.md router con 4 movimientos (DISTILL, ROUTE, BUDGET,
LEARN), 4 references, ledger genérico dentro de la skill.
