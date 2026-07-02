# TEACH — seed the project ledger deliberately

Organic learning (the LEARN auto-trigger) takes weeks to accumulate what a
20-minute scan can capture on day one. TEACH front-loads the project ledger
so every future session — yours and your teammates' — starts with the repo's
quirks already known.

Run once per project, or again after major restructuring.

## Protocol

### 1. Scan (no user time spent)

Explore the repo for the facts that burn tokens when unknown:

- **Commands**: how to build, test (full and single-file), lint, run dev.
  Read `package.json` scripts / `Makefile` / CI config — do not guess.
- **Layout**: where source, tests, and config actually live; anything
  generated (never hand-edit) and its true source.
- **Conventions**: naming patterns, error-handling style, the project's
  chosen libraries for common needs (validation, HTTP, state).
- **Traps**: slow test suites, order-dependent steps, files that look
  editable but are overwritten, env vars required to run anything.

Use a disposable Explore subagent for the sweep; only conclusions return.

### 2. Confirm (one batched exchange, maximum)

Present the drafted entries to the user in one message and ask only what the
scan could not determine — typically: "is X generated or hand-maintained?",
"is the slow suite expected?". One round; no interview marathon.

### 3. Write

Create or extend `.claude/slingshot.md` (project root):

```markdown
# Slingshot — project ledger
One line per learning. Capped at 60 lines; prune before exceeding.

- [build] <verified build/test/lint commands, incl. single-test invocation>
- [convention] <the non-obvious ones only>
- [gotcha] <traps found in step 1>
```

Rules:
- **≤ 12 entries from a teach pass.** TEACH seeds the high-value core;
  organic LEARN fills the rest over time.
- Every entry passes the LEARN qualify test: *would this change how a fresh
  session acts?* Facts derivable from a 30-second look at `package.json` do
  not qualify — record what required digging or confirmation.
- Suggest committing the file so the whole team's agents inherit it.

### 4. Close the loop

If the hook is not installed, remind the user once that
`node <skill>/scripts/slingshot.mjs install --hook` makes both ledgers
auto-inject at session start ([manage.md](manage.md)).
