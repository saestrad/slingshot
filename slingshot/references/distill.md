# DISTILL — from vague intent to executable spec

Most token waste is not verbose output — it is **rework**: building the wrong
thing, clarifying after the fact, regenerating. Distillation spends a few
hundred tokens up front to prevent thousands of wasted ones.

## When to run it

- The request has more than one reasonable interpretation.
- The request names an outcome vaguely ("make it better", "más seguro",
  "clean this up") without scope or criteria.
- The task will span multiple steps, files, or a delegation to a subagent.

Skip it when the request is already precise or trivially small.

## Protocol

### 1. Extract — from the user's words

Fill as much of the Spec Block as the message itself supports:

- **GOAL** — the outcome, stated as a result, not an activity.
  "Users can reset their password by email", not "work on auth". When the
  why is known, state it in the same line ("...so support stops handling
  resets manually") — models that understand intent connect the task to the
  right context instead of guessing it.
- **SCOPE** — which files/modules/areas are touched. Everything else is
  untouched by default.
- **CONSTRAINTS** — versions, conventions, style, performance limits,
  things that must not break.
- **NON-GOALS** — what a careless reading might include but the user did
  not ask for. Writing these down prevents scope creep, which is pure
  token burn.
- **DONE WHEN** — criteria that a model or a script can check without
  human judgment: a test passes, a command exits 0, an output matches a
  shape. This is the single highest-leverage field: models loop reliably
  toward verifiable goals and drift on subjective ones.

### 2. Infer — from the repo, before asking

Gaps in the spec are filled by evidence, not by questions:

- Conventions → read neighboring code, configs, CLAUDE.md.
- Intent → recent commits, TODOs, issue text if referenced.
- Terminology → the project's own names for things, not yours.

### 3. Ask — at most once, only if the guess is expensive

If after inference a genuine fork remains **and** picking wrong wastes real
work, ask **one** batched question presenting the concrete options. Never a
questionnaire; never ask what the repo can answer.

### 4. Emit the Spec Block

```
GOAL: ...
SCOPE: ...
CONSTRAINTS: ...
NON-GOALS: ...
DONE WHEN: ...
```

Keep it under ~15 lines. If it needs more, the task should be split into
sequential Spec Blocks.

### 5. Calibrate density to the executor

Spec **density scales inversely with executor capability** (Anthropic docs +
harness reports, 2026-07). The same block, tuned per tier:

- **Weak executor (Haiku)**: add concrete input→output examples, a rigid
  output format, and exact steps. Examples beat instructions down-tier.
- **Strong executor (Opus/Fable)**: give GOAL, CONSTRAINTS, NON-GOALS, and
  DONE WHEN — and **stop**. Micro-step procedures written for weaker models
  measurably *degrade* frontier output quality; the model finds a better
  path than the one you'd prescribe. Constrain the *what*, never the *how*.

This also applies to standing instructions: skills and prompts written for
prior generations tend to be too prescriptive for frontier models — prune
them when default behavior is already better.

## Worked examples

**User says:** "haz el login más seguro"

```
GOAL: Login resists credential-stuffing and brute force.
SCOPE: src/auth/login.ts, src/middleware/rateLimit.ts (new).
CONSTRAINTS: Keep existing session mechanism; no new external services;
  follow the project's middleware pattern in src/middleware/.
NON-GOALS: 2FA, OAuth providers, password-strength UI.
DONE WHEN: 6th failed attempt within 15 min returns 429 (covered by a new
  test in tests/auth/); existing auth tests still pass.
```

**User says:** "clean up the utils folder"

```
GOAL: src/utils/ contains only used, non-duplicated helpers.
SCOPE: src/utils/** and the import sites of anything moved/removed.
CONSTRAINTS: No behavior changes; preserve public function signatures
  that are imported outside src/.
NON-GOALS: Renaming exported APIs, adding new abstractions.
DONE WHEN: No unused exports remain (verified by grep of import sites);
  build and existing tests pass.
```

## Why this saves tokens

- A Spec Block is the **only** context a delegated subagent needs — no
  conversation history, no re-exploration.
- DONE WHEN converts review from open-ended judgment (expensive, strong
  model) into a check (cheap model or a script).
- NON-GOALS is the cheapest line in the block and kills the most expensive
  failure mode: unsolicited work that gets reverted.
