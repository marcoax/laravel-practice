# ADR-0001 — Per-user learning config; template stays neutral

**Status:** Accepted (2026-06-28)

## Context

The repo is a public, forkable teaching template, but today the *approach* to the lessons
is hardcoded in tracked files: `CLAUDE.md`/`README`/`NOTES.md` name **eraCms** as "the real
project", and `MISSION.md` bakes in one learner's role and goal. eraCms is private client
code, and the choices (which reference project, language, output style) are inherently
per-learner. Baking them into the public template leaks private context and makes the
template not truly forkable.

## Decision

Split the repo into two halves:

- **Template (tracked, neutral):** config, shared CSS, lesson briefs, `index.html`,
  the init skill, neutral docs. No specific reference project named.
- **Per-user state (git-ignored):** the learner's choices live in a new
  **`learning-config.md`** at the repo root, alongside the already git-ignored
  `MISSION.md`, `NOTES.md`, `learning-records/`, `lessons/*.html`.

`learning-config.md` holds: `output_style`, `reference_project` (a path; required — the
"no project, concepts only" case is covered by `practice_default`, not by leaving this
empty), `model` (advisory only — see ADR-0003), `language`, and the pedagogy fields
(`practice_default`, `quiz_format`, `deep_dive`, `branch_convention`).

As part of adopting this, the eraCms mentions in `CLAUDE.md`/`README`/`NOTES.md` are
**neutralised now** to "your reference project (set by `/lesson-init`)".

## Consequences

- The template becomes genuinely forkable; no private project ships in the public repo.
- A new always-loaded binding is needed so the agent reads `learning-config.md` (ADR-0003).
- `.gitignore` must cover `learning-config.md` (and `progress.json`, ADR-0004).
- Existing learner state (eraCms as reference) moves from tracked prose into the
  git-ignored `learning-config.md`.
