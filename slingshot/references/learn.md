# LEARN — the flywheel

Optimization without memory resets to zero every session. The LEARN move
turns each session's discoveries into standing advantage: the skill gets
sharper the longer it is used, in every project it is installed in.

## Two ledgers

| Ledger | Location | Contents | Lifecycle |
|---|---|---|---|
| **Generic** | `~/.claude/slingshot/generic.md` | Techniques valid in any project: tool behavior, model behavior, patterns that saved tokens | Seeded from the skill's `learnings/seed.md` on first install; **never touched by updates** |
| **Project** | `.claude/slingshot.md` (project root) | This repo's quirks: build/test commands, conventions, gotchas, hot paths | Created lazily on first learning (or by `teach`); commit it so the whole team's agents inherit it |

Header for a new project ledger:

```markdown
# Slingshot — project ledger
One line per learning. Capped at 60 lines; prune before exceeding.
```

## When to run

- Auto-trigger (rule block): after a task that was multi-step, or where
  something **surprised** you — an approach that worked unusually well, a
  failure that cost real tokens, a repo quirk a fresh session would trip
  over again.
- Explicit: `/slingshot learn` — sweep the whole session for candidates.

Not after routine tasks. **Zero learnings is a normal outcome**; forced
learnings are ledger pollution.

## What qualifies

The test: **would this line change how a fresh session acts, and save tokens,
turns, or errors when it does?**

Qualifies:
- "Test suite needs `--runInBand` here or it deadlocks" (project)
- "For Haiku delegation, one in-repo example outperforms three abstract
  instructions" (generic)
- "This repo's API layer is generated — edit `schema/`, never `src/api/`"
  (project — prevents an entire wasted session)

Does not qualify:
- Anything derivable from the code or config in under a minute.
- Session trivia ("fixed the bug in parser.ts").
- Duplicates or near-duplicates of existing entries.
- Secrets, tokens, credentials — never in a ledger.

## Entry format

One line, tagged, with the *why* compressed in:

```
- [tag] fact — when/why it applies
```

Tags: `search`, `delegate`, `spec`, `verify`, `cache`, `scripts`, `build`,
`convention`, `gotcha`, `model`. Keep each line under ~160 characters. The
ledgers are consumed on every significant task — every line must earn its
place.

## Hygiene

- **Dedupe before appending**: if an entry covers it, strengthen that entry
  instead of adding a sibling.
- **Caps**: generic ≤ 80 lines, project ≤ 60 lines. At the cap, merge or
  delete the weakest entry to make room — never exceed.
- **Falsified learnings die immediately.** A ledger line that proves wrong is
  deleted the moment it fails, not annotated.
- **Promote**: a project learning that turns out to generalize moves to the
  generic ledger (rephrased without project specifics) and is removed from
  the project one.

## Batching

Collect learnings during the task; write them once at the end. Ledger churn
mid-session buys nothing and invalidates nothing — it is just noise.
