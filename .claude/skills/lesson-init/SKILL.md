---
name: lesson-init
description: One-shot setup for this Laravel 12→13 learning workspace. Interviews the learner one question at a time (each with a recommended default) and writes their per-user learning-config.md plus the local output-style override. Run once per fork; distinct from /teach.
disable-model-invocation: true
argument-hint: "(no arguments — it interviews you)"
---

The user wants to set up this teaching workspace. `/lesson-init` is a **one-shot bootstrap**,
run once per fork, distinct from `/teach` (which runs the lessons). Your job is to interview
the learner, then write two files:

1. **`learning-config.md`** at the repo root — the per-user, git-ignored config that every
   later session treats as authoritative (see `CLAUDE.md` → *Config binding*, ADR-0001/0003).
2. **`.claude/settings.local.json`** — the git-ignored, higher-precedence settings file that
   actually *enforces* the chosen output style.

Read `learning-config.example.md` (the tracked schema) and `CONTEXT.md` before you start, so
your output matches the canonical field names and the repo's vocabulary.

## Step 1 — Detect first-run vs re-run

Before asking anything, check whether `learning-config.md` already exists at the repo root.

- **Absent** → first run. You will create it from `learning-config.example.md`.
- **Present** → re-run / update. Read it and parse the current YAML values; use them as the
  pre-filled defaults in the interview. See *Re-running* below for the reconciliation rule.

## Step 2 — Interview, one question at a time

Ask **one question per turn** using the `AskUserQuestion` tool. Every question ships a
**recommended default as the first option, labelled "(recommended)"**, so the learner can
accept the whole setup quickly. Ask the `language` question (#4) **first of all**, then
phrase every subsequent question in the learner's chosen `chat` language; keep the YAML
field names in English. On a re-run, the recommended default is the learner's *current*
value, not the template default.

Ask `language` first (it sets the language for the rest of the interview), then the other
essentials, then the pedagogy fields:

| # | Field | Recommended default | Notes / options |
|---|-------|---------------------|-----------------|
| 1 | `language` | `chat: en`, `docs: en` | Ask first. `chat` = conversation + HTML lessons (learner-facing); `docs` = project Markdown. Offer for `chat`: **English (recommended)**, Italian, French, German, Spanish. `docs` defaults to English. |
| 2 | `output_style` | `Learning` | **Learning** = Learn by Doing (scaffold + `TODO(human)`, recommended). Other choices: `Explanatory` (teaches while writing — full code plus didactic notes) or `default` (concise, no pedagogy). Written to `settings.local.json`, **not** to `learning-config.md`, as the enforcement point. |
| 3 | `reference_project` | *(no default — ask)* | Absolute path to the real codebase assessed each lesson. If they have none, store a placeholder and steer `practice_default` to `concepts-only`. |
| 4 | `model` | `claude-opus-4-8` (+ Fast mode) | **Advisory only** — a file can't force the CLI model. Just record it. |
| 5 | `practice_default` | `concepts-only` | `concepts-only` \| `throwaway-app` \| `reference-project`. |
| 6 | `quiz_format` | `recall` | `recall` (open question → accordion answer) \| `multiple-choice`. |
| 7 | `deep_dive` | `on` | Offer the optional "want to go deeper?" invite at lesson end. `on` \| `off`. |
| 8 | `branch_convention` | `one branch per lesson, e.g. lesson-NN-<slug>` | Free text; how per-lesson work is isolated. |

## Step 3 — Write `learning-config.md`

Render the answers into the YAML block, preserving the structure and the explanatory
comments from `learning-config.example.md` (the file is documentation outside the block,
YAML inside). Keep the `# --- Essentials ---` / `# --- Pedagogy ---` sections.

## Step 4 — Write the output style to `.claude/settings.local.json`

This file is git-ignored and already exists with a `permissions` block. You **must merge**,
never overwrite: read the current JSON, set the top-level `"outputStyle"` key to the chosen
value, and preserve every other key (especially `permissions`). The tracked
`.claude/settings.json` stays neutral (`{}`) — do not write the style there.

`model` is **not** enforced anywhere; it lives only in `learning-config.md` as advice.

## Re-running (update mode)

When `learning-config.md` already exists, you must reconcile the new answers with the
existing learner state rather than blindly overwriting it (acceptance criterion in issue #4,
ADR-0002). Decide and document the exact reconciliation strategy here.

1. **Pre-fill, don't reset.** Parse the current `learning-config.md` YAML and use each
   stored value as that question's recommended default (first option, "(recommended)").
   The learner re-confirms or overrides each field; accepting the default is a no-op.
2. **Write back the full file, but only with confirmed values.** Every field keeps its
   existing value unless the learner explicitly changes it — no field is dropped or blanked
   just because it wasn't touched.
3. **Respect hand-edits.** If a stored value differs from the template default, assume it
   was set deliberately (by `/lesson-init` or by hand) and preserve it; never silently
   replace a non-default value with the template default.
4. **Surface conflicts, don't guess.** If `learning-config.md` is malformed or a value is
   unparseable, show the learner what you found and ask before overwriting that field.

## Step 5 — Confirm and hand off

Summarise the written config back to the learner (in their chosen `chat` language), confirm the output style is
active via `settings.local.json`, and point them to `/teach` to start lesson 01. Do **not**
run a lesson here — `/lesson-init` only bootstraps.
