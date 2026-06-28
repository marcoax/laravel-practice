# ADR-0002 — `/lesson-init` skill bootstraps the workspace

**Status:** Accepted (2026-06-28)

## Context

`learning-config.md` (ADR-0001) needs to be created and populated when a learner forks the
template. Options considered: a dedicated skill, folding the setup into `/teach`, or a
hand-copied documented checklist. The setup is a distinct, one-time concern; mixing it into
`/teach` would bloat the teaching skill, and a manual checklist is easy to skip or get wrong.

## Decision

Add a dedicated **`/lesson-init`** skill, run **once per workspace**. It interviews the
learner one question at a time and writes `learning-config.md`. It captures the **four
essentials plus the pedagogy fields**:

1. `output_style` (default: **Learning** / Learn by Doing) — written to
   `.claude/settings.local.json`, see ADR-0003.
2. `reference_project` — path to the real codebase used as the "does my project need this?"
   yardstick.
3. `model` (advisory; default Opus 4.8 + Fast mode).
4. `language` (chat/lessons vs docs split; default: it / docs:en).
5. Pedagogy fields: `practice_default` (concepts-only | throwaway-app | reference-project),
   `quiz_format` (recall | multiple-choice), `deep_dive` (on/off), `branch_convention`.

`/teach` stays focused on running lessons; `/lesson-init` only bootstraps.

## Consequences

- A new skill folder is added (template-tracked, since the skill itself is generic).
- Each question ships a recommended default so init is fast.
- Re-running `/lesson-init` should update the existing `learning-config.md`, not blindly
  overwrite learner state.
- `learning-config.md` becomes the schema other tooling reads (ADR-0003, ADR-0004).
