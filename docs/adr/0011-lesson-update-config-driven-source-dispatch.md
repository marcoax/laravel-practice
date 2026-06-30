# ADR-0011 — /lesson-update: config-driven source dispatch (union over `lesson_sources`)

**Status:** Accepted (2026-06-30) — *extends [ADR-0010](0010-lesson-update-telegram-transport.md)
(structured source list) and resolves an ambiguity in [ADR-0005](0005-lesson-update-discovery-model.md)
(fallback chain vs. "either source").*

## Context

ADR-0005 made the **Laravel release version** the unit of discovery and the **blogs the editorial
filter**; ADR-0010 turned `lesson_sources` into a **structured list** (`name` / `transport` / `feed`
/ `fallback_url`) so Laravel News' Telegram feed and URL-probe could belong to one source. The
learner's `learning-config.md` carries that list.

Three problems surfaced once the config and the skill were read side by side:

1. **Two sources of truth.** `lesson-update/SKILL.md` *loaded* `lesson_sources` but then **restated
   the concrete sources and URLs by hand** in its discovery step (`t.me/s/laravelnews`,
   `laravel-news.com/laravel-13-{minor}-0`, "Laravel Daily"). Editing `learning-config.md` would not
   change the skill's behaviour — the prose was authoritative, the config decorative.

2. **A vocabulary split that guarantees drift.** ADR-0010's prose called Laravel News' two read paths
   *"two transports,"* but the schema models a source as **one `transport` + optional `fallback_url`.*
   "URL-probe" was a `fallback_url` field and a "transport" at once — the same thing under two names.

3. **The `web` transport had no behaviour.** laraveldaily is `transport: web`, `feed:` a homepage. The
   skill said only "tried after Laravel News," with **no algorithm** for extracting a release from it.

A fourth, latent issue: ADR-0005's Decision says *both* "fallback chain (laravel-news → Laravel Daily)"
*and* "a release worth a lesson is one that **either** blog wrote about." A loop over sources cannot
honour both — a fallback chain that stops at the first hit **misses** a release only the second source
mentioned.

## Decision

**`lesson_sources` is the single source of truth; the skill holds only per-`transport` behaviour and
iterates the list.** The seam: **config owns the *what*** (which sources, URLs, order), **the skill
owns the *how*** (how to read each transport). The skill hardcodes no source names or URLs.

- **Union, not fallback chain.** Discovery queries **every** entry in `lesson_sources` and **unions**
  the versions they yield; a release counts if *any* source wrote about it. This honours ADR-0005's
  "either source" rule and discards its conflicting "fallback chain / stop at first hit" wording. Cost:
  one extra fetch when an earlier source already found releases — accepted, to never miss a
  source-specific release. (Per-source unreachability still degrades gracefully: a source that errors
  is skipped with a notice; the union proceeds with the rest.)

- **One `transport` per source; `fallback_url` is a field, not a transport.** A source has a single
  `transport`; `fallback_url` is a backstop *within* that transport's handler. This aligns the prose to
  the schema ADR-0010 already shipped and retires the "two transports" phrasing.

- **Transport handlers (the skill's only source-specific knowledge):**
  - **`telegram`** — read `feed` as a firehose (it republishes all posts); a post is a release when its
    article link matches `…/laravel-<major>-<minor>-0` **OR** its title matches `Laravel X.Y`
    (link-OR-title); take version + date from the post. Paginate `?before=<id>` back to a post older
    than `last_checked`, capped at ~5 pages. On feed failure, probe `fallback_url` (interpolate
    `{minor}`), tolerating 404 gaps. *(Unchanged from ADR-0010, restated as a handler.)*
  - **`web`** — fetch `feed` and scan its anchor links + headings with the **same link-OR-title
    matcher**; take version + date from the matched post. Best-effort: yielding nothing is not an error.
  - **unknown `transport`** — skip with a notice and continue.

## Consequences

- Adding, reordering, or retargeting a source is now a **one-file edit** to `learning-config.md`; the
  skill needs no change unless a genuinely new `transport` kind is introduced (which needs a new
  handler — the deliberate extension point).
- The ADR-0005/0010 documents are reconciled: ADR-0005 gains an amendment note (fallback → union),
  ADR-0010's "two transports" framing is superseded by "one transport + `fallback_url`."
- **Known limitation (deferred):** `fallback_url` bakes the **major** version into its template
  (`laravel-13-{minor}-0`). Only `{minor}` is interpolated, so when Laravel **14** ships the probe URL
  is silently wrong until the learner edits `learning-config.md`. The major version is config-authored,
  not derived — the skill cannot fix it. Acceptable because the probe is only a backstop to the
  Telegram feed, which carries the real version in each post.
- **Known limitation (inherited):** a `web` source like laraveldaily publishes mostly tutorials, not
  release posts, so its `web` handler may rarely match. That is fine — it contributes to the union when
  it does, and "the gap is the filter" (ADR-0005) still holds.
