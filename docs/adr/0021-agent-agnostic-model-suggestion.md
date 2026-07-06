# ADR-0021 — Agent-agnostic model suggestion

**Status:** Accepted (2026-07-06). Amends ADR-0002 and ADR-0003 (the `model` default).

## Context

`/lesson-init` question #4 and `learning-config.example.md` hardcode
`claude-opus-4-8 (+ Fast mode)` as the recommended `model`, and
`/lesson-update` expresses its discovery sub-agent guidance in Claude model
names ("Opus/Fable", "Sonnet"). The template is meant to be neutral and
forkable, and the skills are mirrored in `.agents/skills/` for non-Claude
agents — under another agent the hardcoded suggestion is simply wrong
(issue #55).

Options considered for "suggest models based on the agent in use":

1. **Self-reference** — the skill instructs whichever agent runs the
   interview to propose its *own* session model and family. No detection.
2. **Environment detection** — sniff env vars / binary names and keep an
   agent → models mapping table. Fragile; the table is just a bigger
   hardcoding than the one being removed.
3. **Ask the learner** which agent they use — extra friction for an answer
   the agent already knows.

## Decision

- **Self-reference, no detection.** `/lesson-init` instructs the
  interviewing agent: propose the model powering the current session as the
  recommended default, and other models of its own family as alternatives.
  No env sniffing, no agent→model table.
- **Neutral seed.** `learning-config.example.md` ships `model: null` with an
  agent-neutral comment ("advisory only — set by `/lesson-init` to a model
  suggested by the agent running the interview"). The real value only ever
  comes from the interview. `model` stays advisory only (ADR-0003).
- **Re-run rule unchanged.** On re-run the stored value remains the
  recommended first option (per the ADR-0002 reconciliation rules); the
  current session's model appears as a *labelled alternative* — it never
  silently replaces a deliberate stored value.
- **Execution modes generalized.** Instead of naming Fast mode, the skill
  says: if the running agent's environment has relevant execution modes
  (e.g. fast/extended), mention them in the suggestion.
- **Model tiers generalized in `/lesson-update`.** The discovery sub-agent
  guidance is expressed in agnostic tiers — a mid-tier model of the running
  agent's family; neither the top session model nor the minimum tier —
  instead of Claude model names.

## Consequences

- Tracked template files carry no vendor model names outside historical
  ADRs; ADR-0002/0003 stay intact with an "amended by" note.
- Both skill mirrors (`.claude/skills/` and `.agents/skills/`) must be
  patched in sync.
- Existing per-user configs keep their stored model; nothing migrates.
