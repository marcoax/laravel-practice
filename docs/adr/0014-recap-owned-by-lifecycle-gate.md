# ADR-0014 — Recap 13.x owned by the lesson lifecycle gate, opt-in, hybrid growth

**Status:** Accepted (2026-07-02)

## Context

The course page's sidebar reserves a "recap" section for major-release review pages.
`recap-12x.html` was born ad hoc — created by hand before lesson 06 as a review of the
12.x lessons — and no skill or lifecycle step is responsible for creating or growing a
recap. Without an owner, the 13.x recap would simply never exist, even though the 13.x
material (core lessons 06–12 plus every `/lesson-update` release lesson) is the densest
part of the course.

Candidate owners considered:

- **/lesson-update** — rejected: at discovery/generation time the lesson has not been
  *learned* yet, so there is nothing to recap.
- **A dedicated skill** — rejected: one more invocation the learner must remember; the
  recap would rot exactly like it does today.
- **The lesson lifecycle gate (ADR-0004)** — chosen: the gate already fires at every
  lesson completion and already rebuilds the lesson's outcome (verdict, drift, insight)
  into the learning record — the exact material a recap is made of.

## Decision

The lesson lifecycle gate gains an **opt-in third step**, after its two writes, for
**13.x lessons only** (core lessons 06–12 and 13.x release lessons): the agent asks
*"add this lesson to the recap 13.x?"*. The learner stays in control of the review
material — asked, never forced.

- **First accept = creation with backfill.** `lessons/recap-13x.html` is created with
  *all* completed 13.x material (core 06–12 plus done release lessons), rebuilt from the
  learning records, so early lessons don't pay for predating the mechanism. The entry is
  added to `index.html`'s `RECAPS` section.
- **Subsequent accepts = hybrid growth.** Append the lesson's row to the map table; add
  **1–2 quiz questions actively interleaved** with lessons already in the recap
  (cross-lesson retention, not a per-lesson log); rewrite the **"filo rosso"**
  (cross-lesson patterns) **only** when the new lesson confirms or breaks a pattern —
  a synthesis stays a synthesis.
- **Untracked in `progress.json`** (precedent: `recap-12x`): recaps are review pages,
  not course steps — they never inflate or block completion.
- **Fail-soft**, like the ADR-0007 background check: a skipped or failed recap update
  never blocks the gate or delays moving on.

`recap-12x` is frozen as-is; no retroactive treatment for 12.x.

## Consequences

- The recap 13.x has an explicit owner and a defined growth discipline; no 13.x lesson
  completion can silently skip the question (the step is named in `CLAUDE.md`'s
  lifecycle section, the always-loaded home of the gate).
- The gate grows from two writes to two writes + one question; the question costs one
  interaction per 13.x lesson and nothing when declined.
- Verification is end-to-end at the next gate: complete a 13.x lesson → the question
  fires → first accept produces the backfilled page.
