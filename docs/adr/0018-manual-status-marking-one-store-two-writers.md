# ADR-0018 — Manual status marking: one store, two writers

**Status:** Accepted (2026-07-03) — partially supersedes ADR-0015's "read-only on
progress" clause. Spec: `specs/restore-manual-status-marking.html` (outcome of a
/grill-with-docs session).

## Context

The retired progress tracker let the learner flip a lesson *todo / doing / done* by
hand. ADR-0015 removed that when the course page absorbed the tracker: progress became
writable only by the agent at the lesson lifecycle gate (ADR-0004), and "anyone using
the course without an agent edits `progress.json` by hand". The learner wants manual
flips back — including the *in progress* ("doing") state, whose CSS (`.dot.doing`)
survived in `index.html` as dead code — without reintroducing the two-store drift
(localStorage vs `progress.json`) that ADR-0015 eliminated.

The blocker was never the UI; it was that a static page cannot write a file. ADR-0015
resolved that by removing the writer. This ADR resolves it by giving the page one.

## Decision

**D1 — One store, two writers.** A minimal PHP router
(`scripts/progress-server.php`, served by the same `php -S` the page already
requires: `php -S localhost:8000 scripts/progress-server.php`) exposes
`POST /progress` and writes `progress.json` — validate `{key, status}`, merge
preserving any existing `note`, write atomically (temp file + `rename()`). GET falls
through to the built-in static file serving. `progress.json` stays the **single**
source of truth; the agent (at the gate) and the page (on user click) both write it.
No localStorage, no merge logic, no Export/Import. The invariant shifts from "one
writer" to "one store".

**D2 — A user "done" is a full done.** It counts in the progress bar and is never
second-guessed or reconciled by the agent. A done lesson *without* a matching learning
record is, by definition, a learner's administrative closure ("not interested / did it
on my own") — no separate "skipped" status; the absence of the record already encodes
it. Consequence: `progress.json` is authoritative for *status*;
`learning-records/` remains the narrative source of truth only for gate-closed lessons.

**D3 — "doing" has two writers.** The agent sets `status: "doing"` when a `/teach`
session starts a lesson; the user can flip it manually from the page. Last write wins
on the same store — no structural conflict. `/teach-lesson` (the menu launcher) stays
read-only on progress.

**D4 — Compact segmented control in the pane-bar.** The three states render as a mini
segmented control next to the "✎ note" button, only when a lesson is open. Active
segment filled with the state color (todo = ink/gray, doing = `--warn`, done =
`--ok`), inactive segments outline-only. Recaps have no `progress.json` key
(ADR-0014) → the control does not render for them, same rule as the note toggle.
Notes stay read-only (agent-written channel, unchanged from ADR-0015). Rejected: the
old tracker's three full-width buttons (too bulky for the pane-bar) and a single
cycling button (too implicit).

**Degradation (found during implementation, beyond the spec).** Plain `php -S`
answers unknown URIs by serving `index.html` with a **200**, so an HTTP status check
alone would silently pretend to save. The client therefore requires a JSON response
body before trusting the write; anything else reverts the optimistic update and shows
`⚠ no write endpoint — serve with scripts/progress-server.php`.

## Consequences

- Partially supersedes ADR-0015: the course page is no longer read-only on progress.
  Its one-store architecture survives intact — the page still polls `progress.json`
  (the 4s poll re-syncs both writers), and the retired localStorage/filters/
  Export-Import stay retired.
- The ADR-0004 gate is unchanged for records and recap: the agent still writes
  status + note and the learning record at lesson end. New at lesson *start*: the
  agent sets `"doing"`.
- The agent must not nag or reconcile a learner-flipped `done` that has no learning
  record — it is a legitimate administrative closure (D2).
- The serve command changes to `php -S localhost:8000 scripts/progress-server.php`
  (page footer, README, `teach-lesson` warm-up). ADR-0013 stays untouched as a
  historical record. Serving without the router keeps the page fully readable;
  only manual marking degrades, loudly.
- The repo is no longer JS-only static serving: forkers publishing to GitHub Pages
  get a read-only course page (the POST endpoint needs local PHP).
- Verification stays manual (content repo): spec §7 checklist —
  `specs/restore-manual-status-marking.html`.
