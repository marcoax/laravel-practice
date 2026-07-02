# Context — laravel-12-13-practice

A **content/teaching repo** (no runnable app) that drives a stateful Laravel 12→13
learning path. This file is the single-context glossary for the repo; see `docs/adr/`
for the decisions behind these terms. Created lazily via `/grill-with-docs`.

## Two halves of the repo

The workspace splits cleanly into:

- **Template (tracked, neutral, forkable)** — config, shared CSS, lesson briefs,
  the course page, the init skill, and neutral docs. Contains **no** mention of a
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
  for the course page) and a `learning-records/NNNN-*.md` (narrative); for 13.x lessons,
  then offer the recap (opt-in). See ADR-0004/0014.

- **progress.json** — a git-ignored, agent-writable state file
  (`{ progress: { <lesson-key>: { status, note } } }`), keyed by numeric id for core
  lessons and by version string for release lessons. The bridge between the filesystem
  (where the agent writes) and the course page (which polls it for status and notes).
  See ADR-0004/0015.

- **course page** — `index.html`, the single served entry page of the course: unified
  sidebar (core + release lessons, continuous display numbering), live status from
  `progress.json`, lesson pane with auto-reload, read-only note panel, deepen buttons.
  Read-only on progress — the agent at the gate is the only writer. _Avoid:_ "progress
  tracker", "course shell", "dashboard" (the standalone localStorage tracker and the
  separate `course.html` shell were retired). See ADR-0013/0015.

- **recap** — a per-major review page in `lessons/` (`recap-12x.html`,
  `recap-13x.html`), listed in the course page's side section. Not a course step:
  untracked in `progress.json`, never counted in completion. `recap-13x` is owned by
  the lesson lifecycle gate — opt-in per 13.x lesson, created on first accept with a
  backfill from the learning records, then grown hybrid (map row + interleaved quiz
  questions + filo rosso rewritten only on pattern change). `recap-12x` is frozen.
  _Avoid:_ "summary lesson", treating a recap as a lesson. See ADR-0014.

- **/lesson-update** — the skill that discovers Laravel releases newer than the ones the
  existing lessons cover and, on the learner's approval, generates a lesson for each
  worthwhile one. Distinct from `/lesson-init` (one-shot setup) and `/teach` (runs lessons).
  See ADR-0005.

- **release (as unit)** — the unit of discovery, of state, and of output for
  `/lesson-update`: one Laravel version → one lesson file aggregating that release's changes,
  named by version. Dedup keys on the **version number**, never on a feature name (names
  drift across sources). _Avoid:_ "(version, feature)" as a key, "topic matching". See
  ADR-0005.

- **editorial filter sources** — the blogs `/lesson-update` discovers releases from, declared in
  `lesson_sources` (the single source of truth; the skill hardcodes no URLs). Discovery queries
  them **all and unions** the result: a release worth a lesson is one *any* source covered; a
  release none covers is skipped silently (accepted limitation — the gap is the filter). Each
  source has one **transport** (how it's read — `telegram`, `web`) plus an optional `fallback_url`
  backstop. _Avoid:_ a "fallback chain" that stops at the first source; treating these as a
  complete release index; calling `fallback_url` a transport. See ADR-0005/0010/0011.

- **changelog cross-check** — the Laravel changelog used by `/lesson-update` to confirm
  version numbers and ordering and to enrich detail, but **not** as an independent discovery
  source: it never surfaces a release on its own. See ADR-0005.

- **laravel_version_scanned** — `/lesson-update` state: the highest version already examined on
  the sources. The "how far I've looked" cursor; "new" means `> scanned`. Source of truth, not
  derivable. See ADR-0006.

- **laravel_version_covered** — `/lesson-update` state: the highest version that became a
  lesson. A convenience **mirror** (derivable from the `origin: local` files), kept explicit as a
  README anchor — _not_ a source of truth. _Avoid:_ treating it as authoritative state. See ADR-0006.

- **lessons_skipped** — `/lesson-update` state: the set of versions the learner saw and declined,
  so they are not re-proposed. "Declined" is not derivable from a version number. See ADR-0006.

- **origin: local** — frontmatter on a `/lesson-update`-generated lesson marking "the learner
  generated this" vs an upstream lesson. With `version:`, it drives collision detection (by
  version, default **keep-both**; merge only on explicit opt-in). Generated lessons only — the 12
  existing lessons are not retrofitted. See ADR-0006.

- **background discovery sub-agent** — the read-only sub-agent `/lesson-update` spawns from the
  lesson lifecycle gate (ADR-0004) on lesson completion: it scrapes the sources and returns
  candidate releases (may update `scanned`/`last_checked`), but **never** generates lessons,
  advances `covered`, or makes drafts. Background discovers and proposes; the foreground decides
  and generates. See ADR-0007.
