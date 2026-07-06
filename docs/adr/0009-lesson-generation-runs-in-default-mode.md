# ADR-0009 — `/lesson-update` generates lessons in default mode, not Learn by Doing

**Status:** Accepted (2026-06-30)

## Context

Lesson sessions default to the **`Learning`** output style through ADR-0020. That style is
*Learn by Doing*: when generating code that involves a design decision, the agent scaffolds
and leaves the key 2–10 lines to the learner via a single `TODO(human)` block. It is the
right default for `/teach`, where the learner collaborates on real code against their
reference project.

But `/lesson-update` step 5 (*Generate the accepted ones*) writes Markdown
lesson **briefs** into `lessons/`. That is *content authoring*, not co-writing application code
on a design decision. With `Learning` active, the agent is nudged to leave a `TODO(human)` in a
generated brief — which it did during a real run (`lessons/13.15.0.md` shipped with a placeholder
assessment line the learner had to delete by hand). A freshly generated lesson should be
**complete**, not half-authored. (Issue #21.)

`CLAUDE.md` already draws the relevant line:

> Learn by Doing mode … is separate from `/teach`: `/teach` decides *what* to teach, the output
> style decides *how* to interact.

`/lesson-update` is neither *what* nor *how* to teach — it authors the **source material**. So the
Learn-by-Doing style does not apply to its output.

## Decision

- **Lesson generation runs as if in default output style.** Generated briefs must be **complete**:
  the agent **never emits a `TODO(human)` block** or a placeholder line for the learner to fill in.
- This is enforced as an explicit instruction in `.claude/skills/lesson-update/SKILL.md` step 5
  (*Generate the accepted ones*), not by toggling settings files — the skill describes the
  behaviour it requires of its own output, leaving lesson-scoped `Learning` to `/teach`.
- The background-discovery path (ADR-0007) is unaffected: it already **must not generate** at all,
  so it never reaches this step.

## Consequences

- `/lesson-update` produces finished, self-contained briefs every time; no manual cleanup of stray
  `TODO(human)` markers.
- The Learn-by-Doing interaction stays where it belongs — `/teach` sessions over real code.
- Establishes the reusable boundary for this repo: **the output style governs *interaction*, a skill
  governs its *output*.** A skill that authors source material opts out of Learn by Doing for what it
  writes, regardless of the session default.
