# Context — laravel-12-13-practice

A **content/teaching repo** (no runnable app) that drives a stateful Laravel 12→13
learning path. This file is the single-context glossary for the repo; see `docs/adr/`
for the decisions behind these terms. Created lazily via `/grill-with-docs`.

## Two halves of the repo

The workspace splits cleanly into:

- **Template (tracked, neutral, forkable)** — config, shared CSS, lesson briefs,
  the progress tracker, the init skill, and neutral docs. Contains **no** mention of a
  specific reference project.
- **Per-user state (git-ignored)** — the learner's actual choices and progress:
  `learning-config.md`, `progress.json`, `MISSION.md`, `NOTES.md`,
  `learning-records/`, `lessons/*.html`.

See ADR-0001.

## Glossary

Use these terms in issues, ADRs, skill prompts, and code. Avoid the synonyms noted.

- **learning-config.md** — the per-user, git-ignored file holding the learner's setup
  choices (output style, reference project, language, and the pedagogy fields). The
  authoritative source for "how to approach the lessons" at runtime. _Avoid:_ "settings",
  "preferences file". See ADR-0001.

- **/lesson-init** — the one-shot skill that interviews the learner and writes
  `learning-config.md` (and `.claude/settings.local.json` for the output style). Run once
  per workspace. Distinct from `/teach`, which runs the lessons. See ADR-0002.

- **reference project** — the real codebase a learner assesses each lesson against
  ("does my project actually need this change?"). A **per-user choice**, not baked into
  the template. _Avoid:_ naming a specific project (e.g. eraCms) in tracked files. See ADR-0001.

- **pedagogy fields** — the teaching-approach settings captured by `/lesson-init` beyond
  the four essentials: `practice_default`, `quiz_format`, `deep_dive`, `branch_convention`.
  See ADR-0002.

- **config binding** — the always-loaded instruction in `CLAUDE.md` that tells the agent
  to treat `learning-config.md` as authoritative when present, and to suggest `/lesson-init`
  when absent. See ADR-0003.

- **lesson lifecycle gate** — the end-of-lesson rule (in `CLAUDE.md`): before advancing,
  mark the lesson done and capture notes by updating **both** `progress.json` (structured,
  for the tracker UI) and a `learning-records/NNNN-*.md` (narrative). See ADR-0004.

- **progress.json** — a git-ignored, agent-writable state file shaped like the tracker's
  import payload (`{ progress: { <lesson-id>: { status, note } } }`). The bridge between the
  filesystem (where the agent writes) and `index.html` (which lives in browser
  localStorage). `index.html` auto-loads it. See ADR-0004.

- **progress tracker** — `index.html`, the standalone localStorage-backed progress UI.
  The agent cannot write its localStorage directly; it writes `progress.json` and the UI
  reflects it. _Avoid:_ "dashboard". See ADR-0004.
