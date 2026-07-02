# laravel-12-13-practice

A **content repo**, not a runnable app — no `composer.json`/`artisan`. It is a
**Laravel 12 → 13** learning path run with the `/teach` skill: each lesson teaches a
single change from 12.x to 13.x, assessed against **your reference project** — a real
codebase you choose at setup (`/lesson-init`), recorded in the git-ignored
`learning-config.md`.

## Repo shape

- **`lessons/NN-*.md`** — 12 chronological lesson briefs. New lessons start from
  `lessons/_template.md`.
- **`lessons/NN-*.html`** — the rendered lessons produced during `/teach` sessions; they
  reuse the shared stylesheet `assets/lesson.css`.
- **`index.html`** — the single course page, served over a local static server: sidebar
  with one unified lesson list (core + release lessons, continuous numbering) and live
  done/todo status from `progress.json` + lesson pane + read-only note panel +
  click-to-deepen prompt-prefill buttons. Read-only on progress (the agent is the only
  writer, via `progress.json`). No build step. See ADR-0013/0015.
- `MISSION.md`, `NOTES.md`, `learning-records/` — `/teach` workspace state.

## Rules

- **All lessons are generated as HTML** in `./lessons/NN-<name>.html`, reusing the shared
  stylesheet `./assets/lesson.css`; they must be clean and printable. The `.md` briefs stay
  as source/summary, but the teaching output is always HTML.
- **Language:** project Markdown and documentation files are always written in **English**.
  The chat conversation and the HTML lessons (learner-facing material) follow the learner's
  chosen `language.chat` in `learning-config.md` — **default English**, selectable among
  `en | it | fr | de | es` at `/lesson-init`.
- Ground every lesson on **your reference project** (the `reference_project` in
  `learning-config.md`) as a concrete example, not as absolute truth.
- **Learn by Doing mode.** This project sets the `Learning` output style as the default in
  `.claude/settings.json`. When generating code that involves a design decision, set up the
  scaffolding and leave the key 2–10 lines to the user via a single `TODO(human)` block,
  rather than handing over finished code. It is separate from `/teach`: `/teach` decides
  *what* to teach, the output style decides *how* to interact.

When editing a lesson brief, keep the format (what changed, why it matters,     what to try,
relevance questions) and match the existing lessons' tone.

See `NOTES.md` for teaching preferences and `MISSION.md` for context.

## Config binding

This repo is a neutral, forkable template; the learner's choices are per-user and
git-ignored. If **`learning-config.md`** exists at the repo root, treat its values as
**authoritative** — the reference project, the language split (chat/lessons vs docs),
and the pedagogy fields (`practice_default`, `quiz_format`, `deep_dive`,
`branch_convention`). The output style is enforced separately via
`.claude/settings.local.json`; `model` is advisory only. If `learning-config.md` is
**absent**, suggest running **`/lesson-init`** to create it. See
`learning-config.example.md` for the schema and ADR-0001/0003.

**Permission mode.** This workspace defaults to auto-accept edits via
`permissions.defaultMode: "acceptEdits"` so `/teach` can write lessons, learning
records, and `progress.json` without per-edit prompts. Like the output style, it lives
in the **git-ignored** `.claude/settings.local.json` (per-user, not in the tracked
template), so each contributor opts in on their own machine. See ADR-0008.

## Lesson lifecycle

No lesson is left implicitly "done". At the **end of each lesson**, before moving on,
capture completion and reflection with two writes (see ADR-0004):

1. **Update `progress.json`** (git-ignored, at the repo root) — set the lesson's
   `status` to `"done"` and store the learner's `note`. Shape:
   `{ "progress": { "<lesson-key>": { "status", "note" } } }`, keyed by the `key` in
   `index.html`'s `LESSONS` array — the numeric id for core lessons (lesson 01 → `"1"`),
   the version string for release lessons (e.g. `"13.9.0"`, ADR-0006).
2. **Write/update the learning record** `learning-records/NNNN-<slug>.md` — the narrative
   outcome and key insight.
3. **(13.x lessons only) Offer the recap 13.x — opt-in** (ADR-0014). After the two
   writes, if the completed lesson covers Laravel 13.x (core lessons 06–12 or any 13.x
   release lesson), ask the learner: **"add this lesson to the recap 13.x?"**.
   - **First accept** creates `lessons/recap-13x.html` with a **backfill** of *all*
     completed 13.x material (core lessons 06–12 plus done release lessons), rebuilt
     from the learning records, and adds the entry to `index.html`'s `RECAPS` array.
   - **Later accepts grow it hybrid:** append the lesson's row to the map table; add
     **1–2 quiz questions that actively interleave** with lessons already in the recap
     (cross-lesson, never a per-lesson log); rewrite the **"filo rosso"** (cross-lesson
     patterns) **only** when the new lesson confirms or breaks a pattern — otherwise
     leave it untouched.
   - The recap stays **untracked in `progress.json`** (precedent: `recap-12x`) — review
     pages never inflate or block course completion.
   - **Fail-soft:** a declined or failed recap update is skipped silently and never
     blocks the gate.
4. **(Optional) Fire the background lesson-update check** — only when
   `auto_check_new_lessons: on` in `learning-config.md` (ADR-0007). After the two writes
   above, spawn a **read-only background discovery sub-agent** that runs steps 1–3 of
   `/lesson-update` (discover → filter against `laravel_version_scanned` / `lessons_skipped`),
   then reports `N candidates → view now or later?`. **Hard boundary:** the sub-agent
   *discovers and proposes only* — it may advance `laravel_version_scanned` / `last_checked`,
   but it must **never** generate lessons, advance `laravel_version_covered`, or touch
   `lessons_skipped` (those happen only on the learner's explicit accept/skip in the
   foreground). **Fail-soft:** a failed check (e.g. network down) is skipped silently and
   never blocks the gate or delays moving on. The trigger is **lesson completion**, not
   `teach-lesson` startup. `/lesson-update` stays manually invocable regardless of the flag.

`learning-records/` is the narrative source of truth; `progress.json` is the structured
mirror the course page reads. `index.html` polls `progress.json` (graceful fallback when
absent), so the browser reflects the agent-written status and notes without manual
ticking. Keep the two writes in sync.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs
are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
