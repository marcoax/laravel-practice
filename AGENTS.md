# AGENTS.md — Instructions for agents

This repository is a **Laravel 12 → 13** learning path run with the `/teach` skill. Each
lesson teaches a single change from 12.x to 13.x, assessed against the real project
**eraCms** (Laravel 13 + Vue 3).

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

See `NOTES.md` for teaching preferences and `MISSION.md` for context.
