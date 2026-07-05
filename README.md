# Laravel Practice

Laravel Practice is a hands-on path through what changed in Laravel **from 12.x
to 13.x**, one lesson at a time, oldest first. No endless changelog: only the
changes that affect *how* you build — new features, security, breaking changes.
Bug fixes and dependency bumps stay out.

**The course ships a core sequence of authored lessons, and grows on request:
`/lesson-update` turns newer Laravel releases into new lessons whenever you ask.**

👉 Serve the repo root and open the **[course page](./index.html)** to follow where you are.

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
   (reference project, language, output style, course baseline, pedagogy) and writes them
   to a git-ignored `learning-config.md` that every session then reads.
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
output style decides *how* you interact. The tracked `.claude/settings.json` ships the
recommended shared default:

```json
{ "outputStyle": "Learning" }
```

Picking a different style in `/lesson-init` writes your choice to the git-ignored
[`.claude/settings.local.json`](./.claude/settings.local.json), which overrides the
shared default for your machine only. To change it later, run `/output-style` and pick
`Learning` (or `default` to have the agent write the code for you). Other agents:
replicate the behaviour by asking them to scaffold and leave the key decision to you.

## How it works

- The lessons live in [`/lessons`](./lessons): the **core sequence** (`NN-*.md`, numbered
  chronologically) plus the **release lessons** generated via `/lesson-update`
  (version-named, e.g. `13.17.0.md`).
- Each lesson is a *brief*: what changed, why it might matter, what to try, and a
  few questions to judge whether it's relevant **to your project**.
- You can **use the provided lessons** or **write your own** starting from
  [`lessons/_template.md`](./lessons/_template.md).

## Staying up to date — `/lesson-update`

Laravel keeps shipping, so the course never claims to be "complete":
**`/lesson-update`** looks for releases newer than the ones already covered (tracked in
`learning-config.md`) and turns the worthwhile ones into new lessons:

1. **Discover** new releases from the editorial sources listed in `learning-config.md`
   ([Laravel News](https://laravel-news.com), [Laravel Daily](https://laraveldaily.com), …),
   querying them all. A release is lesson-worthy if *any* of the sources wrote about it.
2. **Propose one lesson per release** (named by version, e.g. `13.17.0.md`), one at a time —
   you accept or skip each.
3. **Generate** the accepted ones into [`/lessons`](./lessons), ready to run with `/teach`.

```
/lesson-update
```

You can run it manually any time. It also runs **automatically in the background when you
finish a lesson** — a read-only check that only *proposes* new lessons, never generates them
without your say-so. Toggle that with `auto_check_new_lessons` in `learning-config.md` (set
at `/lesson-init`).

## Philosophy

Understanding beats delegating. AI is great for learning interactively and for
repetitive work, but the design decisions stay yours. For every new feature the
question isn't "does it exist?" but "**does my project need it?**" — and sometimes
the right answer is a deliberate "no".

Where useful, each lesson shows how the change was assessed for a **real reference
project** — the one you pick at setup (`/lesson-init`) — as a concrete example, not as
absolute truth.

## The course page

`index.html` is the single entry page for the course (ADR-0015). Serve the repo root
and open it:

```bash
php -S localhost:8000 scripts/progress-server.php
```

then open <http://localhost:8000/>. What you get:

- **One unified lesson list** in the sidebar — the core lessons and the
  `/lesson-update`-generated release lessons, continuously numbered, with live
  done/todo status and a progress bar.
- **Baseline filtering** from `learning-config.md`: `course_baseline_major: 12` shows the
  full path, while `13` hides 12.x lessons and `recap-12x` from the active course page.
- **The rendered lesson** next to it, auto-reloading whenever the agent updates it.
- **A read-only note panel** (the `✎ note` button) showing the agent-written note —
  the verdicts and insights captured at the end of each lesson.
- **Deepen buttons** at the bottom of a lesson (ADR-0013): one click copies a
  ready-made prompt; paste it into your running Claude Code session, the agent
  patches the lesson HTML, and the page reloads by itself.

Progress lives in one store, `progress.json`, with two writers (ADR-0018): the agent
writes status and notes at the end of each lesson (the *lesson lifecycle gate*), and
you can flip a lesson todo/doing/done yourself with the segmented control in the pane
bar — the page posts it to the `scripts/progress-server.php` router. Notes stay
agent-only. Served without the router (plain `php -S` or `python3 -m http.server`),
the page still works but status clicks show a warning instead of saving.

> **Heads-up — serve it over HTTP, not `file://`.** The page loads `progress.json`
> and the lessons with `fetch()`, which browsers block when the page is opened by
> double-click (`file://`).

## Publishing the course (GitHub Pages)

If you fork this and want the course page live:

1. Push your copy to GitHub.
2. *Settings → Pages → Source: Deploy from a branch → `main` / root*.
3. The course will be at `https://<your-username>.github.io/<repo-name>/`.

## Sources

Lessons are based on [Laravel News](https://laravel-news.com) and
[Laravel Daily](https://laraveldaily.com). Each brief links its specific source.
The `teach` skill is by [Matt Pocock](https://github.com/mattpocock/skills).

## License

MIT — see [LICENSE](./LICENSE). Contributions and new lessons welcome.
