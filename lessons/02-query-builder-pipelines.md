# Lesson 02 — Query Builder Pipelines and conditional migrations

> Version: 12.4 (Apr 2025) · Type: new · Source: laravel-news.com/laravel-12-4-0

## What changed
The Query Builder supports **Pipelines**: you can pass the builder through a series
of classes/closures, the same way HTTP middleware already works. In the same
release, migrations gain an optional `shouldRun()` method that defines a condition
for whether the migration runs at all.

## Why it might matter
Queries with many conditional filters become composable and readable. Conditional
migrations help when the schema depends on the environment.

## Try it
- [ ] Refactor a query full of `when()`/`if` into a pipeline of steps.
- [ ] Add `shouldRun()` to a migration that should only run in certain cases.

## Relevant to your project?
- Do you have queries with many optional filters that are hard to read today?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-12-4-0
