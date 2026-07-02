# Slingshot 🎯

> Fire a slingshot; make the result an intergalactic explosion.

A token, context, and model-cost optimizer for Claude Code and any agent that
reads `AGENTS.md`, with a persistent learning loop and an **always-on** layer
installed as a rule in the agent's root file.

The operating principle: **spend expensive tokens once — on specification,
routing, and learning — so every future token is cheaper.** One skill, nine
commands, non-optional gates, a multi-agent installer, and a strict separation
between code (updatable) and data (your learnings, untouchable).

## The two layers

1. **Always-on** — a managed block the installer injects into `CLAUDE.md`
   (and `AGENTS.md` if present) between the
   `<!-- SLINGSHOT:BEGIN -->` / `<!-- SLINGSHOT:END -->` markers. It's ~20
   lines that ride along in **every request**: economy rules + auto-triggers
   (distill vague requests, route delegable work, record and consume
   learnings). This runs no matter what, without invoking anything.
2. **Deep** — the skill with the full protocols, loaded only when a move or
   command actually runs (progressive disclosure: the deep layer costs nothing
   until it's used).

Optional and stronger still: a `SessionStart` hook that injects your two
learning ledgers automatically at the start of **every session**
(`--hook` in the installer).

## Commands

`/slingshot <command> [target]` — or triggered automatically via auto-triggers.

| Command | What it does |
|---|---|
| `distill [request]` | Vague intent → executable Spec Block |
| `route [task]` | Minimal sufficient model + delegation prompt |
| `budget` | Audit of the session's context economy |
| `arsenal` | Recommends vetted external token-saving tools (max 2, never installs without confirmation) |
| `learn` | Extracts session learnings into the ledgers |
| `recall [topic]` | Consumes the ledgers; surfaces entries by topic |
| `teach` | Repo scan + 1 interview → seeds the project ledger |
| `status` | Version, install state, ledger stats |
| `install` / `update` / `uninstall` | Lifecycle via the script |

The pattern that makes a lower model perform like a higher one:

```
strong model DISTILLS → cheap model EXECUTES → script or strong model VERIFIES
```

## The ledgers (data — an update never touches them)

| Ledger | Path | Contents |
|---|---|---|
| Generic | `~/.claude/slingshot/generic.md` | Techniques valid in any project (seeded with 35 curated learnings, verified against primary sources) |
| Project | `.claude/slingshot.md` in each repo | That repo's quirks — commit it and the whole team inherits it |

One line per learning, hard caps (80/60 lines), dedupe, and immediate deletion
of anything falsified.

## Installation

Requires Node 18+.

**Via npm (recommended) — no cloning:**

```bash
# Global (all your projects, rule in ~/.claude/CLAUDE.md):
npx @saestrad/slingshot install

# Per project:
npx @saestrad/slingshot install --scope=project --project-dir=<path>

# With automatic ledger injection each session:
npx @saestrad/slingshot install --hook

# Update to the latest version:
npx @saestrad/slingshot@latest update
```

**Via Claude Code plugin (native integration):**

```
/plugin marketplace add saestrad/slingshot
/plugin install slingshot@saestrad
```

Installs the skill as a versioned plugin (namespaced `/slingshot:slingshot`).
Note: the plugin delivers the **deep layer** (the skill); for the
**always-on layer** (economy rule in `CLAUDE.md` + ledger hook) use the npm or
git installer below, which is what writes those files.

**Via git (if you prefer a checkout):**

```bash
git clone https://github.com/saestrad/slingshot.git
cd slingshot

# Global (all your projects, rule in ~/.claude/CLAUDE.md):
node slingshot/scripts/slingshot.mjs install

# Per project (rule in the project's CLAUDE.md and AGENTS.md):
node slingshot/scripts/slingshot.mjs install --scope=project --project-dir=<path>

# With automatic ledger injection each session:
node slingshot/scripts/slingshot.mjs install --hook
```

The installer respects everything that already exists: it only replaces
content between its own markers, backs up `settings.json` before touching
hooks, and never overwrites a ledger.

## Updating

```bash
git pull                                          # pull the new version
node slingshot/scripts/slingshot.mjs update       # re-copy code + re-inject rule
```

`update` replaces the entire codebase (SKILL.md, references, scripts, rule)
and **never** reads or writes the ledgers — your learnings live outside the
updatable unit, so an update can never cost you what you've learned. The
version lives in the `SKILL.md` frontmatter and in the injected block's marker.

```bash
node slingshot/scripts/slingshot.mjs status       # see which version is where
node slingshot/scripts/slingshot.mjs uninstall    # removes rule, hook, and skill; keeps ledgers
```

## Structure

```
slingshot/
├── SKILL.md                  # Router: commands, gates, moves (version in frontmatter)
├── rules/
│   └── rule-block.md         # Source of truth for the always-on block
├── references/               # One protocol per command, loaded on demand
│   ├── distill.md  route.md  budget.md  arsenal.md
│   ├── learn.md    recall.md teach.md
│   └── manage.md
├── learnings/
│   └── seed.md               # Seed for the generic ledger (first install only)
└── scripts/
    ├── slingshot.mjs         # install | update | status | uninstall
    └── session-start.mjs     # SessionStart hook: injects ledgers as additionalContext
```

## Anti-goals

- Never trade correctness for tokens.
- No ceremony on trivial tasks.
- No visible bureaucracy: the moves are applied silently.

## License

[MIT](LICENSE) — use it, modify it, and redistribute it freely, in personal
or commercial projects; just keep the copyright notice. Your ledgers are
yours: they live outside the code, and no license or update ever touches them.
