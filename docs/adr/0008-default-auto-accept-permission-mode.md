# ADR-0008 — Default to auto-accept (acceptEdits) permission mode, per-user

**Status:** Accepted (2026-06-30)

## Context

Claude Code normally opens in **plan mode**, which blocks edits until a plan is
approved. For this teaching workspace that is pure friction: a `/teach` session
legitimately writes lessons (`lessons/NN-*.html`), learning records
(`learning-records/`), and `progress.json` on every run. Per-edit approval prompts
interrupt the lesson flow without adding safety in a content-only repo (no runnable
app, no `composer.json`/`artisan`).

Claude Code exposes the default via `permissions.defaultMode`. The authoritative
key/values come from the settings JSON schema
(`https://www.schemastore.org/claude-code-settings.json`): allowed values include
`default`, `acceptEdits`, `plan`, `bypassPermissions`, and `auto`. The well-established
auto-accept-edits mode is **`acceptEdits`** (it auto-applies file edits while still
prompting for riskier actions), which is what we want — not the broader
`bypassPermissions`.

## Decision

- Set **`permissions.defaultMode: "acceptEdits"`** so the workspace opens in
  auto-accept mode with no manual per-session toggle.
- **Scope: git-ignored `.claude/settings.local.json`** (per-user), *not* the tracked
  `.claude/settings.json`. This is consistent with ADR-0003: the tracked settings file
  stays **neutral** (the public template forces no per-user behaviour), and per-user
  choices — output style, now also the permission mode — live in the git-ignored local
  file that takes precedence.

## Consequences

- For this user, opening the workspace defaults to auto-accept; edits auto-apply.
- Forks/contributors do **not** inherit it (the file is git-ignored). To opt in, add
  `"permissions": { "defaultMode": "acceptEdits" }` to their own
  `.claude/settings.local.json`. `/lesson-init` is the natural place to offer writing it.
- The public template remains neutral; ADR-0003's stance is preserved.
