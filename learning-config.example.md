    # learning-config (example / schema)

Per-user setup for how you approach the lessons. Copy this file to
**`learning-config.md`** (git-ignored) and edit the values — or just run **`/lesson-init`**,
which writes it for you. When `learning-config.md` exists, its values are authoritative
(see `CLAUDE.md` → *Config binding* and ADR-0001/0003); when it is absent, the agent
suggests running `/lesson-init`.

The values live in the YAML block below. Everything outside it is documentation.

```yaml
# --- Essentials ---

# Output style / interaction mode for lessons. "Learning" = Learn by Doing (scaffold +
# TODO(human)). Applied by /lesson (via /teach) for the duration of a lesson session only
# (ADR-0020); outside lessons nothing is imposed and no settings file is written.
output_style: Learning

# The real codebase you assess each lesson against ("does my project need this?").
# An absolute path. Required. To practice without a real project, leave a placeholder
# here and set practice_default: concepts-only.
reference_project: /absolute/path/to/your/project

# Advisory only — a file cannot force the CLI's model; this records the recommendation.
# Set by /lesson-init to a model suggested by the agent running the interview
# (its own session model / family). Left null here; the real value comes from setup.
model: null

# Language split. chat = conversation + HTML lessons (learner-facing); docs = project MD.
# chat choices: en (default) | it | fr | de | es. docs stays en.
language:
  chat: en
  docs: en

# Laravel major version the learner already knows. Static choices for this authored
# Laravel 12 -> 13 path: 12 keeps the full path visible; 13 starts at Laravel 13 and
# hides 12.x material from learner-facing course flow. Optional: when the field is
# absent every reader (index.html, lesson, verify scripts) falls back to 12,
# so omitting it is equivalent to declaring 12. Chosen at /lesson-init.
course_baseline_major: 12

# --- Pedagogy ---

# Where you practice by default: concepts-only | throwaway-app | reference-project.
practice_default: concepts-only

# Reinforcement format: recall (open question -> accordion answer) | multiple-choice.
quiz_format: recall

# Offer the optional "want to go deeper on a question?" invitation at lesson end.
deep_dive: on

# How generated-brief work is isolated, if at all. Free text; the branch-name pattern.
# Consulted only by /lesson-update, and only when auto_branch is on (ADR-0017).
branch_convention: "one branch per generated brief, e.g. lesson-<x.y.z>-<slug>"

# Whether /lesson-update opens a fresh branch cut from auto_branch_base (named via
# branch_convention) for each generated brief. on | off. Consulted ONLY by
# /lesson-update — lesson sessions never cut branches: all their output is
# git-ignored, so a per-lesson branch would be guaranteed empty (ADR-0017).
auto_branch: on

# Base branch the per-brief branch is cut from. Consulted only by /lesson-update,
# and only when auto_branch is on.
auto_branch_base: main

# --- Lesson updates (/lesson-update) ---

# Editorial discovery sources — the single source of truth for which sources /lesson-update
# reads, their URLs, and order. A release is lesson-worthy if *any* source wrote about it:
# discovery queries them ALL and unions the result (ADR-0011, resolving ADR-0005). These
# sources both discover and editorially filter releases (ADR-0005).
# Structured entries (ADR-0010/0011): each source has ONE `transport` plus an optional
# `fallback_url` (a backstop for that handler, NOT a second transport). Laravel News is read
# via its Telegram `feed`, falling back to the URL-probe `fallback_url` only when the feed is
# down. The skill iterates this list and dispatches on `transport` — it hardcodes no URLs.
lesson_sources:
  - name: laravel-news
    transport: telegram                                          # primary read path (ADR-0010)
    feed: https://t.me/s/laravelnews                             # public, auth-free preview endpoint
    fallback_url: https://laravel-news.com/laravel-13-{minor}-0  # URL probe, only when the feed is down
  - name: laraveldaily
    transport: web
    feed: https://laraveldaily.com                              # broader editorial fallback

# Changelog cross-check only: confirms version numbers/ordering and enriches detail,
# but never surfaces a release on its own (ADR-0005). The Laravel framework repo.
lesson_changelog: laravel/framework   # GitHub repo; CHANGELOG.md

# High-water cursor: the highest version already examined on the sources. Defines
# "new = > scanned". Not derivable — the source of truth for how far we've looked.
laravel_version_scanned: "13.8"

# Mirror of the highest version that became a lesson (derivable from the origin: local
# files in lessons/). Kept explicit as a convenience anchor for the README (ADR-0006).
laravel_version_covered: "13.8"

# Versions the learner saw and declined; never re-proposed. Not derivable. Default [].
lessons_skipped: []

# Auto-fire the background discovery check at lesson completion (ADR-0007).
# on | off. Proposed during /lesson-init; off → nothing fires.
auto_check_new_lessons: on

# Date of the last discovery check (ISO 8601, e.g. 2026-06-29), or null if never run.
last_checked: null
```
