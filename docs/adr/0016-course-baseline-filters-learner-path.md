# ADR-0016 — Course baseline filters the learner path

**Status:** Accepted (2026-07-02)

During `/lesson-init`, the learner chooses a `course_baseline_major` from the supported
baseline list (`12` or `13`). This is a per-user course-flow choice, not a generic
`from_major -> to_major` engine: the template remains an authored Laravel 12 to 13 path.

If the baseline is `12`, the current course behavior is unchanged. If the baseline is
`13`, learner-facing surfaces hide all 12.x material: the course page does not show 12.x
lessons or `recap-12x`, and `/teach` / `teach-lesson` do not propose or run 12.x lessons,
including direct lesson requests. The authored lesson files and historical `progress.json`
entries remain intact; changing the baseline back to `12` makes that material visible again.

The filter is based on each lesson's Laravel major version, read from the lesson's
`Version:` metadata, not on file order or numeric lesson prefixes.
