# Lesson 06 — PHP 8.3 minimum: upgrade checklist

> Version: 13.0 (Mar 17, 2026) · Type: breaking · Source: laravel-news.com/laravel-13

## What changed
Laravel 13 raises the minimum to **PHP 8.3** and drops 8.2. It's the only real
friction point of an upgrade otherwise described as "zero breaking changes". PHP 8.3
brings typed class constants, `json_validate()`, more granular DateTime exceptions
and performance improvements.

## Why it might matter
It's not "how to install PHP 8.3" — it's the systematic checklist so subtle
behavior changes (casts, dates, type coercion) and pinned dependencies don't catch
you out.

## Try it
- [ ] `php -v` and verify the actual runtime (including CI/production).
- [ ] Check the `platform` in `composer.json` and dependencies still on 8.2.
- [ ] Run the full test suite on 8.3.

## Relevant to your project?
- Are you already on PHP 8.3 everywhere, including production?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
