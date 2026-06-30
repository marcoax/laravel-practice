# ADR-0005 — /lesson-update discovery model: version as unit, blogs as editorial filter

**Status:** Accepted (2026-06-29) — *read transport amended by [ADR-0010](0010-lesson-update-telegram-transport.md): Laravel News is now read primarily via its Telegram feed, with the URL-pattern probe demoted to fallback. The editorial model below is unchanged.*

## Context

`/lesson-update` (spec in draft) discovers Laravel releases newer than the ones the 12
existing lessons cover, and turns the worthwhile ones into new lesson files. The draft spec
asserted the discriminator is the **Laravel version number, not topic matching** — "much more
reliable." Stress-testing that claim against the actual repo surfaced three tensions that this
ADR resolves.

1. **The existing lessons are not 1:1 with versions.** A lesson can span a range
   (`04` = 12.40·12.41; `07` = 13.0→13.8) and a single release fans out into many lessons
   (13.0 → lessons `06`, `08`, `10`, `11`, `12`). So the natural unit looked like the pair
   *(version, feature)*, and a single `laravel_version_covered` field cannot express
   "13.0 half-covered."

2. **Feature names are not stable across sources.** Each source names the same change
   differently, so keying dedup on a feature name is fragile. The *version number* is the only
   stable identifier — confirmed by the learner.

3. **Blogs are not a release index, and they have gaps.** `laravel-news.com/laravel-13-N-0`
   exists for some minors but not all — `laravel-13-11-0` is a real HTTP 404 while
   `13-12-0`…`13-17-0` exist. A single release post lists *many* changes (13.17.0 lists 7).

## Decision

**The unit of discovery, of state, and of output is the Laravel release version — they all
coincide.** This dissolves tension #1 and #2: we never key on a feature name at all.

- **One lesson file per release.** A release becomes a single lesson that *aggregates* the
  changes that release shipped, named by version (e.g. `13.17-…`, version-pure, full patch
  level tracked in state). This deliberately breaks the progressive `01/02/03…` aesthetic; the
  version prefix is what makes an upstream collision *visible and expected*.

- **Blogs are the editorial filter and the discovery source**, as a fallback chain:
  **laravel-news (primary) → Laravel Daily (fallback).** A release worth a lesson is one that
  *either* blog wrote about. Discovery reads each blog's release index (fallback: probe the
  predictable `laravel-13-N-0` URL pattern, tolerating 404 gaps).

- **The Laravel changelog is a cross-check, not an independent discovery source.** It confirms
  version numbers and ordering and enriches detail, but does **not** by itself surface a
  release. (We considered making the changelog authoritative — complete, no gaps — but chose
  the blogs' editorial curation instead: see below.)

- **Accepted limitation — the gap is the filter.** A release covered by *neither* blog is
  skipped silently and never becomes a lesson, even if the changelog lists it. For a teaching
  repo this is a feature: we only want material an editor already judged lesson-worthy. The
  cost — a real change the blogs ignore is invisible to `/lesson-update` — is accepted.

- **A human makes the final call.** The spec's "propose one at a time → accept/skip" step
  absorbs the residual unreliability (two blogs naming the same change differently, a thin
  release): the machine buckets by version, the learner deduplicates semantically.

## Consequences

- State in `learning-config.md` keys cleanly on a single version string per release; the
  feature-name dedup problem disappears.
- `lesson_sources` splits into roles: editorial/discovery blogs (laravel-news, Laravel Daily)
  + a changelog cross-check source. The exact field shape is settled in a later ADR.
- Generated lesson filenames are version-prefixed, diverging from the tracked `NN-` lessons.
  Collision handling with upstream lessons is settled in a later ADR.
- Discovery makes network calls whose reliability depends on the blogs being reachable; an
  unreachable source is skipped with a notice, execution continues (per the spec).
