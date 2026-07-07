# ADR-0023 — Reference project placeholder in tracked briefs

**Status:** Accepted (2026-07-07).

## Context

ADR-0001 made the reference project a per-user choice, but the tracked lesson
briefs re-leaked it: all 17 briefs carried `_Example — eraCms:` lines with real
per-project assessments, and the `/lesson-update`-generated version-pure briefs
(13.9–13.17) went further — practical TODOs ("In eraCms, find…"), stack facts
("Vue 3 frontend"), and real counts ("~79 models"). Root cause: `/lesson-update`
reads `learning-config.md` (which names the reference project) and its
generation prompt contained **no neutrality rule**, so the agent dutifully
filled the template's neutral `_Example — (your project):` slot with the real
name. Every future release lesson would leak again.

The leak was judged a **neutrality violation, not a confidentiality breach**
(project name only — no code, credentials, or client data), so the pushed git
history stays as-is; no rewrite. The meta-mentions stay too where they are
historical record (ADR-0001 keeps the name as decision context) but were
anonymised in the living glossary (`CONTEXT.md`).

Alternatives considered for keeping briefs neutral:

1. **Generic prose** ("your project", spec's original proposal) — neutral, but
   project-specific sentences ("Does your project centralise its password
   policy…?") lose force and would need per-sentence rewriting.
2. **Placeholder token resolved at render time** — briefs keep their specific,
   actionable phrasing; the real name appears only in git-ignored output.
3. **CI blocklist with the real name hardcoded** (spec's Phase 2 regex
   `eraCms|newEra|marcoax`) — self-defeating: the guard file would itself leak
   the name into the tracked template.

## Decision

- **Token:** tracked briefs use `{{reference_project}}` wherever the learner's
  project is meant — `_Example — {{reference_project}}:_`, `In
  {{reference_project}}, find…`. The template slot in `lessons/_template.md`
  uses the token.
- **Resolution:** `/teach` resolves the token at HTML render time (the HTML is
  git-ignored) from the new explicit `reference_project_name:` field in
  `learning-config.md`, documented in `learning-config.example.md`. Not the
  basename of the `reference_project` path (fragile for paths like
  `…/client-x/backend`). No build tooling — the agent substitutes.
- **Fallback:** with no `learning-config.md` (fresh fork), the raw token is
  self-explanatory in the `.md` briefs; `/teach` already routes to
  `/lesson-init` (ADR-0003).
- **Root-cause fix:** `/lesson-update` §5 gains the generation rule — briefs
  are tracked, forkable template content: never the reference project's name,
  stack, or real counts; use the token and leave assessment slots empty.
- **Guard:** a local verify script blocks (a) the value of
  `reference_project_name` (read from the git-ignored config — never hardcoded)
  and (b) generic patterns (`\d+ models`, proper names after `_Example —`) in
  `lessons/*.md`, and positively requires the token in `_Example —` lines. In
  CI (no config) only the generic checks run. No stack-name blocklist (`Vue 3`,
  `PHPStan`): too many false positives for lessons legitimately about them.
- **Assessments are salvaged, not deleted:** the real per-project judgements in
  the existing `_Example — eraCms:` lines move to `learning-records/`
  (git-ignored — exactly where per-user data belongs, ADR-0001) before the
  slots are emptied.
- **No `lessons/STYLE.md`.** The norm lives where it acts: `_template.md`
  (executable example), the `/lesson-update` skill (generator rule), and the
  `CONTEXT.md` glossary (contract definition), with a pointer line in
  `lessons/README.md`.

## Consequences

- Briefs stay specific and actionable for every fork; neutrality no longer
  costs precision.
- The token is a contract: `/teach`, `/lesson-update`, the template, and the
  verify script all conform to it, so changing the syntax later touches all of
  them — hence this ADR.
- The full leak remains in pushed git history by explicit acceptance; anyone
  needing true confidentiality for a reference project name must treat that as
  out of scope of this template.
