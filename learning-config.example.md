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
language:
  chat: it
  docs: en

# --- Pedagogy ---

# Where you practice by default: concepts-only | throwaway-app | reference-project.
practice_default: concepts-only

# Reinforcement format: recall (open question -> accordion answer) | multiple-choice.
quiz_format: recall

# Offer the optional "want to go deeper on a question?" invitation at lesson end.
deep_dive: on

# How per-lesson work is isolated, if at all. Free text; e.g. a branch-name pattern.
branch_convention: "one branch per lesson, e.g. lesson-NN-<slug>"
```
