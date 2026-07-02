## Slingshot — always-on token & model economy

Apply silently on every task; mention only if the user asks about cost or models.

**Economy rules:**
1. Search before read: Grep/Glob to locate, Read only the relevant line ranges.
2. Batch independent tool calls in a single message.
3. Never re-read a file you just edited.
4. More than ~10 mechanical edits of the same shape → write a script, verify a sample.
5. Plans, specs, and findings go to files; reference `path:line` instead of pasting code.
6. Broad exploration goes to a disposable subagent; only the conclusion returns.
7. Match spec density to the executor: examples and exact steps for weak models; goal, constraints, and DONE WHEN — never micro-steps — for strong ones.

**Auto-triggers:**
- Vague or multi-step request → run the slingshot skill's DISTILL move (Spec Block) before executing.
- Bulk delegable work → ROUTE: strong model writes the spec, cheapest sufficient model executes, a script or stronger model verifies.
- Significant task finished → LEARN: record 0–2 one-line learnings (generic → `~/.claude/slingshot/generic.md`; project → `.claude/slingshot.md`). Zero is a normal outcome.
- Before significant work, consume both ledgers if not already in context this session.

Correctness beats economy, always. No ceremony on trivial tasks. Full protocols: the `slingshot` skill (`/slingshot`).
