# ADR-0010 — /lesson-update: Telegram as the primary read transport for Laravel News

**Status:** Accepted (2026-06-30)

## Context

ADR-0005 fixed the editorial model for `/lesson-update`: the **Laravel release version** is the
unit of discovery, and the **blogs are the editorial filter** — laravel-news (primary) → Laravel
Daily (fallback). It left the *transport* implicit: discovery read laravel-news by scraping its
release index and probing the predictable `laravel-news.com/laravel-13-N-0` URL pattern (tolerating
404 gaps).

That transport has friction: it parses the site's HTML, and the URL-probe is a guess at a pattern
rather than a feed. The learner is already subscribed to Laravel News' public, read-only Telegram
channel, which republishes every Laravel News post with title, canonical article link, and
publication date — structured data, no login, no Bot API, readable over plain HTTP at the public
preview endpoint `https://t.me/s/laravelnews`.

The question this ADR settles: should `/lesson-update` read Laravel News via Telegram, and if so,
how does that sit with ADR-0005?

## Decision

**Telegram becomes the *primary read transport* for the Laravel News source — not a new source.**
ADR-0005's editorial model is unchanged: Laravel News is still the primary editorial source, Laravel
Daily still the fallback, the changelog still cross-check only, and "the gap is the filter" still
holds (a release no editorial source wrote about is still invisible). Only *how we read Laravel
News* changes.

- **Read path for Laravel News (in order):**
  1. **Telegram feed** `https://t.me/s/laravelnews` (primary).
  2. **URL-pattern probe** `https://laravel-news.com/laravel-13-{minor}-0` (fallback, used only when
     the feed is unreachable) — the same mechanism ADR-0005 described, demoted to fallback.
  3. **Laravel Daily** (the broader editorial fallback from ADR-0005) — unchanged.

- **The Telegram feed is a firehose, not a release index.** The channel republishes *all* Laravel
  News posts (articles, packages, tutorials), not only release announcements. A post is treated as a
  release announcement when **its article link matches `laravel-news.com/laravel-13-N-0` OR its title
  matches `Laravel X.Y`** (link-OR-title). Non-matching posts are ignored.

- **Version + date come from the post, not from a probe.** Each post carries the canonical article
  link and publication date, so the version string and date are extracted directly — more reliable
  than guessing URLs. The changelog cross-check (ADR-0005) still confirms the exact patch level.

- **Backward pagination has a bounded stop.** The feed paginates by message id (`?before=<id>`).
  Discovery walks back until it reaches a post **older than `last_checked`**, with a **safety cap of
  ~5 pages** — whichever comes first. **Edge case:** on the first run `last_checked` is `null`, so
  there is no date anchor; the page cap is then the only stop.

- **Config shape: a structured `lesson_sources` entry.** Laravel News is one editorial source with
  two transports (Telegram primary → URL probe fallback); Laravel Daily is a separate source. A flat
  list cannot express "this feed and this probe URL belong to the same source," so the entry becomes
  structured (`name` / `transport` / `feed` / `fallback_url`). See ADR-0006 for the surrounding state
  fields, which are unchanged.

## Consequences

- No more HTML scraping of laravel-news.com on the happy path; the read is a structured, auth-free
  feed. The site is touched only via the fallback probe.
- Discovery gains a **filtering step** (firehose → release announcements) it did not need when probing
  a targeted URL pattern. This is the one genuinely new mechanic; the link-OR-title rule absorbs it.
- `lesson_sources` changes from a flat string list to a structured list. `learning-config.example.md`
  and any `learning-config.md` must be migrated; `/lesson-init` should write the new shape.
- ADR-0005's accepted limitation is **strengthened, not weakened**: reading the same editorial source
  through a feed that the editor controls keeps "only editor-curated material becomes a lesson" intact.
- Reliability now depends on `t.me/s/laravelnews` being reachable; when it is not, execution falls
  through to the URL probe, then Laravel Daily, then continues with a notice (per the existing
  "unreachable source → skip, notice, continue" rule).
