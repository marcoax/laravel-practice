# ADR-0013 — Course shell over a local server; prompt-prefill as the deepen channel

**Status:** Accepted (2026-07-02)

## Context

Lessons are opened as static `file://` HTML and the tracker (`index.html`) is a separate
page. Issue #27 asks for an interactive local-server course shell: a sidebar showing the
index (lessons + done/todo status) next to the rendered lesson, and "approfondisci questo
tema" buttons at the bottom of a lesson that make the agent regenerate/patch the page.

The building blocks already exist: `index.html` holds the `LESSONS` array, renders
status, and polls `progress.json` with `fetch(..., {cache:"no-store"})` (ADR-0004) — a
working precedent for a browser ↔ file channel. The hard part is the reverse direction:
a static page cannot call Claude Code, so "click → agent updates the page" needs a
trigger channel. Options considered (issue #27, cheapest → richest):

1. **Prompt-prefill** — the button prepares a ready-made prompt the learner pastes into
   the running Claude Code session; the agent edits the lesson HTML; the shell reloads it.
2. **File-drop polling** — a tiny local sink accepts `POST /deepen` and appends to
   `requests.jsonl`; an agent in a `/loop` watches the file and patches the lesson.
3. **claude-in-chrome bridge** — the agent drives the tab; still needs 1 or 2 as trigger.
4. **WebSocket dev server** — fully live, but a long-running tool process conflicts with
   the repo's **no build step** principle.

## Decision

Two independent pieces, both buildless:

- **Course shell (`course.html`).** A standalone page served over `http://` — e.g.
  `php -S localhost:8000` (matches the Laravel learner; `python3 -m http.server 8000`
  works identically). Sidebar = the same `LESSONS` data + done/todo status, kept live by
  re-polling `progress.json` every few seconds; main pane = the lesson loaded in an
  `<iframe>`, so each lesson page stays a self-contained, print-friendly document
  (printing happens from the lesson page itself, unchanged). The shell also polls the
  active lesson's content (a plain re-fetch compared to the last snapshot — `php -S`
  sends no freshness headers for static files, so `Last-Modified` is not usable) and
  reloads the iframe when the agent rewrites the file — the "browser reflects the
  agent's edit" half of the loop, for free.
  `course.html` **extends** `index.html`, it does not replace it: the tracker remains the
  place to flip status and take notes; the shell is read-only on progress.

- **Deepen channel = Option 1, prompt-prefill.** A reusable widget
  (`assets/deepen.js` + `.deepen` styles in `assets/lesson.css`, same philosophy as the
  MCQ widget of ADR-0012) turns declarative buttons into one-click prompt producers:

  ```html
  <div class="deepen" data-msg-copied="…" data-msg-manual="…">
    <p class="deepen-lead">Approfondisci questo tema:</p>
    <button type="button" class="deepen-btn"
            data-prompt="Approfondisci nella lezione lessons/NN-….html il tema: …">
      Label
    </button>
  </div>
  ```

  Clicking copies the full prompt to the clipboard and shows it in a visible box as a
  manual-copy fallback; the learner pastes it into the Claude Code session that is
  already teaching. The agent edits the HTML, and the shell's content polling refreshes
  the page. `data-msg-*` attributes localize the feedback (default English),
  exactly like the MCQ widget. In print the whole widget is hidden.

**Options 2–4 are deferred, not rejected.** If the paste step proves to be real friction
after a few lessons, Option 2 (a one-file `php -S` router appending to `requests.jsonl`,
watched by a `/loop` agent) is the designated upgrade path: it keeps the same button
markup — only `deepen.js` would learn to `POST` instead of copy. Option 4 stays out
unless the no-build-step principle is consciously dropped (it is a core repo rule).

## Consequences

- The course gains a served, interactive reading mode with zero new tooling: one extra
  HTML file, one small JS asset, and whatever static server is already on the machine.
- `/teach-lesson` warms the shell up at lesson start (best-effort, fail-soft): probe
  `localhost:8000`, else start `php -S` / `python3 -m http.server` in the background,
  then open `course.html#<slug>` with the platform's opener. Portability comes from the
  step being agent instructions, not a script: the agent picks whatever server and
  opener the machine has, and skips the shell entirely when there is none.
- The `LESSONS` array now lives in two pages (`index.html`, `course.html`). Acceptable
  for a spike; if it drifts, extract it to `assets/lessons-data.js` shared by both.
- The deepen loop has a human hop (paste) by design — it validates the UX before any
  infrastructure is built, and it degrades to nothing worse than today's `<p class="ask">`
  invitation when no agent session is running.
- Lessons that opt in add one `<script src="../assets/deepen.js" defer>` tag; without
  JS or on paper the buttons vanish and the lesson is unchanged. First user: lesson 05.
