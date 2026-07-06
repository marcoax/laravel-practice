# ADR-0003 — Config binding in CLAUDE.md; output style via Claude settings

**Status:** Accepted (2026-06-28). Output-style enforcement superseded by ADR-0020; `model` recommendation amended by ADR-0021 (agent-agnostic suggestion).

## Context

`learning-config.md` (ADR-0001) is only useful if something reads it. Two sub-problems:

1. **Where the read happens.** `CLAUDE.md` is auto-loaded every session; `/teach` only when
   invoked. The language, reference project, and pedagogy should apply in any session, not
   only inside `/teach`.
2. **Output style enforcement.** Superseded by ADR-0020: the repo no longer enforces
   Learn-by-Doing through Claude settings. The tracked `.claude/settings.json` stays neutral,
   and `output_style` is read from `learning-config.md` for lesson sessions only.

## Decision

- **Binding lives in `CLAUDE.md`** (always loaded): "If `learning-config.md` exists, its
  values (language, reference project, course baseline, pedagogy) are authoritative; if absent, suggest
  `/lesson-init`."
- **Output style enforcement is superseded by ADR-0020.** `/lesson-init` records
  `output_style` in `learning-config.md`; `teach-lesson` applies it behaviorally during
  lesson sessions. The tracked `.claude/settings.json` stays neutral, and
  `.claude/settings.local.json` remains the learner's general-work preference.
- **`model` is advisory only.** A file cannot force the CLI's model; `learning-config.md`
  records the recommendation (Opus 4.8 + Fast mode) but does not enforce it.

## Consequences

- Config choices other than output style apply in every session, including plain chat, not
  just `/teach`.
- The public template no longer ships a workspace-wide output-style default; lesson-scoped
  Learn-by-Doing behavior is governed by ADR-0020.
- `.gitignore` covers `settings.local.json`; confirm it stays ignored.
