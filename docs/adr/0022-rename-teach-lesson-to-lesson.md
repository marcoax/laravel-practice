# ADR-0022 — Rename the `teach-lesson` skill to `lesson`

**Status:** Accepted (2026-07-06). Earlier ADRs that mentioned
`teach-lesson` (0003, 0007, 0013, 0015–0018, 0020) were updated in place to
the new name, so the ADR set reads consistently.

## Context

The repo's course launcher was named `teach-lesson`, while the generic
teaching engine it wraps is the user-global `/teach` skill. The two names
share the `teach` prefix and appear side by side throughout the docs
(`teach-lesson`/`/teach`), forcing every reader to re-derive which one is
the wrapper and which the engine. Meanwhile the repo's other two skills are
already `lesson-init` and `lesson-update` — the launcher was the only one
outside the `lesson` family.

Alternatives considered:

1. **`lesson`** — completes the family (`/lesson-init` → `/lesson` →
   `/lesson-update`) and reads naturally with an argument (`/lesson 3`,
   matching the spoken request "do lesson 3").
2. **`lesson-start`** — more consistent with the `lesson-<verb>` grammar of
   its siblings, but longer for the most-typed command in the workflow.
3. **Keep `teach-lesson`** — zero cost, but the prefix confusion persists in
   a template meant to be forked.

## Decision

- **Rename to `lesson`.** Both mirrors move: `.claude/skills/teach-lesson/`
  → `.claude/skills/lesson/` and `.agents/skills/teach-lesson/` →
  `.agents/skills/lesson/`, with `name: lesson` in the frontmatter.
- **Keep the old name as a trigger phrase.** The skill description retains
  "teach-lesson (its former name)" so habitual invocations and older notes
  still route to the right skill.
- **Living documents follow the new name**: `CLAUDE.md`, `README.md`,
  `AGENTS.md`, `CONTEXT.md`, `NOTES.md`, `learning-config.example.md`,
  `index.html`'s empty-state message, `scripts/verify-course-baseline.mjs`
  (which reads the skill file by path), and the cross-references in
  `lesson-init`/`lesson-update` (both mirrors).
- **Prior ADRs follow too.** The name occurrences in ADR-0003/0007/0013/
  0015/0016/0017/0018/0020 are updated in place — they describe mechanisms
  that are still live, so keeping a dead name there would only preserve the
  confusion this rename removes.
- **Narrative history keeps the old name**: `learning-records/`, `specs/`,
  and per-user `progress.json` notes are session records of what was true
  when written and are left untouched.

## Consequences

- The learner-facing command set is uniform: `/lesson-init`, `/lesson`,
  `/lesson-update`. Bare `/teach` remains the internal engine and is still
  never surfaced to the learner (per `lesson-init`'s hand-off rule).
- The rename is repo-local: the global `/teach` skill never references the
  launcher by name, so nothing outside the repo changes.
- Anyone reading a learning record or old spec must map `teach-lesson` →
  `lesson`; this ADR is the pointer. The ADR set itself already uses the
  new name throughout.
