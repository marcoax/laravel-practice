    # learning-config (example / schema)

Per-user setup for how you approach the lessons. Copy this file to
**`learning-config.md`** (git-ignored) and edit the values — or just run **`/lesson-init`**,
which writes it for you. When `learning-config.md` exists, its values are authoritative
(see `CLAUDE.md` → *Config binding* and ADR-0001/0003); when it is absent, the agent
suggests running `/lesson-init`.

The values live in the YAML block below. Everything outside it is documentation.

```yaml
# --- Essentials ---

# Output style / interaction mode. "Learning" = Learn by Doing (scaffold + TODO(human)).
# Enforced via .claude/settings.local.json (git-ignored), not this file. Default: Learning.
output_style: Learning

# The real codebase you assess each lesson against ("does my project need this?").
# An absolute path. Required. To practice without a real project, leave a placeholder
# here and set practice_default: concepts-only.
reference_project: /absolute/path/to/your/project

# Advisory only — a file cannot force the CLI's model; this records the recommendation.
# Default: claude-opus-4-8 (+ Fast mode) for nuanced teaching and code-safety reasoning.
model: claude-opus-4-8

# Language split. chat = conversation + HTML lessons (learner-facing); docs = project MD.
# chat choices: en (default) | it | fr | de | es. docs stays en.
language:
  chat: en
  docs: en

# --- Pedagogy ---

# Where you practice by default: concepts-only | throwaway-app | reference-project.
practice_default: concepts-only

# Reinforcement format: recall (open question -> accordion answer) | multiple-choice.
quiz_format: recall

# Offer the optional "want to go deeper on a question?" invitation at lesson end.
deep_dive: on

# How per-lesson work is isolated, if at all. Free text; the branch-name pattern.
# Consulted only when auto_branch is on.
branch_convention: "one branch per lesson, e.g. lesson-NN-<slug>"

# Whether each lesson opens a fresh branch cut from auto_branch_base (named via
# branch_convention). on | off. /lesson-init only records this; /teach actually cuts
# the branch at lesson start. Consulted only when on.
auto_branch: off

# Base branch the per-lesson branch is cut from. Consulted only when auto_branch is on.
auto_branch_base: main

# --- Lesson updates (/lesson-update) ---

# Editorial discovery sources, in fallback order: a release is lesson-worthy if
# *either* source wrote about it — Laravel News (primary) → Laravel Daily (fallback).
# These sources both discover and editorially filter releases (ADR-0005).
# Structured entries (ADR-0010): Laravel News has ONE editorial identity but TWO read
# transports — the Telegram feed (primary) and a URL-pattern probe (fallback used only
# when the feed is unreachable). Discovery (ADR-0007 sub-agent) walks this list top to
# bottom, and within Laravel News tries `transport`/`feed` first, then `fallback_url`.
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
