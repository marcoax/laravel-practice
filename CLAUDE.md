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
- **`index.html`** — the single course page, served via
  `php -S localhost:8000 scripts/progress-server.php`: sidebar with one unified lesson
  list (core + release lessons, continuous numbering) and live todo/doing/done status
  from `progress.json` + lesson pane + read-only note panel + click-to-deepen
  prompt-prefill buttons + a segmented control to flip a lesson's status by hand
  (written through the progress endpoint). Notes remain agent-only. No build step.
  See ADR-0013/0015/0018.
- `MISSION.md`, `NOTES.md`, `learning-records/`, `RESOURCES.md` — `/teach`
  workspace state.

## Rules

- **All lessons are generated as HTML** in `./lessons/NN-<name>.html`, reusing the shared
  stylesheet `./assets/lesson.css`; they must be clean and printable. The `.md` briefs stay
  as source/summary, but the teaching output is always HTML.
- **External links open outside the course pane.** The lesson HTML renders inside `index.html`'s
  iframe, so every link to an off-site URL (`http(s)://…`, including protocol-relative `//…`) —
  primary source, secondary citations, curated resources, GitHub, video, anything not on the
  same origin — must carry `target="_blank" rel="noopener noreferrer"`. Internal course
  navigation (links to other lessons, `README.md`, local `#anchors`) stays plain and must keep
  loading in the current pane. `scripts/verify-external-links.mjs` checks this against a tracked
  fixture and, when present, any generated `lessons/*.html` on disk.
- **Language:** project Markdown and documentation files are always written in **English**.
  The chat conversation and the HTML lessons (learner-facing material) follow the learner's
  chosen `language.chat` in `learning-config.md` — **default English**, selectable among
  `en | it | fr | de | es` at `/lesson-init`.
- Ground every lesson on **your reference project** (the `reference_project` in
  `learning-config.md`) as a concrete example, not as absolute truth.
- **Learn by Doing mode — during lessons only (ADR-0020).** `lesson`/`/teach` read
  `output_style` from `learning-config.md` (default `Learning`) and apply it for the
  duration of the teaching session. With `Learning` active, when generating code that
  involves a design decision, set up the scaffolding and leave the key 2–10 lines to the
  user via a single `TODO(human)` block, rather than handing over finished code. Outside
  lessons no output style is imposed. It is separate from `/teach`: `/teach` decides
  *what* to teach, the output style decides *how* to interact.

When editing a lesson brief, keep the format (what changed, why it matters,     what to try,
relevance questions) and match the existing lessons' tone.

See `NOTES.md` for teaching preferences and `MISSION.md` for context.

## Config binding

This repo is a neutral, forkable template; the learner's choices are per-user and
git-ignored. If **`learning-config.md`** exists at the repo root, treat its values as
**authoritative** — the reference project, the language split (chat/lessons vs docs),
`course_baseline_major`, and the pedagogy fields (`practice_default`, `quiz_format`,
`deep_dive`, `branch_convention`). `output_style` is enforced by `lesson`/`/teach`
for lesson sessions only (ADR-0020) — the tracked `.claude/settings.json` stays neutral;
`model` is advisory only. If `learning-config.md` is **absent**, suggest running
**`/lesson-init`** to create it. See `learning-config.example.md` for the schema and
ADR-0001/0003/0020.

When `course_baseline_major` is `13`, learner-facing course flow must hide 12.x lessons
and `recap-12x`, and `/teach` / `lesson` must not propose or run 12.x lessons as
part of the active path. The filter is based on each lesson brief's `> Version:`
metadata, not numeric prefixes. Existing lesson files and `progress.json` entries stay
intact so changing the baseline back to `12` restores the full path.

**Permission mode.** This workspace defaults to auto-accept edits via
`permissions.defaultMode: "acceptEdits"` so `/teach` can write lessons, learning
records, and `progress.json` without per-edit prompts. The permission mode lives in the
**git-ignored** `.claude/settings.local.json` (per-user, not in the tracked template),
so each contributor opts in on their own machine. See ADR-0008.

## Lesson lifecycle

**At lesson start**, when a `/teach` session begins a lesson, set its `progress.json`
`status` to `"doing"` (ADR-0018). The learner can flip status manually from the course
page at any time — the page writes through the progress endpoint
(`scripts/progress-server.php`) into the same `progress.json`; last write wins.
A learner-flipped `"done"` **without** a learning record is a legitimate administrative
closure ("not interested / did it on my own") — never nag about it or reconcile it back.

No lesson is left implicitly "done". At the **end of each lesson**, after recall and the
ordinary optional deep-dive invitation, offer **learner-selected resource discovery**
(ADR-0019) before the final lifecycle writes:

- Use the learner's `language.chat` from `learning-config.md`. Render a short prompt
  equivalent to: **"Do you want me to search for highly authoritative web/YouTube
  resources on this topic and add them to the lesson + RESOURCES.md?"**
- **Declined or ignored:** do not search and do not change the lesson HTML or
  `RESOURCES.md`; continue the lifecycle gate.
- **Accepted:** search the web and YouTube, inspect candidates, and keep only very
  authoritative sources: official docs, package docs, release notes, framework/source
  repositories, or clearly recognized Laravel/PHP authors, maintainers, conference talks,
  and first-party ecosystem channels. Reject generic SEO tutorials, listicles, undated
  fast-moving API material, shallow videos, and marketing pages.
- Add at most **4 resources**: up to 2 official/primary sources and up to 2
  community/talk/video sources. Each accepted resource must include title, URL, type,
  author/channel/publisher, why it is authoritative, and why it helps this lesson.
- Patch both destinations: a compact localized `curated-resources` section near the
  lesson's existing deeper-study / primary-source area, and `RESOURCES.md` as the durable
  per-user index. Keep `RESOURCES.md` entries in English. Create `RESOURCES.md` lazily
  on the first accepted discovery.
- **Fail-soft:** if the web is thin, no candidate clears the authority bar, or the search
  fails, say so in chat and leave files untouched. This never blocks lesson completion.

Then capture completion and reflection with two writes (see ADR-0004):

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
   `lesson` startup. `/lesson-update` stays manually invocable regardless of the flag.

`progress.json` is authoritative for **status** (one store, two writers — agent at the
gate, learner via the progress endpoint; ADR-0018); `learning-records/` is the narrative
source of truth for gate-closed lessons. `index.html` polls `progress.json` (graceful
fallback when absent), so the browser reflects both writers' status and the agent-written
notes. Keep the gate's two writes in sync.

## Agent skills

### Issue tracker

Issues and PRDs live in this repo's GitHub Issues, managed via the `gh` CLI. External PRs
are **not** a triage surface. See `docs/agents/issue-tracker.md`.

### Triage labels

Default canonical vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`,
`ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
