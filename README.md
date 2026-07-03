# Slingshot 🎯

> Fire a slingshot, get an intergalactic explosion.

Slingshot helps Claude Code get more done while spending fewer tokens. It turns
a vague request into a clear one before any work starts, sends each task to the
cheapest model that can actually do it well, and keeps notes on what worked so
the next session starts smarter. You keep working the way you already do, and
it handles the rest in the background.

## Why it saves money

Two things burn most of the tokens. One is doing the wrong thing and having to
redo it. The other is using an expensive model for a job a cheaper one could
have handled. Slingshot goes after both.

Before any work starts, a fuzzy request like "make it faster" or "clean this
up" gets turned into a short spec: what the goal is, which files are in play,
and how you'll know it's done. That alone cuts most of the back-and-forth.

Once a task is well defined, it usually doesn't need the strongest model.
Slingshot sends it to the cheapest tier that can handle it, which is often five
to ten times cheaper, and saves the strong model for the parts that really need
judgment, like design decisions, tricky bugs, and checking the result.

Every session it also writes down what worked, one line at a time, and reuses
those notes later. So the tool gets a little cheaper and a little sharper the
more you use it.

The basic loop looks like this:

```
strong model writes the spec  →  cheap model does the work  →  a script or the strong model checks it
```

Reading and checking a result costs far less than producing it, so the
expensive model spends its time where it counts.

## How it's built

There are two layers.

The first one is always on. When you install, a short block of rules goes into
your agent's root file (`CLAUDE.md`, or `AGENTS.md` for other agents). Those
rules travel with every request, so the behavior just happens. You don't invoke
anything.

The second is the full skill, with the complete playbook for each move. It only
loads when a task actually calls for it, so it costs nothing the rest of the
time.

By default the installer also adds a small hook that loads your saved notes at
the start of every session, so they're there from the first message.

## Commands

You rarely need these, since the behavior runs on its own. But you can call any
move directly with `/slingshot <command>`:

| Command | What it does |
|---|---|
| `distill [request]` | Turns a vague request into a clear, executable spec |
| `route [task]` | Picks the cheapest model that fits and writes the hand-off prompt |
| `budget` | Checks the current session for wasted context and fixes it |
| `arsenal` | Suggests vetted external token-saving tools (up to two, never installs without asking) |
| `learn` | Saves the session's notes |
| `recall [topic]` | Pulls up saved notes about what you're working on |
| `teach` | Scans a repo plus one quick interview, then seeds that project's notes |
| `status` | Shows version, install state, and note counts |
| `install` / `update` / `uninstall` | Manage the installation |

## Your notes survive updates

Slingshot keeps two files of notes (it calls them ledgers). Updating the tool
never touches them, so nothing you've learned gets lost.

| File | Where | What's in it |
|---|---|---|
| Generic | `~/.claude/slingshot/generic.md` | Techniques that help on any project. Ships with 35 curated notes, each checked against a primary source. |
| Project | `.claude/slingshot.md` in each repo | That repo's own quirks. Commit it and your whole team gets them too. |

Each note is one line. The files stay small, duplicates get merged, and
anything that turns out to be wrong gets deleted.

## Installation

Requires Node 18+.

**Via npm (recommended), nothing to clone:**

```bash
# Everywhere, full setup with nothing to configure:
npx @saestrad/slingshot install

# For a single project:
npx @saestrad/slingshot install --scope=project --project-dir=<path>

# Update later:
npx @saestrad/slingshot@latest update
```

A plain `install` gives you the whole thing: the always-on rule and the session
hook that loads your notes each session. If you'd rather leave your
`settings.json` alone, add `--no-hook`. The rule still works; your notes just
won't preload.

**Via Claude Code plugin (native integration):**

```
/plugin marketplace add saestrad/slingshot
/plugin install slingshot@saestrad
```

This installs the skill as a versioned plugin (`/slingshot:slingshot`). One
thing to know: the plugin gives you the skill itself, but not the always-on
rule in `CLAUDE.md` or the notes hook. For those, use the npm or git installer,
since that's what writes those files.

**Via git, if you'd rather have a checkout:**

```bash
git clone https://github.com/saestrad/slingshot.git
cd slingshot

node slingshot/scripts/slingshot.mjs install
node slingshot/scripts/slingshot.mjs install --scope=project --project-dir=<path>
node slingshot/scripts/slingshot.mjs install --no-hook
```

The installer is careful with what's already there. It only edits the block
between its own markers, backs up `settings.json` before touching hooks, and
never overwrites a notes file.

## Updating

```bash
git pull                                       # get the new version
node slingshot/scripts/slingshot.mjs update    # re-copy code and refresh the rule
```

`update` replaces all the code but leaves your notes alone. They live outside
the part that gets updated, so an update can't cost you what you've learned.

```bash
node slingshot/scripts/slingshot.mjs status     # what's installed where
node slingshot/scripts/slingshot.mjs uninstall  # remove rule, hook, and skill; keep the notes
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
│   └── seed.md               # Starter notes (copied in on first install only)
└── scripts/
    ├── slingshot.mjs         # install | update | status | uninstall
    └── session-start.mjs     # SessionStart hook: loads notes into each session
```

## Principles

Getting the right answer matters more than saving tokens. A wrong answer is the
most expensive thing you can produce.

Small tasks don't get the treatment. Optimizing a one-line fix costs more than
it saves.

It stays out of the way. The work happens quietly, and only comes up if you ask
about cost or which model to use.

## License

[MIT](LICENSE). Use it, change it, and share it however you like, in personal
or commercial projects, as long as you keep the copyright notice. Your notes
are yours: they live outside the code, and no license or update ever touches
them.
