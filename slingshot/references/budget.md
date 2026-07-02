# BUDGET — context economy

Context is not just a capacity limit; it is an **attention budget**. Every
token in the window competes for the model's attention, so irrelevant context
doesn't just cost money — it degrades output quality (lost-in-the-middle,
stale-state confusion). A lean window is both cheaper and smarter.

## Intake: control what enters

- **Locate, then read narrowly.** Grep/Glob to find; Read with offset/limit
  to load only the relevant range. A 2,000-line file read for a 10-line
  answer taxes every subsequent request in the session.
- **Delegate exploration.** Broad "where is X handled?" sweeps go to an
  Explore subagent. Its context (dozens of file excerpts) is disposed;
  only the answer returns.
- **Summarize at the boundary.** When a tool returns a large payload (logs,
  API responses, scraped pages), extract what matters into a short note or a
  file immediately — don't let raw dumps ride along in the window.
- **Deterministic work never generates tokens.** Bulk renames, format
  conversions, data munging: write a script, run it, verify a sample of the
  output. The script is 30 lines; the generated alternative is thousands.

## Retention: control what stays

- **Files are the durable memory; the window is scratch.** Write plans,
  specs, and findings to files (plan file, scratchpad, `.claude/` notes).
  They survive compaction, cost nothing until re-read, and re-read cheap.
- **Save state before compaction.** When a session runs long, persist the
  current plan + status + next steps to a file *before* the window is
  summarized, so nothing load-bearing lives only in conversation.
- **One task per session.** Unrelated tasks share attention and pollute each
  other's context. Finish, then clear.

## Standing costs: control what always loads

Every always-loaded file (CLAUDE.md, skill descriptions, ledgers) is a tax on
**every single request**. Budget them:

- CLAUDE.md: only what Claude gets wrong without it. No tutorials, no
  aspirations, no restating what the code shows.
- Slingshot ledgers: hard-capped (see learning.md). One line per learning.
- Skill descriptions: trigger-rich but tight; the body loads only on use.

## Cache awareness

Anthropic's prompt cache is a **prefix match** (verified against the API
docs, 2026-07): the rendered prompt caches in order tools → system →
messages, and a single byte changed anywhere invalidates everything after
it. The economics are steep — cache reads cost **~0.1x** the input price
(10x cheaper), writes 1.25x — so a stable prefix is the single largest
passive saving available.

Practical consequences:

- Don't repeatedly edit files that load at session start (CLAUDE.md, skills,
  ledgers) mid-session — every edit invalidates the cached prefix for the
  rest of the session. Batch those updates at task end.
- Silent invalidators to hunt when cache hits mysteriously drop: timestamps
  or random IDs early in a prompt, unsorted JSON serialization, tool sets or
  models that change between requests.
- Long-lived, stable Spec Blocks and plan files are cache-friendly;
  regenerating them with small variations is not.

## Measuring

- Count tokens with the `count_tokens` API against the actual model — never
  `tiktoken` (OpenAI's tokenizer; undercounts Claude by ~15–20%, worse on
  code).
- Non-urgent bulk work belongs on the **Batches API at 50% of standard
  price**; the only cost is latency.

## Output discipline

- Answer, then stop. Padding ("Great question!", restating the request,
  summarizing what you just said) is negative-value tokens.
- Point at code (`path:line`) instead of quoting it back.
- Diffs and patches over whole-file dumps when showing changes.
- Tables and lists only when they carry more information per token than
  prose — not as decoration.

## The trade-off that overrides everything

Token optimization that causes a wrong answer, a missed edge case, or a
skipped verification is not optimization — one bad merge costs more than a
month of lean sessions. When lean conflicts with correct, correct wins,
every time.
