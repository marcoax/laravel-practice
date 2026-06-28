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
- **`index.html`** — standalone progress tracker, saves to browser `localStorage`
  (Export/Import as JSON). No build step.
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

When editing a lesson brief, keep the format (what changed, why it matters, what to try,
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

## Lesson lifecycle

No lesson is left implicitly "done". At the **end of each lesson**, before moving on,
capture completion and reflection with two writes (see ADR-0004):

1. **Update `progress.json`** (git-ignored, at the repo root) — set the lesson's
   `status` to `"done"` and store the learner's `note`. The file mirrors the tracker's
   import payload: `{ "progress": { "<lesson-id>": { "status", "note" } } }`, keyed by the
   numeric `id` in `index.html`'s `LESSONS` array (lesson 01 → `"1"`).
2. **Write/update the learning record** `learning-records/NNNN-<slug>.md` — the narrative
   outcome and key insight.

`learning-records/` is the narrative source of truth; `progress.json` is the structured
mirror the tracker UI reads. `index.html` auto-loads `progress.json` on open (graceful
fallback when absent), so the browser tracker reflects the agent-written state without
manual ticking. Keep the two writes in sync.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs
are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
