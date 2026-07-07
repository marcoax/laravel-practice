# Lesson 04 — Duration helpers and HTTP Client throwUnless()

> Version: 12.40 · 12.41 · Type: new · Source: laravel-news.com/laravel-12-41-0

## What changed
- **Duration helpers** — global functions returning a `CarbonInterval`. `seconds()`,
  `minutes()`, `hours()`, `days()`, `years()` arrived in **12.40**; `milliseconds()`,
  `weeks()`, `months()` were added in **12.41**:
  ```php
  use function Illuminate\Support\{seconds, minutes, hours, days, weeks, months, years, milliseconds};
  ```
- **HTTP Client** — `throwUnless()` is now available on the response
  (`Illuminate\Http\Client\Response`), not just on the pending request (**12.41**).

## Why it might matter
Duration helpers kill magic numbers for TTLs, timeouts and lock durations — the code
reads like a sentence. `throwUnless()` lets you guard a response fluently.

## Try it
- [ ] Replace hardcoded seconds in a lock or cache TTL with `minutes()`/`hours()`.
- [ ] Use `throwUnless()` on an HTTP response to fail on an unexpected condition.

## Relevant to your project?
- Do you have durations written as raw numbers scattered through the code?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-12-41-0
