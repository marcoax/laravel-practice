# ADR-0020 — Learning output style scoped to teaching sessions

**Status:** Accepted (2026-07-05). Supersedes the output-style half of ADR-0003
(the config-binding half of ADR-0003 stands unchanged).

## Context

ADR-0003 made `Learning` the workspace-wide default by shipping
`{"outputStyle":"Learning"}` in the tracked `.claude/settings.json`. In practice the
learner works in this workspace outside lessons too — reviews, maintenance, design
sessions — where Learn-by-Doing scaffolding (`TODO(human)`) is the wrong interaction
mode. The actual workspace had already overridden the style to `default` in
`.claude/settings.local.json`, contradicting what CLAUDE.md, AGENTS.md, README and
ADR-0003 claimed; a spec-adherence review surfaced the drift, and the learner
confirmed the real intent: **Learning applies while doing a lesson, not to the
workspace**.

## Decision

- The tracked **`.claude/settings.json` stays neutral (`{}`)** — no workspace-wide
  output-style default. (This makes `lesson-init`'s long-standing "stays neutral"
  claim true.)
- **`output_style` in `learning-config.md` is the single recorded choice**, and
  **`teach-lesson` / the `/teach` flow it launches is the enforcement point**: at
  hand-off the skill reads `output_style` (default `Learning`) and applies it
  *behaviorally* for the duration of the teaching session — with `Learning`, scaffold
  and leave the key 2–10 lines as a single `TODO(human)` block. It never writes the
  choice into settings files.
- `/lesson-init` records `output_style` in `learning-config.md` only. It no longer
  writes `outputStyle` to `.claude/settings.local.json`; a learner remains free to set
  a personal `outputStyle` there, but that is their general-work preference, not the
  course mechanism.

## Consequences

- Outside lessons the agent interacts in whatever style the user's own settings say —
  no more contradiction between the two per-user files.
- CLAUDE.md, AGENTS.md and README reword "this project sets Learning as the default"
  to "Learning applies during lessons, enforced by teach-lesson".
- The lesson experience is unchanged: a `/teach` session still runs Learn by Doing by
  default.
