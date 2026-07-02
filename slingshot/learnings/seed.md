# Slingshot — generic ledger

One line per learning. Portable across projects. Capped at 80 lines; prune
before exceeding. Format: `- [tag] fact — when/why it applies`.

- [search] Grep/Glob to locate, Read with offset/limit to load — reading whole files for narrow questions taxes every later request in the session.
- [search] Delegate broad "where does X happen" sweeps to an Explore subagent — its file dumps are disposed, only the conclusion returns.
- [scripts] More than ~10 mechanical edits of the same shape → script it and verify a sample; generation is the most expensive way to repeat yourself.
- [spec] A verifiable DONE WHEN is the highest-leverage spec line — models loop reliably toward checkable goals and drift on subjective ones.
- [spec] Writing NON-GOALS costs one line and kills the priciest failure mode: unsolicited work that gets reviewed, questioned, and reverted.
- [delegate] Cheap models follow examples better than instructions — one concrete in-repo input→output pair beats three paragraphs of description.
- [delegate] Give subagents the Spec Block plus pre-located file paths, never conversation history — context isolation is itself the savings.
- [delegate] One failure → tighten the spec; two → escalate a tier. Retry-looping a cheap model erases its savings and then some.
- [delegate] Below ~5 minutes of work, inline beats delegation — subagent startup plus handoff costs more than doing it yourself.
- [verify] Reading a diff costs ~10x less than generating it — strong-model tokens belong in specs and review, not boilerplate typing.
- [verify] Never let the tier that did the work verify the work — verification by script when possible, by a stronger tier otherwise.
- [model] Establish the pattern on ONE instance with the strong model, then fan the remaining N-1 out to a cheaper tier with that instance as the example.
- [cache] Stable prefixes hit the prompt cache — batch edits to session-start files (CLAUDE.md, ledgers) at task end instead of churning them mid-session.
- [output] Ask delegated models for diffs or patches, not whole files — same information, fraction of the tokens, easier to verify.
- [output] Point at path:line instead of quoting code back — the reader can open it, and the window stays lean.
- [budget] Big tool payloads (logs, scrapes, API dumps) get distilled to a note or file at the moment of arrival — raw dumps must not ride in the window.
- [budget] Before a long session compacts, persist plan + status + next steps to a file — nothing load-bearing may live only in conversation.
- [budget] Correctness overrides economy every time — one wrong merge costs more than a month of lean sessions.
- [output] Prefer terse command variants (git status --short, --quiet flags, tail on logs) — most CLI verbosity never informs the next step.
- [budget] Every installed MCP server ships its tool definitions in every request — audit /context and remove unused servers before optimizing anything else.
- [budget] Split a fat CLAUDE.md into a lean always-loaded core plus on-demand docs — reported startup context drops of ~80-90% (11K→800 tokens).
- [cache] Cache reads cost ~0.1x input price (writes 1.25x); the cache is a prefix match — one byte changed early invalidates everything after it.
- [model] Price ladder per MTok (2026-07): Haiku $1/$5, Sonnet $3/$15, Opus $5/$25, Fable $10/$50 — a delegated subtask costs 5-10x less down-tier.
- [model] output_config.effort is a per-request lever — lower effort means fewer, consolidated tool calls and terser output; low fits mechanical subagents.
- [budget] Non-urgent bulk work through the Batches API costs 50% of standard price — latency (up to hours) is the only trade.
- [verify] Count Claude tokens with the count_tokens API, never tiktoken — OpenAI's tokenizer undercounts Claude by ~15-20%, worse on code.
