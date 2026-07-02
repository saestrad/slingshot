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

## The second axis: effort

Since Fable 5, routing is two-dimensional: **tier × effort**. Effort
(`output_config.effort`, `low`→`max`) is the primary intelligence/latency/cost
lever within a tier, and the spread is large — the same task measured across
levels ran ~1,900 output tokens at `low` vs ~14,400 at `max` (7.5x, Willison,
2026-07).

The finding that reorders the ladder (Anthropic docs + independent harness
reports, 2026-07): **frontier `low` effort often exceeds the previous
generation's `xhigh`.** So before dropping a tier, try dropping effort — same
model, no handoff cost, no spec-density penalty:

- **Down-effort** when the task needs strong judgment but not maximal depth
  (routine work on a hard codebase, re-applying a settled decision).
- **Down-tier** when the task needs no judgment at all (mechanical transforms,
  pattern application with examples).
- `high` is the default; `xhigh` for capability-critical work; `low` for
  delegated mechanical subagents. In Claude Code, subagents cap at `xhigh` —
  `max` exists only for the top-level agent.

One more lever that stacks with both: the **Batches API** — non-urgent bulk
work runs at **50% of standard price**; latency (up to hours) is the only
trade. If nobody is waiting on it, batch it.

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

Parallel-team economics (harness measurements, 2026-07): the speedup and
token savings from multi-agent teams concentrate on **hard** problems; on
easy ones (>50% single-agent pass rate) a 10-agent team is roughly
break-even (~0.8x per problem). Delegate in parallel when the problem is
genuinely hard or the subtasks are independent — not as a default. Prefer
**async** dispatch (keep working while subagents run) over blocking on each
return, and reuse long-lived subagents across subtasks — their kept context
pays for itself in cache reads.

Delegation prompt template:

```
You are executing a precisely scoped task. Do exactly this, nothing more.

<spec block>

FILES: <paths it needs — pre-located, so it doesn't re-explore>
EXAMPLE: <for Haiku: one concrete input→output pair from this codebase>
OUTPUT: <exact shape: a diff, a file, a JSON list — never "whatever seems best">
IF BLOCKED: Stop and report the blocker. Do not improvise around it.
EVIDENCE: Before reporting done, cite the tool result that proves each claim.
```

For long delegated runs, that EVIDENCE line matters: requiring each status
claim to point at a tool result near-eliminates fabricated progress reports
(Anthropic's own testing, 2026-07).

Rules of engagement:
- **One failure → fix the spec.** The spec was ambiguous; tighten it.
- **Two failures → escalate one tier.** Never loop a failing cheap model;
  a retry loop erases the savings and then some.
- **Never delegate the verification of a task to the tier that did it** —
  and give the verifier a **fresh context**: fresh-context verifier
  subagents measurably outperform self-critique, because verification
  quality comes from clean context as much as from capability.
- Overhead check: a subagent costs its own startup and your handoff tokens.
  Below ~5 minutes of work, doing it inline is cheaper than delegating.
- **The stronger the model, the tighter the boundaries.** Frontier models
  are relentlessly proactive: left unscoped, they will invent debug
  infrastructure, open browsers, and build tooling to reach a goal — one
  documented CSS-debugging session burned ~$12 at API rates. NON-GOALS and
  explicit boundaries save *more* up-tier, not less.

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
