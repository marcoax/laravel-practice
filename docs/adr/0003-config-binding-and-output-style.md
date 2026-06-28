# ADR-0003 — Config binding in CLAUDE.md; output style via settings.local.json

**Status:** Accepted (2026-06-28)

## Context

`learning-config.md` (ADR-0001) is only useful if something reads it. Two sub-problems:

1. **Where the read happens.** `CLAUDE.md` is auto-loaded every session; `/teach` only when
   invoked. The language, reference project, and pedagogy should apply in any session, not
   only inside `/teach`.
2. **Output style enforcement.** The Learn-by-Doing style is *not* governed by markdown — it
   is enforced by `.claude/settings.json` (`{"outputStyle":"Learning"}`), which is **tracked**.
   Writing a per-user style choice into the tracked settings contradicts the neutral-template
   decision (ADR-0001). A git-ignored `.claude/settings.local.json` already exists and takes
   precedence.

## Decision

- **Binding lives in `CLAUDE.md`** (always loaded): "If `learning-config.md` exists, its
  values (language, reference project, pedagogy) are authoritative; if absent, suggest
  `/lesson-init`."
- **Output style** is written by `/lesson-init` to **`.claude/settings.local.json`**
  (git-ignored, per-user, higher precedence). The tracked `.claude/settings.json` is
  **neutralised** (its `outputStyle` removed, or left only as a soft template default).
- **`model` is advisory only.** A file cannot force the CLI's model; `learning-config.md`
  records the recommendation (Opus 4.8 + Fast mode) but does not enforce it.

## Consequences

- Choices apply in every session, including plain chat, not just `/teach`.
- The public template no longer ships a forced output style.
- `.gitignore` already covers `settings.local.json`; confirm it stays ignored.
