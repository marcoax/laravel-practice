# Lesson 09 — Queue: route(), Interruptible, Cache::touch()

> Version: 13.0 → 13.7 (Mar → Apr 2026) · Type: new
> Source: laravel-news.com/laravel-13, laravel-news.com/laravel-13-7-0

## What changed
- **`Queue::route()`** (13.0): define from a single place (a service provider) which
  connection/queue each job uses, without repeating config on every dispatch:
  ```php
  Queue::route(ProcessPodcast::class, connection: 'redis', queue: 'podcasts');
  ```
- **`Interruptible`** (13.7.0): a job that implements this interface defines an
  `interrupted(int $signal)` method and reacts when the worker receives a SIGTERM
  (e.g. during a deploy) — stop loops, release locks, save state — before shutdown.
  A `WorkerInterrupted` event is also dispatched for observability.
- **`Cache::touch()`** (13.0): extends an entry's TTL without fetching and re-storing it.

## Why it might matter
Centralized queue routing, clean shutdowns during deploys, fewer cache round-trips.
It changes how you design jobs in production.

## Try it
- [ ] Centralize the routing of 2–3 jobs with `Queue::route()`.
- [ ] Implement `Interruptible` in a job with a long loop and handle `interrupted()`.

## Relevant to your project?
- Do you run queues in production with frequent deploys or long jobs?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
- https://laravel-news.com/laravel-13-7-0
