# ARSENAL — vetted external tools that stack with slingshot

Slingshot optimizes **behavior** (specs, routing, ledgers). These tools
optimize **plumbing** (what raw bytes reach the context window). They stack:
behavior decides what to do; plumbing shrinks what doing it costs.

Verified 2026-07 — each repo checked for existence, mechanism, activity, and
whether its claims survive reading past the README. Re-verify before
recommending; this space churns fast.

## Before recommending anything

Run the audit first: **every installed MCP server ships its full tool
definitions in every single request.** A 65-tool "token optimizer" MCP can
cost more standing tokens than it saves. Have the user check `/context` in a
fresh session — removing unused MCP servers is the highest-ROI optimization
and costs nothing.

## Recommended by workflow

| Workflow pain | Tool | Mechanism | Honest numbers |
|---|---|---|---|
| Verbose terminal output (tests, builds, git) | [RTK](https://github.com/rtk-ai/rtk) | Rust CLI proxy: filters/dedupes command output before it reaches context | 60–90% on command output — vendor estimates, not measured; single binary, zero deps |
| Large codebase navigation | [Token Savior](https://github.com/Mibayy/token-savior) | MCP: symbol-level navigation instead of full-file reads + persistent SQLite memory + bash-output compaction | Best benchmark of the lot: −80% tokens with *higher* task success on 96 reproducible tasks. Caveat: 69 tools of standing cost |
| Huge monorepo / review blast-radius | [code-review-graph](https://github.com/tirth8205/code-review-graph) | Tree-sitter AST → SQLite graph; agent queries "what does this change touch" instead of scanning | 82x median per-question claimed, methodology reproducible but partly self-referential; realistic on big repos, overkill on small ones |
| Many MCP servers flooding context | [Context Mode](https://github.com/mksglu/context-mode) | Sandboxes tool output into SQLite+FTS5; only query-relevant sections return | "98%" is a best-case anecdote; mechanism is sound. ELv2 license |
| Semantic "where is X implemented" | [claude-context](https://github.com/zilliztech/claude-context) (Zilliz) | Hybrid BM25 + vector search MCP | ~40% claimed; setup tax is real: vector DB + embeddings API key |

## Situational

- [token-optimizer](https://github.com/alexgreensh/token-optimizer) —
  delta-mode file re-reads, checkpoint-before-compaction (automates
  slingshot's budget rule), per-session cost dashboard. **PolyForm
  Noncommercial license** — unusable in commercial work without paying.
- [token-optimizer-mcp](https://github.com/ooples/token-optimizer-mcp) —
  Brotli-compressed response caching. The "95%" headline is the cached-API
  best case; 60–90% on repeated identical calls only.

## Covered by slingshot already — do not add

- [caveman](https://github.com/JuliusBrussee/caveman),
  [claude-token-efficient](https://github.com/drona23/claude-token-efficient)
  — output-terseness instruction files. Slingshot's rule block already
  enforces output discipline, and caveman-speak trades readability for
  savings, which violates slingshot's anti-goals. Their honest data is worth
  keeping though: always-loaded instruction files cost input tokens on
  *every* message, so savings only materialize when output volume offsets
  them — that is why the rule block is capped at ~20 lines.
- [claude-token-optimizer](https://github.com/nadimtuhin/claude-token-optimizer)
  — restructures docs so only a lean core autoloads (11K → 800 tokens
  reported). Sound technique, no tool needed: apply it directly with the
  BUDGET move ("Standing costs" in [budget.md](budget.md)).

## Protocol for `/slingshot arsenal`

1. Ask nothing if the pain is stated; otherwise ONE question: "¿dónde se te
   van los tokens: terminal, codebase grande, MCP servers, o no sabes?"
   ("Don't know" → have them run `/context` and read it together.)
2. Recommend **at most 2 tools** from the table, with the honest-numbers
   caveat and the standing-cost warning. More than 2 is itself token waste.
3. Never install anything without explicit confirmation — these change the
   user's toolchain, not just the conversation.
