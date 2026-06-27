# laravel-12-13-practice

A **content repo**, not a runnable app — no `composer.json`/`artisan`. It is a
**Laravel 12 → 13** learning path run with the `/teach` skill: each lesson teaches a
single change from 12.x to 13.x, assessed against the real project **eraCms**
(Laravel 13 + Vue 3).

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
- **Language:** project Markdown and documentation files are written in **English**; the
  chat conversation and the HTML lessons (learner-facing material) are in **Italian**.
- Ground every lesson on eraCms as a concrete example, not as absolute truth.
- **Learn by Doing mode.** This project sets the `Learning` output style as the default in
  `.claude/settings.json`. When generating code that involves a design decision, set up the
  scaffolding and leave the key 2–10 lines to the user via a single `TODO(human)` block,
  rather than handing over finished code. It is separate from `/teach`: `/teach` decides
  *what* to teach, the output style decides *how* to interact.

When editing a lesson brief, keep the format (what changed, why it matters, what to try,
relevance questions) and match the existing lessons' tone.

See `NOTES.md` for teaching preferences and `MISSION.md` for context.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs
are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
