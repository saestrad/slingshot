# ROUTE — minimal sufficient model, compensated by specification

The law of routing: **capability gap is compensated by specification
density.** A model one tier down performs like the tier above when the task
arrives with narrow scope, explicit steps, concrete examples, and a
verifiable done-condition. A model with none of those wastes tokens at any
tier.

## The ladder

| Tier | Native strengths | Give it these, and it punches up |
|---|---|---|
| **Haiku** | Speed, pattern-following, extraction, formatting, mechanical transforms | Exact input→output examples (2–3), a rigid output format, zero open decisions, one job per call |
| **Sonnet** | Solid implementation, tests, refactors, summaries, focused research | A full Spec Block, exact file paths, the project's conventions stated (not assumed), DONE WHEN it can self-check |
| **Opus / Fable** | Ambiguity, architecture, cross-cutting design, unknown-cause debugging, judgment | The hard 20%: distillation, decomposition, verification, and anything where being wrong is expensive |

The arbitrage is measurable. Anthropic list prices per MTok (input/output,
verified 2026-07): Haiku 4.5 **$1/$5** → Sonnet 5 **$3/$15** → Opus 4.8
**$5/$25** → Fable 5 **$10/$50**. A Haiku-executed subtask costs 5–10x less
than the same tokens one or three tiers up — the spec that makes it possible
costs a few hundred strong-model tokens once.

Two API-level levers that stack with tier choice:

- **`output_config.effort`** (`low`→`max`): lower effort means fewer, more
  consolidated tool calls, less preamble, terser output. `high` is the sweet
  spot; `xhigh` for the hardest agentic work; `low` for delegated subagents
  doing mechanical work.
- **Batches API**: non-urgent bulk work runs at **50% of standard price** —
  latency (up to hours) is the only trade. If nobody is waiting on it, batch it.

## The compound pattern

```
1. DISTILL   (strong model)  → Spec Block per subtask
2. EXECUTE   (cheapest sufficient tier) → does exactly the spec
3. VERIFY    (script if possible, else strong model reads the diff)
```

Verification is the arbitrage: **reading a diff costs roughly an order of
magnitude less than generating it.** The strong model's expensive tokens go
into the spec and the review — never into typing boilerplate.

## Routing decisions

Route DOWN (cheaper tier) when the subtask is:
- Applying a known pattern to new inputs (CRUD from an existing example,
  test cases from a spec, migrations from a schema diff).
- Transforming or extracting (format conversion, log parsing, renames the
  script rule doesn't cover).
- Summarizing bounded material with a stated output shape.
- Exploring/fanning out where only the conclusion matters.

Route UP (stronger tier) when the subtask involves:
- Choosing between designs, or naming things that will live long.
- Debugging where the cause is unknown.
- Anything security-, data-loss-, or migration-critical.
- Writing the specs and reviewing the results of the cheap tiers.

## Delegation mechanics (Claude Code)

Use the Agent tool with the `model` parameter (`haiku`, `sonnet`, `opus`).
The subagent starts **cold** — this is a feature: it gets the Spec Block and
a minimal file list, not your conversation history. Context isolation is
itself token savings.

Delegation prompt template:

```
You are executing a precisely scoped task. Do exactly this, nothing more.

<spec block>

FILES: <paths it needs — pre-located, so it doesn't re-explore>
EXAMPLE: <for Haiku: one concrete input→output pair from this codebase>
OUTPUT: <exact shape: a diff, a file, a JSON list — never "whatever seems best">
IF BLOCKED: Stop and report the blocker. Do not improvise around it.
```

Rules of engagement:
- **One failure → fix the spec.** The spec was ambiguous; tighten it.
- **Two failures → escalate one tier.** Never loop a failing cheap model;
  a retry loop erases the savings and then some.
- **Never delegate the verification of a task to the tier that did it.**
- Overhead check: a subagent costs its own startup and your handoff tokens.
  Below ~5 minutes of work, doing it inline is cheaper than delegating.

## What this looks like in practice

Task: "Add input validation to all 12 API endpoints."

- Fable/Opus: distills — picks the validation library already in the repo,
  writes the Spec Block, validates the approach on ONE endpoint.
- Sonnet (or Haiku, with the finished endpoint as the example): applies the
  established pattern to the remaining 11.
- Script: runs the test suite. Strong model reads the diff once.

Cost profile: the expensive model touched ~15% of the tokens; output quality
is indistinguishable from the expensive model doing all of it — because every
decision was already made when the cheap model started.
