# Slingshot 🎯

> Fire a slingshot; get an intergalactic explosion.

**Slingshot makes Claude Code do more with fewer tokens — automatically.**
It sharpens vague requests into precise instructions, runs each task on the
cheapest model that can actually handle it, and remembers what works across
sessions. You get top-tier results at a fraction of the cost, without changing
how you work.

Once installed, it runs on its own. There are no commands to memorize and no
new habits to build: a small set of economy rules rides along in every request,
and the full playbook loads only when a task actually needs it.

## Why it saves money

Most token waste isn't long output — it's **rework** (building the wrong thing)
and **overkill** (using an expensive model for a simple job). Slingshot attacks
both:

- **Sharpen before doing.** A vague request ("make it faster", "clean this up")
  becomes a precise spec — goal, scope, and a checkable "done when" — *before*
  any work starts. Less back-and-forth, fewer wrong turns.
- **Right-size the model.** A well-specified task doesn't need the most
  expensive model. Slingshot routes each job to the cheapest tier that can do
  it well — often 5–10× cheaper — and reserves the strong model for the hard
  20%: judgment, architecture, and reviewing the result.
- **Learn once, reuse forever.** Every session, it records what worked as
  one-line lessons and reuses them next time — so it gets cheaper *and* smarter
  the more you use it.

The core move:

```
strong model SHARPENS the task → cheap model DOES it → a script or the strong model CHECKS it
```

Reading and checking a result costs far less than generating it, so the
expensive model's time goes where it matters.

## How it's built: two layers

1. **Always-on layer** — a small managed block the installer adds to your
   agent's root file (`CLAUDE.md`, and `AGENTS.md` for other agents). It's ~20
   lines that travel in **every request**: the economy rules plus the triggers
   that fire the behavior automatically. Nothing to invoke.
2. **Deep layer** — the full skill, with the complete playbook for each move.
   It loads **only when a task needs it**, so it costs nothing the rest of the
   time.

Optional extra: a `SessionStart` hook that loads your saved lessons at the
start of every session automatically (`--hook` when installing).

## Commands

You rarely need these — the behavior is automatic. But you can invoke any move
directly with `/slingshot <command>`:

| Command | What it does |
|---|---|
| `distill [request]` | Turns a vague request into a precise, executable spec |
| `route [task]` | Picks the cheapest model that fits + writes the hand-off prompt |
| `budget` | Audits the current session for wasted context and fixes it |
| `arsenal` | Suggests vetted external token-saving tools (max 2, never installs without asking) |
| `learn` | Saves the session's lessons |
| `recall [topic]` | Pulls up saved lessons relevant to what you're doing |
| `teach` | Scans a repo + one quick interview → seeds that project's lessons |
| `status` | Shows version, install state, and lesson counts |
| `install` / `update` / `uninstall` | Manage the installation |

## Memory that survives updates

Slingshot keeps two files of lessons ("ledgers"). Updating the tool **never
touches them** — your knowledge is safe.

| File | Where | What's in it |
|---|---|---|
| Generic | `~/.claude/slingshot/generic.md` | Techniques that help on any project (ships seeded with 35 curated, source-verified lessons) |
| Project | `.claude/slingshot.md` in each repo | That repo's specific quirks — commit it and your whole team inherits it |

One line per lesson, capped in size, deduplicated, and any lesson proven wrong
is deleted on sight.

## Installation

Requires Node 18+.

**Via npm (recommended) — nothing to clone:**

```bash
# Everywhere — full setup, nothing to configure:
npx @saestrad/slingshot install

# For a single project:
npx @saestrad/slingshot install --scope=project --project-dir=<path>

# Update later:
npx @saestrad/slingshot@latest update
```

A default `install` gives you the complete experience: the always-on rule
**and** the session hook that auto-loads your lessons every session. If you'd
rather not have your `settings.json` touched, add `--no-hook` for a lighter
install (the always-on rule still works; lessons just won't preload).

**Via Claude Code plugin (native integration):**

```
/plugin marketplace add saestrad/slingshot
/plugin install slingshot@saestrad
```

This installs the skill as a versioned plugin (`/slingshot:slingshot`). Note:
the plugin gives you the **deep layer** (the skill itself). For the
**always-on layer** — the economy rule in `CLAUDE.md` and the lesson hook — use
the npm or git installer below, since that's what writes those files.

**Via git (if you prefer a checkout):**

```bash
git clone https://github.com/saestrad/slingshot.git
cd slingshot

node slingshot/scripts/slingshot.mjs install
node slingshot/scripts/slingshot.mjs install --scope=project --project-dir=<path>
node slingshot/scripts/slingshot.mjs install --no-hook   # lighter: skip the session hook
```

The installer is careful: it only edits the block between its own markers,
backs up `settings.json` before touching hooks, and never overwrites a lesson
file.

## Updating

```bash
git pull                                       # get the new version
node slingshot/scripts/slingshot.mjs update    # re-copy code + refresh the rule
```

`update` replaces all the code but **never** reads or writes your lessons —
they live outside the updatable part, so an update can't cost you what you've
learned.

```bash
node slingshot/scripts/slingshot.mjs status     # what's installed where
node slingshot/scripts/slingshot.mjs uninstall  # remove rule, hook, and skill; keep lessons
```

## Structure

```
slingshot/
├── SKILL.md                  # The router: commands, gates, and moves (version lives here)
├── rules/
│   └── rule-block.md         # Source of truth for the always-on block
├── references/               # One playbook per command, loaded on demand
│   ├── distill.md  route.md  budget.md  arsenal.md
│   ├── learn.md    recall.md teach.md
│   └── manage.md
├── learnings/
│   └── seed.md               # Starter lessons (copied in on first install only)
└── scripts/
    ├── slingshot.mjs         # install | update | status | uninstall
    └── session-start.mjs     # SessionStart hook: loads lessons into each session
```

## Principles

- **Correctness beats savings, always.** A wrong answer is the most expensive
  output there is.
- **No ceremony on trivial tasks.** Optimizing a one-line fix costs more than
  it saves.
- **Invisible by default.** The moves happen silently; they only surface when
  you ask about cost or model choice.

## License

[MIT](LICENSE) — use it, change it, and share it freely, in personal or
commercial projects; just keep the copyright notice. Your lesson files are
yours: they live outside the code, and no license or update ever touches them.
