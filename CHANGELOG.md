# Changelog

## 2.4.0 — 2026-07-02

Dynamic workflows as a fourth delegation vehicle (official Claude Code docs).

- `route.md`: new section "Beyond subagents: dynamic workflows" — a script
  that orchestrates up to 1,000 agents with intermediate results held in
  variables (the window only receives the final answer); when to route there;
  per-task trigger (`ultracode` in the prompt) vs session-wide
  (`/effort ultracode`); cost controls (pilot on a small slice, cheap models
  per stage, saving a workflow as a command amortizes the plan to zero).
- 3 new entries in seed + live ledger (35 total).

## 2.3.0 — 2026-07-02

Learnings from the Fable 5 era (Anthropic's official prompting guide, an
independent technical harness report, Simon Willison's measurements).

- `route.md`: routing is now two-dimensional (tier × effort) — frontier
  `low` often exceeds the previous generation's `xhigh`; down-effort before
  down-tier. Parallel-team economics (on easy tasks a 10-agent team ≈ 0.8x
  break-even; async > blocking; long-lived subagents amortize via cache).
  EVIDENCE line in the delegation prompt (anti status-fabrication).
  Fresh-context verifier > self-critique. Boundary frontier: stronger models
  need stricter NON-GOALS.
- `distill.md`: spec density inversely proportional to executor capability
  (micro-steps degrade frontier models); the why alongside the GOAL (intent
  improves results).
- `rules/rule-block.md`: new rule 7 — spec density matched to the executor.
- 6 new entries in seed + live ledger (32 total).

## 2.2.0 — 2026-07-02

Source verification + hard numbers from Anthropic's official API.

- All 10 arsenal tools verified against the GitHub API (existence, stars,
  activity, license); ELv2/PolyForm licenses confirmed.
- `route.md`: real per-MTok price table (Haiku $1/$5 → Fable $10/$50),
  `output_config.effort` and Batches API (50% off) levers.
- `budget.md`: exact prompt-cache mechanics (prefix match, ~0.1x reads,
  1.25x writes, silent invalidators), `count_tokens` vs tiktoken.
- 5 new entries in the generic ledger seed (26 total).

## 2.1.0 — 2026-07-02

- New `arsenal` command + `references/arsenal.md`: a vetted catalog of
  external token-saving tools (RTK, Token Savior, code-review-graph, Context
  Mode, claude-context, etc.) with honest verdicts, licenses, and a
  recommendation protocol (max 2 per user).
- 3 new entries in the generic ledger seed: terse CLI variants, auditing
  installed MCP servers (tool definitions = fixed per-request cost), splitting
  a fat CLAUDE.md into core + on-demand docs.

## 2.0.0 — 2026-07-02

Two-layer architecture: always-on rule + deep skill on demand.

- **Always-on layer**: managed block injected into `CLAUDE.md`/`AGENTS.md`
  between `SLINGSHOT:BEGIN/END` markers (economy rules + auto-triggers).
- **8 commands** `/slingshot <cmd>`: distill, route, budget, learn, recall,
  teach, status, install/update/uninstall.
- **Installer** `scripts/slingshot.mjs` (Node, zero dependencies):
  global/project scopes, idempotent marker-based injection, settings backup,
  optional `--hook`.
- **SessionStart hook** `scripts/session-start.mjs`: injects both ledgers as
  `additionalContext` each session.
- **Code/data separation**: the generic ledger moves out of the skill folder
  to `~/.claude/slingshot/generic.md`; `update` replaces code wholesale
  without touching ledgers. The skill now ships `learnings/seed.md`
  (seeded only on first install).
- New references: `recall.md` (ledger consumption), `teach.md` (deliberate
  seeding of the project ledger), `manage.md` (lifecycle).
- Renames: `routing.md`→`route.md`, `context-budget.md`→`budget.md`,
  `learning.md`→`learn.md` (name-command parity).
- Frontmatter: `version`, `user-invocable`, `argument-hint`, `allowed-tools`.

## 1.0.0 — 2026-07-02

Initial version: SKILL.md router with 4 moves (DISTILL, ROUTE, BUDGET,
LEARN), 4 references, generic ledger inside the skill.
