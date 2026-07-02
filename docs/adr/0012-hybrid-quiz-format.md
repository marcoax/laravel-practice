# ADR-0012 — Hybrid quiz format: recall by default, MCQ on discrimination beats

**Status:** Accepted (2026-07-02)

## Context

`learning-config.md` declares `quiz_format: recall` with the note *"switch to
multiple-choice where concepts confuse"*, and `NOTES.md` says to *"also consider multiple
choice in lessons where it fits (e.g. telling close concepts apart)"*. But the policy was
never realized: `assets/` contained only the open-recall accordion styling, and every
lesson used `<details>` question → answer. The "switch to multiple-choice" branch had
never been exercised. (Issue #25.)

The pedagogy trade-off:

- **Open recall** maximizes *desirable difficulty* — free retrieval builds storage
  strength. It stays the right default.
- **Multiple choice** is recognition, not recall — weaker for retention — but better for
  *discrimination* drills where two close APIs/concepts are easily confused
  (`hasMany()` vs `hasSole()`, `same-origin` vs `same-site`), and it gives an automatic
  right/wrong feedback loop.

## Decision

**Hybrid (outcome 3 of issue #25):**

- **Recall stays the default** quiz format for every lesson.
- **MCQ is used only on explicit discrimination beats** — questions whose whole point is
  telling two close things apart. It complements the recall block; it never replaces it.
- The widget is a **reusable component** per the Assets philosophy: `assets/quiz-mcq.js`
  plus `.mcq` styles in `assets/lesson.css`. Lessons opt in declaratively: a
  `<fieldset class="mcq" data-answer="…">` with radio options and a check button, plus a
  `<script src="../assets/quiz-mcq.js" defer>` tag. No build step, no dialogs.
- **Printability:** in print the check button and feedback are hidden; the question and
  its options remain as a paper drill. The answer key lives in the `data-answer`
  attribute — same openness as the recall widget, whose answers are plain HTML anyway.
- **Authoring rules** (already in NOTES.md): options of equal length, no formatting cues.
  Each fieldset uses its own radio `name` (`q1`, `q2`, …), otherwise radios of different
  questions would form one group.
- First user: **lesson 05** (`hasMany()` vs `hasSole()`, `Arr::only()` vs
  `Arr::onlyValues()`).

## Consequences

- The `quiz_format` note in `learning-config.md` and the NOTES.md guidance are now
  backed by a real component instead of an unrealized promise.
- `/teach` and `/lesson-update` may emit MCQ blocks only for discrimination beats;
  everything else keeps the recall accordion.
- Lessons gain a small JS dependency, loaded `defer`, that degrades gracefully: without
  JS the options are still readable and answerable on paper.
