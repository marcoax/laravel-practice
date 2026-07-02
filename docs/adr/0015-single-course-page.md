# ADR-0015 — Single course page: the shell absorbs the tracker

**Status:** Accepted (2026-07-02) — partially supersedes ADR-0013's "extends, not
replaces" clause and dissolves its shared-catalogue debt.

## Context

ADR-0013 introduced the course shell (`course.html`) as a companion that *extends* the
progress tracker (`index.html`): "the tracker remains the place to flip status and take
notes; the shell is read-only on progress". Two developments made that coexistence
fiction:

- Since ADR-0004 the **agent writes `progress.json`** — status *and* rich notes — at
  every lesson lifecycle gate, and `progress.json` overrides manual flips on load. The
  tracker's write role (status buttons, note textareas, localStorage, Export/Import) was
  dead in practice.
- The two pages **duplicated the lesson catalogue** (the drift ADR-0013 explicitly
  flagged) and had already drifted: the tracker listed only the 12 core lessons and
  ignored the release lessons already completed in `progress.json`.

A smaller friction: the version-pure distinction leaked into the shell's UI (separate
sidebar array/section, kebab-slug titles, computed numbering) when, for the learner,
release lessons are simply lessons.

## Decision

**One page.** The course shell becomes the new `index.html`; `course.html` is deleted
and the old tracker retired. Serving the repo root opens the course directly. The
shell's architecture is the one that survives: poll `progress.json` for status/notes,
poll the open lesson's HTML for the auto-reload, iframe pane, deepen channel unchanged.
The tracker's localStorage state, manual status buttons, filters, and Export/Import are
retired — obsoleted by the agent-written `progress.json` (ADR-0004).

**One lesson list.** The sidebar shows a single unified `LESSONS` array — core and
release lessons, continuous positional numbering (01…14+), human-readable titles with
the release lesson's version shown inline. Each entry carries its `progress.json` `key`
(numeric id for core lessons, version string for release lessons). The version-pure
distinction disappears **at the UI level only**: the version string remains the internal
identity — dedup key for `/lesson-update`, `progress.json` key, filename, frontmatter —
per ADR-0005/0006, untouched. No file renames, no key migration (rejected: state
migration + two ADR rewrites for aesthetics).

**A read-only note panel.** The page renders the `note` field already present in the
polled `progress.json` for the active lesson — collapsible, read-only, no new data
channel. The agent at the gate stays the only writer; there is no state to reconcile.

## Consequences

- One entry page, one catalogue, one writer: the two-page drift class is gone, and the
  template a forker adapts is smaller.
- ADR-0013's deepen channel and the file-over-HTTP seam (ADR-0004) survive unchanged —
  the note panel, unified list, and recap section all sit behind the same seam; no new
  seams introduced.
- `/teach-lesson` warms up and deep-links `http://localhost:8000/#<slug>`;
  `/lesson-update` appends new release lessons to the one `LESSONS` array in
  `index.html`.
- Manual status flips and browser-local notes are no longer possible; progress is
  written exclusively at the lesson lifecycle gate. Anyone using the course without an
  agent edits `progress.json` by hand.
- Verification stays manual (content repo, no build step): serve the root, check the
  unified numbering and status dots, the note panel, the auto-reload, the recap section.
