# Lesson 08 — CSRF: PreventRequestForgery and origin checks

> Version: 13.0 (Mar 17, 2026) · Type: security · Source: laravel-news.com/laravel-13

## What changed
CSRF protection is formalized in the `PreventRequestForgery` middleware and
strengthened: beyond the classic token, Laravel now uses native browser headers
(`Sec-Fetch-Site`) to recognize cross-site requests. In practice the dreaded
`419 / TokenMismatch` errors should drop a lot, because the framework figures out
on its own whether a request is same-site. It stays compatible with the token system.

## Why it might matter
It's direct security, and it touches a point that produces many false positives.
Understand it **before** writing or touching custom handlers for `TokenMismatchException`.

## Try it
- [ ] Read the middleware and understand when the header-based check kicks in.
- [ ] Check your custom `TokenMismatchException` handlers.
- [ ] Test a same-site POST and a cross-site one.

## Relevant to your project?
- Do you have custom CSRF logic or manual 419 handling?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
