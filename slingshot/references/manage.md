# MANAGE — install, update, status, uninstall

All lifecycle operations run through one script:

```bash
node <skill-dir>/scripts/slingshot.mjs <install|update|status|uninstall> [flags]
```

`<skill-dir>` is wherever this SKILL.md lives (source checkout or installed
copy). The script has zero dependencies (Node 18+).

## Flags

| Flag | Meaning | Default |
|---|---|---|
| `--scope=global\|project` | Global: `~/.claude`. Project: `.claude/` + root files of the current project | `global` |
| `--project-dir=<path>` | Project root when `--scope=project` | cwd |
| `--hook` | Also register the `SessionStart` ledger-injection hook in `settings.json` | off |

## What `install` does

1. Copies the skill folder to `<scope>/skills/slingshot/` (wholesale replace).
2. Seeds `~/.claude/slingshot/generic.md` from `learnings/seed.md` — **only
   if no ledger exists yet**.
3. Injects the always-on rule block ([rules/rule-block.md](../rules/rule-block.md))
   between `<!-- SLINGSHOT:BEGIN -->` / `<!-- SLINGSHOT:END -->` markers into:
   - global scope: `~/.claude/CLAUDE.md`
   - project scope: `<project>/CLAUDE.md`, plus `<project>/AGENTS.md` if it
     exists (covers Codex, Cursor, Copilot, Gemini and other AGENTS.md
     readers). Existing markers are replaced in place; otherwise the block is
     appended. Nothing outside the markers is ever touched.
4. With `--hook`: adds a `SessionStart` entry to `settings.json` running
   `scripts/session-start.mjs`, which injects both ledgers as
   `additionalContext` at the start of every session (startup, resume, clear,
   compact). Existing settings are preserved; a `.bak` backup is written
   first.

## What `update` does

Same as `install` (it is idempotent), run **from a fresh source checkout**:
re-copies the skill code, re-injects the rule block at the new version.
Ledgers are never read, written, or migrated by updates — data lives outside
the skill folder precisely so code can be replaced wholesale.

Typical update flow the user will ask for:

```bash
git -C <source-checkout> pull
node <source-checkout>/slingshot/scripts/slingshot.mjs update
```

## What `status` reports

Source vs installed version, rule-block presence (and block version) per root
file, hook registration, and line counts for both ledgers. Run this for
`/slingshot status` and summarize the output in two or three lines — do not
dump raw output on the user.

## What `uninstall` does

Removes the marked block from root files, removes the hook entry, deletes the
installed skill folder. **Ledgers are kept** and their paths reported — they
are the user's data.

## Rules for Claude

- Never hand-edit content between the SLINGSHOT markers; the script owns it.
- Never edit the installed copy under `skills/slingshot/` — changes belong in
  the source checkout, then `update`.
- If `status` shows the rule block missing where it should be, offer
  `install` once — do not nag, do not auto-run it without the user's
  awareness that their CLAUDE.md will gain a managed block.
