# Lesson 03 — Queue: FailOnException

> Version: 12.19 (Jun 2025) · Type: new · Source: laravel-news.com/laravel-12-19-0

## What changed
The `FailOnException` middleware marks a job as **failed immediately** on a specific
exception, without consuming all the retries. The same release adds extended metrics
for queue size.

## Why it might matter
When you know a job can never succeed (e.g. a 4xx from an API), retrying is just
waste. This gives granular control over failures.

## Try it
- [ ] Add `FailOnException` to a job that calls an external service, failing fast on non-recoverable errors.

## Relevant to your project?
- Do you use queues with jobs that depend on external services?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-12-19-0
