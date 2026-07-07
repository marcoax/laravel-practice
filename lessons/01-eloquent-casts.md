# Lesson 01 — More expressive Eloquent casts

> Version: Laravel 12.x, through 12.19 · Type: new
> Source: laravel-news.com/laravel-12-19-0

## What changed
Laravel 12 expanded Eloquent casting across the 12.x line. The headline additions:
`AsHtmlString` (cast straight to `HtmlString`), `AsCollection::of(ClassName::class)`
(map a JSON column's items into typed objects), `AsUri`, and — landing together in
**12.19** — the `AsFluent` cast plus the `#[UseEloquentBuilder(MyBuilder::class)]`
attribute, which attaches a custom query builder to a model without overriding
`newEloquentBuilder()`.

## Why it might matter
Less boilerplate on models with JSON fields or value objects, and custom builders
declared cleanly with one attribute instead of an override.

## Try it
- [ ] Cast a JSON column with `AsCollection::of(...)` to your own class (it must implement `Arrayable` + `JsonSerializable`).
- [ ] Create a custom Builder with a recurring scope and wire it via `#[UseEloquentBuilder]`.

## Relevant to your project?
- Do you have models with many JSON/array fields handled by hand?
- Do you repeat the same scopes across the codebase?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-12-19-0
