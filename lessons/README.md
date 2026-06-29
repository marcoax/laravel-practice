# The lessons

Twelve lessons, in chronological order (oldest first). Each is a short *brief*,
not a full tutorial: it tells you **what changed**, **why it might matter** and
**what to try**. The practice is yours — on your own project or a fresh Laravel
app, with your AI assistant or by hand.

| #  | Lesson | Version | Type |
|----|--------|---------|------|
| 01 | Eloquent casts (AsHtmlString, AsCollection::of, #[UseEloquentBuilder]) | 12.x–12.19 | new |
| 02 | Query Builder Pipelines and `shouldRun()` | 12.4 | new |
| 03 | Queue: `FailOnException` middleware | 12.19 | new |
| 04 | Duration helpers & HTTP Client `throwUnless()` | 12.40–12.41 | new |
| 05 | Array, Collection and Gate helpers (Gate + enum) | 12.45–12.46 | new |
| 06 | PHP 8.3 minimum: upgrade checklist | 13.0 | breaking |
| 07 | PHP Attributes in the framework | 13.0–13.8 | new |
| 08 | CSRF: `PreventRequestForgery` and Sec-Fetch-Site | 13.0 | security |
| 09 | Queue: `route()`, `Interruptible`, `Cache::touch()` | 13.0–13.7 | new |
| 10 | Laravel AI SDK | 13.0 | new |
| 11 | Vector search / semantic search | 13.0 | new |
| 12 | JSON:API Resources | 13.0 | new |

## Primary source per lesson

Every rendered lesson (`NN-*.html`) carries a prominent **primary source** callout —
the single best resource to read next for deeper study — distinct from the secondary
citations listed in the `.meta` header (see [issue #12](../../../issues/12)). New
lessons inherit the convention from [`_template.md`](./_template.md)'s `## Sources`
section. All lessons rendered so far (**01–07**) have been **retro-fitted** with the
callout; later lessons get it at generation time.

## Writing your own lessons

Start from [`_template.md`](./_template.md), copy it with a new number and fill it
in. To track other versions or packages (Cloud, Wayfinder…), use the same shape.
