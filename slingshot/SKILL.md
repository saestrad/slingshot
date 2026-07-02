---
name: slingshot
description: >-
  Token, context, and model-cost optimizer with a persistent learning loop.
  Use when the user wants to save or optimize tokens, context, or cost; when a
  request is vague and must be translated into precise executable instructions
  (distillation); when choosing which model tier (Haiku/Sonnet/Opus/Fable)
  should run a task or subagent; before delegating work to a cheaper model so
  it performs like a stronger one; when a long session's context is getting
  heavy; at the end of significant tasks to record reusable learnings; and to
  install, update, or check this skill itself. Triggers: "optimize tokens",
  "save context", "which model", "make it cheaper", "distill", "spec this",
  "optimiza tokens", "ahorra contexto", "qué modelo", "hazlo más barato",
  "destila esto", "slingshot".
version: 2.2.0
user-invocable: true
argument-hint: "[distill|route|budget|arsenal · learn|recall|teach · status|install|update|uninstall] [target]"
allowed-tools:
  - Bash(node *)
---

# Slingshot

Small, precise input; outsized result. The operating principle: **spend
expensive tokens once — on specification, routing, and learning — so every
future token is cheaper.** Intelligence placed in the prompt substitutes for
intelligence in the runtime: a weaker model with a dense spec beats a stronger
model with a vague one.

## Two layers

1. **Always-on layer** — a managed rule block injected into `CLAUDE.md` (and
   `AGENTS.md` for other agents) between `SLINGSHOT:BEGIN/END` markers by the
   installer. It carries the economy rules and auto-triggers on every request
   with ~20 lines of standing cost. Source of truth: [rules/rule-block.md](rules/rule-block.md).
2. **Deep layer** — this skill: full protocols, loaded only when a move or
   command actually runs.

An optional `SessionStart` hook injects the ledgers into every session
automatically (see [references/manage.md](references/manage.md)).

## Setup gates (non-optional)

| Gate | Check | If fail |
|---|---|---|
| Installed | The `SLINGSHOT:BEGIN` marker exists in the active `CLAUDE.md` (run `status` if unsure). | Offer `install` once; proceed either way. |
| Reference | The matching reference file is loaded when a command runs. | Load it before continuing. |
| Ledgers | Before DISTILL/ROUTE on significant work, both ledgers were consumed this session. | Run the RECALL move first. |

## Ledgers (the skill's memory)

| Ledger | Path | Survives updates |
|---|---|---|
| Generic | `~/.claude/slingshot/generic.md` — portable techniques, any project | Yes — lives outside the skill folder |
| Project | `.claude/slingshot.md` at the project root — this repo's quirks | Yes — lives in the repo; commit it |

The skill ships `learnings/seed.md`; the installer copies it to the generic
ledger path only if none exists. Updates replace the skill folder wholesale
and **never touch ledgers**.

## Commands

Invoked as `/slingshot <command> [target]`, or auto-triggered per the rule
block. Load the reference before executing the command.

| Command | Category | Description | Reference |
|---|---|---|---|
| `distill [request]` | Optimize | Translate vague intent into an executable Spec Block | [references/distill.md](references/distill.md) |
| `route [task]` | Optimize | Pick minimal sufficient model tier + delegation prompt | [references/route.md](references/route.md) |
| `budget` | Optimize | Audit and correct this session's context economy | [references/budget.md](references/budget.md) |
| `arsenal` | Optimize | Recommend vetted external token-saving tools for the user's workflow | [references/arsenal.md](references/arsenal.md) |
| `learn` | Flywheel | Extract session learnings into the ledgers | [references/learn.md](references/learn.md) |
| `recall [topic]` | Flywheel | Consume ledgers; surface entries relevant to a topic | [references/recall.md](references/recall.md) |
| `teach` | Flywheel | Repo scan + one interview → seed the project ledger | [references/teach.md](references/teach.md) |
| `status` | Manage | Version, install state, rule block, ledger stats | [references/manage.md](references/manage.md) |
| `install` / `update` / `uninstall` | Manage | Run the installer script | [references/manage.md](references/manage.md) |

Bare `/slingshot` with no command → run `status`, then suggest the most
relevant command for the current situation.

## Move summaries

**DISTILL** — extract GOAL / SCOPE / CONSTRAINTS / NON-GOALS / DONE WHEN from
the user's words plus the repo. Infer before asking; at most one batched
question. The Spec Block is the payload: it becomes the prompt for whoever
executes.

**ROUTE** — capability gap is compensated by specification density. Haiku for
mechanical pattern-following with exact examples; Sonnet for implementation
from a full spec; Opus/Fable for ambiguity, architecture, and verification.
The compound pattern: **strong model distills → cheap model executes → script
or strong model verifies.** One failure → fix the spec; two → escalate; never
loop.

**BUDGET** — control what enters the window, what stays, and what always
loads. Files are durable memory; the window is scratch.

**LEARN / RECALL** — after significant tasks, distill 0–2 one-line learnings
into the right ledger; before significant tasks, consume them. Capped,
deduped, falsified entries deleted on sight.

## Anti-goals

- **Never trade correctness for tokens.** A wrong answer is the most
  expensive output there is.
- **No ceremony on trivial tasks.** Distilling "fix this typo" burns more
  than it saves.
- **No visible bureaucracy.** Apply the moves silently; surface them only
  when the user asks about cost or model choice.
