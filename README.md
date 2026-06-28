# Laravel 12 → 13: Learn by Doing

A hands-on path through what changed in Laravel **from 12.x to 13.x**, one lesson
at a time, oldest first. No endless changelog: only the changes that affect *how*
you build — new features, security, breaking changes. Bug fixes and dependency
bumps stay out.

**46 releases → 12 lessons.**

👉 Open the **[progress tracker](./index.html)** to follow where you are.

## Getting started

1. **Get the lessons.** Clone or download this repo:
   ```bash
   git clone https://github.com/<your-username>/<repo-name>.git
   cd <repo-name>
   ```
   (or download the ZIP from the green **Code** button on GitHub).

2. **Install the `teach` skill.** The recommended way to run a lesson is the
   `teach` skill from Matt Pocock's collection — it teaches a concept over multiple
   sessions using the current directory as a stateful workspace, which is exactly
   what these lessons need. Install it with the [skills.sh](https://skills.sh)
   installer and select `teach` (works with Claude Code, Codex and other agents):
   ```bash
   npx skills@latest add mattpocock/skills
   ```
   Source: https://github.com/mattpocock/skills

3. **Configure your workspace.** Run **`/lesson-init`** once: it asks a few questions
   (reference project, language, output style, pedagogy) and writes them to a git-ignored
   `learning-config.md` that every session then reads.
   ```
   /lesson-init
   ```
   Prefer to do it by hand? Copy the schema and edit the values:
   ```bash
   cp learning-config.example.md learning-config.md
   # then set reference_project and any preferences
   ```

4. **Run a lesson.** Open your agent in this repo and point `/teach` at a lesson,
   oldest first:
   ```
   /teach lessons/01-eloquent-casts.md
   ```
   At the start of each lesson you choose how to practice: on a **throwaway app**
   (`laravel new practice-app`) or on **your own project**.

> Prefer not to use `/teach`? Every lesson is a self-contained brief you can follow
> with any AI assistant — or by hand.

### Learn by Doing mode (recommended)

These lessons work best with Claude Code's **Learning** output style active. With it,
the agent doesn't hand you finished code: for every meaningful design decision it sets
up the scaffolding and asks **you** to write the key 2–10 lines (a `TODO(human)` block),
then gives feedback. That's the "understanding beats delegating" philosophy in practice.

It is a separate setting from `/teach`: `/teach` decides *what* you learn; the Learning
output style decides *how* you interact. Picking it is part of `/lesson-init`, which writes
your choice to the git-ignored
[`.claude/settings.local.json`](./.claude/settings.local.json) — so it stays per-user,
while the tracked `settings.json` ships neutral:

```json
{ "outputStyle": "Learning" }
```

To change it later, run `/output-style` and pick `Learning` (or `default` to have the
agent write the code for you). Other agents: replicate the behaviour by asking them to
scaffold and leave the key decision to you.

## How it works

- The **12 lessons** live in [`/lessons`](./lessons), numbered chronologically.
- Each lesson is a *brief*: what changed, why it might matter, what to try, and a
  few questions to judge whether it's relevant **to your project**.
- You can **use the provided lessons** or **write your own** starting from
  [`lessons/_template.md`](./lessons/_template.md).

## Philosophy

Understanding beats delegating. AI is great for learning interactively and for
repetitive work, but the design decisions stay yours. For every new feature the
question isn't "does it exist?" but "**does my project need it?**" — and sometimes
the right answer is a deliberate "no".

Where useful, each lesson shows how the change was assessed for a **real reference
project** — the one you pick at setup (`/lesson-init`) — as a concrete example, not as
absolute truth.

## Tracking your progress

The tracker (`index.html`) saves automatically to your browser (`localStorage`).
It also has **Export / Import**: download your progress as a `.json` file for
backup, to move between devices, or to commit into your own fork.

## Publishing the tracker (GitHub Pages)

If you fork this and want the tracker live:

1. Push your copy to GitHub.
2. *Settings → Pages → Source: Deploy from a branch → `main` / root*.
3. The tracker will be at `https://<your-username>.github.io/<repo-name>/`.

## Sources

Lessons are based on [Laravel News](https://laravel-news.com) and
[Laravel Daily](https://laraveldaily.com). Each brief links its specific source.
The `teach` skill is by [Matt Pocock](https://github.com/mattpocock/skills).

## License

MIT — see [LICENSE](./LICENSE). Contributions and new lessons welcome.
