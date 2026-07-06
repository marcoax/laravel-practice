# ADR-0007 — /lesson-update auto-trigger: background discovery sub-agent on lesson completion

**Status:** Accepted (2026-06-29)

## Context

`/lesson-update` should be available both as a manual command and "automatically in the
background." A Claude Code skill has no always-running daemon, so "automatic" needs a concrete
trigger and a concrete mechanism. The draft spec proposed a quick check **at `lesson`
startup**, gated by a config flag.

Two problems with that:

1. **Wrong hook.** `lesson` is a menu launcher that must open instantly. Hanging a network
   scrape on every menu open makes it slow and flaky (no network → the menu stalls or errors) and
   hammers the sources many times a day.
2. **Blocking.** Even gated, a synchronous check delays the thing the user actually asked for.

The learner reframed the trigger to **lesson completion**, run **in the background as a sub-agent**.

## Decision

- **Trigger = lesson completion, not menu startup.** The check hooks the existing **lesson
  lifecycle gate** (ADR-0004): after the gate marks the lesson done and writes `progress.json` +
  the learning record, it fires the update check. This reuses an existing seam instead of touching
  `lesson`, and the cadence is naturally low (you finish a lesson rarely and deliberately) —
  so **no date-throttle is needed**.

- **Mechanism = background discovery sub-agent.** The gate spawns a background sub-agent that runs
  the discovery while the learner keeps working; it reports back when done. The sub-agent is a
  **deep module with a narrow, read-only interface**: in = state (`scanned`/`lessons_skipped`) +
  sources; out = a list of candidate releases. All the scraping/404/version-compare complexity is
  hidden behind that boundary.

- **Hard boundary — background discovers and proposes; it never generates.**
  - Background (read-only): scrape the editorial sources, compare against `scanned`/`skipped`,
    return the candidate list. May update `laravel_version_scanned` / `last_checked` ("I looked
    this far"). **Must not** write lessons, advance `covered`, touch `lessons_skipped`, or
    pre-generate drafts.
  - Foreground (interactive): when the sub-agent reports "N candidates", the main agent offers
    "view now or later?". On engagement → propose one at a time → accept/skip → generate the
    accepted ones (write files, advance `covered`, append to `lessons_skipped`).

  Pre-generated drafts were considered and rejected: silently generating in the background would
  bypass the accept/skip step the whole design rests on.

- **Flag-gated, fail-soft.** A `learning-config.md` flag (e.g. `auto_check_new_lessons: on`),
  proposed during `/lesson-init`, controls the auto-trigger; off → nothing fires. A failed check
  (network down) is skipped silently and never blocks the lifecycle gate. `/lesson-update` stays
  manually invocable regardless of the flag.

## Consequences

- The auto-trigger lives in the ADR-0004 lifecycle gate (in `CLAUDE.md`), not in `lesson`.
- `/lesson-init` gains a question for the flag; `learning-config(.example).md` gains the flag (and
  a `last_checked` field).
- Discovery runs as a background sub-agent: a real cost per lesson-completion, but bounded and
  infrequent, and non-blocking by construction.
- The read-only/generate boundary must be enforced in the sub-agent's prompt — discovery only.
