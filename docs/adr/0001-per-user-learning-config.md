# ADR-0001 — Per-user learning config; template stays neutral

**Status:** Accepted (2026-06-28)

## Context

The repo is a public, forkable teaching template, but today the *approach* to the lessons
is hardcoded in tracked files: `CLAUDE.md`/`README`/`NOTES.md` name one private reference
project as "the real project", and `MISSION.md` bakes in one learner's role and goal. That
reference project is private client code, and the choices (which reference project,
language, output style) are inherently per-learner. Baking them into the public template
leaks private context and makes the template not truly forkable.

## Decision

Split the repo into two halves:

- **Template (tracked, neutral):** config, shared CSS, lesson briefs, `index.html`,
  the init skill, neutral docs. No specific reference project named.
- **Per-user state (git-ignored):** the learner's choices live in a new
  **`learning-config.md`** at the repo root, alongside the already git-ignored
  `MISSION.md`, `NOTES.md`, `learning-records/`, `lessons/*.html`, and, from
  ADR-0019, `RESOURCES.md`.

`learning-config.md` holds: `output_style`, `reference_project` (a path; required — the
"no project, concepts only" case is covered by `practice_default`, not by leaving this
empty), `model` (advisory only — see ADR-0003), `language`, `course_baseline_major`
(added by ADR-0016), and the pedagogy fields (`practice_default`, `quiz_format`,
`deep_dive`, `branch_convention`).

As part of adopting this, private reference project mentions in `CLAUDE.md`/`README`/`NOTES.md` are
**neutralised now** to "your reference project (set by `/lesson-init`)".

## Consequences

- The template becomes genuinely forkable; no private project ships in the public repo.
- A new always-loaded binding is needed so the agent reads `learning-config.md` (ADR-0003).
- `.gitignore` must cover `learning-config.md`, `progress.json` (ADR-0004), and
  `RESOURCES.md` (ADR-0019).
- Existing learner state (the private reference project as reference) moves from tracked prose into the
  git-ignored `learning-config.md`.
