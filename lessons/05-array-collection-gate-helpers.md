# Lesson 05 — Array, Collection and Gate helpers

> Version: 12.45 · 12.46 (Jan 2026) · Type: new · Source: laravel-news.com/laravel-12-46-0

## What changed
- `Arr::onlyValues()` and `Arr::exceptValues()`: filter by **value** (not key),
  complementing `Arr::only()`/`Arr::except()`.
- `Collection::containsManyItems()`: multiple check in one call.
- `Gate::has()` now accepts a `UnitEnum` directly: type-safe authorization without
  converting the enum to a string.

## Why it might matter
High-frequency helpers. The interesting piece is Gate + enum: you can model
permissions and roles as enums, with the benefits of the type system.

## Try it
- [ ] Rewrite a policy or `Gate` check using an enum instead of magic strings.

## Relevant to your project?
- Do you handle permissions/roles with strings you could type?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-12-46-0
