# ADR-0003 — Config binding in CLAUDE.md; output style via Claude settings

**Status:** Accepted (2026-06-28)

## Context

`learning-config.md` (ADR-0001) is only useful if something reads it. Two sub-problems:

1. **Where the read happens.** `CLAUDE.md` is auto-loaded every session; `/teach` only when
   invoked. The language, reference project, and pedagogy should apply in any session, not
   only inside `/teach`.
2. **Output style enforcement.** The Learn-by-Doing style is *not* governed by markdown — it
   is enforced by Claude settings. The tracked `.claude/settings.json` carries the shared
   default (`{"outputStyle":"Learning"}`), while git-ignored `.claude/settings.local.json`
   can override it per user and takes precedence.

## Decision

- **Binding lives in `CLAUDE.md`** (always loaded): "If `learning-config.md` exists, its
  values (language, reference project, pedagogy) are authoritative; if absent, suggest
  `/lesson-init`."
- **Output style** defaults to `Learning` in tracked **`.claude/settings.json`** so the
  teaching workspace starts in Learn-by-Doing mode. `/lesson-init` may write a user-specific
  override to **`.claude/settings.local.json`** (git-ignored, higher precedence) when the
  learner chooses a different style.
- **`model` is advisory only.** A file cannot force the CLI's model; `learning-config.md`
  records the recommendation (Opus 4.8 + Fast mode) but does not enforce it.

## Consequences

- Choices apply in every session, including plain chat, not just `/teach`.
- The public template ships the recommended `Learning` default, but each learner can override
  it locally without committing personal settings.
- `.gitignore` covers `settings.local.json`; confirm it stays ignored.
