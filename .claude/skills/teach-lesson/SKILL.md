---
name: teach-lesson
description: Menu launcher for this repo's Laravel 12→13 lessons. A thin wrapper around /teach — it lists the lessons in lessons/, proposes the first not-yet-done one, and on the learner's choice hands off to /teach for that lesson. Read-only on progress (never marks completion). Use whenever the learner wants to start or continue the course, or asks "do lesson 3", "facciamo la lezione 3", "what's the next lesson", "qual è la prossima lezione", "resume", "riprendiamo", "continue", "show me the lessons", "mostrami le lezioni", "teach-lesson" — even without naming a specific lesson file.
argument-hint: "(optional) lesson number or slug, e.g. 3 or queue-fail-on-exception"
---

A **thin wrapper around `/teach`**. Its only job is to pick *which* lesson to run, then
delegate the whole teaching session to `/teach`.

## Non-negotiable principles

1. **Read-only on progress.** Never write completion state. Marking a lesson done belongs to
   the lesson lifecycle (`CLAUDE.md` → *Lesson lifecycle*: `progress.json` + learning record).
2. **One final action: hand off to `/teach`.** Build the menu, resolve the lesson, then
   execute `/teach` for it **in-session** — never ask the learner to type a command. Nothing else.
3. **Lessons are whatever is on disk**, never a hardcoded list.

## Flow

### 1. Collect lessons

```bash
ls lessons/[0-9]*-*.md 2>/dev/null | sort
```

Only `NN-<slug>.md` files under `lessons/`. Exclude `_template.md`, `README.md`, and the
rendered `.html`. Order by numeric prefix. If `lessons/` is missing or empty, stop and say so
— you are probably not at the repo root.

### 2. Read progress (read-only)

Completion lives in **`progress.json`** at the repo root (git-ignored). Shape:
`{ "progress": { "<id>": { "status", "note" } } }`, keyed by the numeric lesson id, where
**id N ↔ the `NN-` lesson** (id `1` → `01-*.md`). A lesson is **done** when its entry has
`"status": "done"`.

```bash
cat progress.json 2>/dev/null
```

**Fallback:** if `progress.json` is absent or unparseable → treat all lessons as to-do (first
not-done is `01`). Don't block, don't ask. Never write to `progress.json`.

### 3. First not-done

The first lesson, in numeric order, whose id is not `done`. This is the menu default.

### 4. Show the menu

Compact list: the **first not-done lesson on top** (marked as next/recommended default), then
**all lessons in numeric order** with their status. Use the learner's `language.chat` from
`learning-config.md` (default English) for the menu text.

```
Lessons — Laravel 12 → 13

▶ NEXT   03 · queue-fail-on-exception        (to do)

  01 · eloquent-casts                        ✅ done
  02 · query-builder-pipelines               ✅ done
  03 · queue-fail-on-exception               ⬜ to do  ← next
  04 · …                                     ⬜ to do

Which lesson? (default: next, 03)
```

Prefer tappable options when available (first option = next/default). Otherwise accept a
number, a slug, or "next"/Enter for the default.

### 5. Hand off to /teach

Resolve the exact path, then **run `/teach` in-session — do not ask the learner to type it.**
`/teach` carries `disable-model-invocation`, so the Skill tool can't auto-call it; instead
**read `~/.agents/skills/teach/SKILL.md` and execute its flow** for the resolved
`lessons/<NN-slug>.md`, treating this repo as the teaching workspace. From there `/teach` owns
the session (practice mode, scaffolding, `TODO(human)`, quiz).

## Optional argument

- **No argument** → menu above.
- **Number or slug** (`3`, `03`, `queue-fail-on-exception`) → skip the menu, resolve the lesson
  by its `NN-` prefix or slug, hand off directly.
  - The number is the **file prefix**, not a list position: `3` and `03` both resolve to
    `lessons/03-*.md`.
  - If that lesson is already `done`, warn once (`⚠️ Lesson 03 is already done — re-running.`)
    then hand off anyway. No extra confirmation.
  - No match → fall back to the menu.
