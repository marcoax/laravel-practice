# ADR-0017 — Scope `auto_branch` to `/lesson-update`

**Status:** Accepted (2026-07-03)

With `auto_branch: on`, `/teach` used to cut a fresh per-lesson branch at lesson start.
But a `teach-lesson` session's entire output is git-ignored by design (`lessons/*.html`,
`learning-records/`, `progress.json`, `NOTES.md`, `learning-config.md`), so the
per-lesson branch was **guaranteed empty** — cut-then-delete ceremony with zero payload
(issue #26, confirmed in lessons 07 and 08).

The branch *does* carry payload for `/lesson-update`: that flow generates a **tracked**
brief (`lessons/NN-*.md` / `lessons/<x.y.z>.md`) destined for a PR (ADR-0007).

## Options considered

1. **Scope `auto_branch` to `/lesson-update` only** — teach-lesson stays on the current
   branch; lesson-update keeps cutting branches + PRs.
2. **Lazy branching** — cut the branch only on the first tracked write of a session.
3. **Keep as-is, auto-clean** — document empty branches as expected, delete at session end.
4. **Turn `auto_branch` off** and branch on demand.

## Decision

**Option 1.** `auto_branch` (with `auto_branch_base` and `branch_convention`) is
consulted **only by `/lesson-update`**; `teach-lesson` / `/teach` sessions never cut a
branch, regardless of the flag. The field keeps its name — renaming (e.g.
`lesson_update_branch`) would break existing per-user configs for a field with only two
readers; the YAML comment carries the scope.

Lazy branching was rejected as stateful, fragile logic inside a global teaching skill,
covering a rare case: the occasional tracked write mid-lesson (a drift fix in a tracked
brief, an edit to `assets/lesson.css`) stays **manual** — the learner or the agent
proposes a branch at that moment.

With the empty-branch cost gone by construction, the default flips to `auto_branch: on`:
every branch it creates now has tracked payload, and PR isolation is the behavior you
want for generated briefs. This also resolves the prior inconsistency where
`learning-config.example.md` said `off` while `/lesson-init` proposed `on`.

## Consequences

- teach-lesson sessions produce no throwaway branches; enforcement lives in the config
  comments (which `/teach` reads at runtime) and in the `teach-lesson` hand-off, with no
  change to the global `/teach` skill.
- Existing configs with `auto_branch: on` and the old semantics are reinterpreted under
  the new scope with no migration.
