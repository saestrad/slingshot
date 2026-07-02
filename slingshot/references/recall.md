# RECALL — consuming the ledgers

Learnings that are never read are dead weight. RECALL is how the flywheel
pays out: the ledgers enter context exactly when they can change behavior.

## Three delivery paths

1. **Hook (strongest)** — if the optional `SessionStart` hook is installed,
   both ledgers are injected automatically at the start of every session.
   Check: if a "Slingshot ledgers" block is already in context, do NOT
   re-read the files. See [manage.md](manage.md) to enable.
2. **Auto-trigger (rule block)** — before significant work, if the ledgers
   are not in context this session, read them:
   - `~/.claude/slingshot/generic.md`
   - `.claude/slingshot.md` (project root; may not exist — skip silently)
3. **Explicit** — `/slingshot recall [topic]`.

## Protocol

### Without a topic

Read both ledgers. Apply what is relevant to the task at hand **silently** —
do not recite entries to the user, do not announce that ledgers were
consumed. The ledgers shape behavior; they are not content.

### With a topic (`/slingshot recall delegation`)

Read both ledgers, filter to entries matching the topic (by tag or by
substance), and present the matches briefly to the user — this is the one
case where quoting entries is correct, because the user asked to see them.
If nothing matches, say so in one line; do not pad.

## Relevance discipline

A ledger entry applies when its *when/why* clause matches the current
situation — not merely because it exists. Applying a `[build]` quirk to a
documentation task is noise. When in doubt, an entry that does not obviously
apply, does not apply.

## Feedback loop

RECALL is also where entries get falsified: if an applied entry turns out to
be wrong (the command changed, the quirk was fixed), **delete it from the
ledger immediately** and note the correction in one line to the user. A
ledger that cannot be trusted stops being read — accuracy is the whole asset.
