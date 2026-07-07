# Lesson 07 — PHP Attributes in the framework

> Version: 13.0 → 13.8 (Mar → May 2026) · Type: new
> Source: laravel-news.com/laravel-13, laraveldaily.com

## What changed
Laravel 13 introduces native PHP attributes as an **optional alternative** to class
properties, across 36+ points of the framework:
- Models: `#[Table]`, `#[Fillable]`, `#[Hidden]`
- Controllers: `#[Middleware]`, `#[Authorize]`
- Jobs: `#[Tries]`, `#[Backoff]`, `#[Timeout]`, `#[FailOnTimeout]`
- and then listeners, mailables, notifications, commands, form requests, factories…

Releases 13.1–13.8 extend the pattern. All opt-in: nothing breaks.

## Why it might matter
It's a **convention** choice that touches every corner of the codebase. Make it
deliberately: sometimes it clarifies, sometimes it's just syntactic noise.

## Try it
- [ ] Convert a controller to `#[Middleware]`/`#[Authorize]` and judge if it's clearer.
- [ ] Convert a job to `#[Tries]`/`#[Backoff]`.

## Relevant to your project?
- Do you want a uniform convention across the whole codebase?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
- https://laraveldaily.com/post/this-week-in-laravel-new-laravel-13-main-things-you-need-to-know
