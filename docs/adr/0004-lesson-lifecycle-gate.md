# ADR-0004 — Lesson lifecycle gate: sync learning-record + progress.json

**Status:** Accepted (2026-06-28)

## Context

Lessons were being left implicitly "done"; completion and reflection were not captured as
explicit steps. We want an end-of-lesson gate: before advancing, mark the lesson complete
and capture notes.

Key constraint: the progress tracker `index.html` stores state in **browser localStorage**,
which an agent on the filesystem cannot write. The tracker does, however, import a JSON
payload shaped `{ progress: { <lesson-id>: { status, note } } }`, and `learning-records/`
are already agent-writable files.

Where should the *rule* live? `CLAUDE.md` is always loaded (rule fires every session);
`NOTES.md` is git-ignored and never auto-loaded; a skill only fires on invocation. The gate
must fire at the end of **every** lesson, so it needs an always-loaded home — and that makes
a dedicated "lesson-runner" skill unnecessary for now.

## Decision

Add a **"Lesson lifecycle"** section to `CLAUDE.md` (tracked, always loaded). At the end of
each lesson the agent must:

1. Update **`progress.json`** (git-ignored) — set the lesson's `status: "done"` and write
   the learner's `note`.
2. Write/update the matching **`learning-records/NNNN-*.md`** (narrative outcome + insight).

`index.html` is extended to **auto-load `progress.json`** on open (in addition to the
existing Export/Import buttons), so the UI reflects the agent-written state. The two writes
are kept in sync: `learning-records/` is the narrative source of truth, `progress.json` the
structured mirror for the UI.

No separate lesson-runner skill is built; the always-loaded rule covers it. A GitHub issue is
therefore not needed to track it.

## Consequences

- Completion and reflection become explicit, captured steps.
- `index.html` gains a small auto-load of `progress.json` (graceful fallback if absent).
- `.gitignore` must cover `progress.json`.
- `progress.json` lesson-ids must match the `LESSONS` ids defined in `index.html`.
