# Lesson 12 — JSON:API Resources

> Version: 13.0 (Mar 17, 2026) · Type: new · Source: laravel-news.com/laravel-13

## What changed
Laravel 13 includes first-party support for the **JSON:API** spec. The new resource
classes handle serialization, relationship inclusion, sparse fieldsets (only the
requested fields), links and headers conforming to the standard.

## Why it might matter
If you build REST APIs today with custom `JsonResource` classes, here's a ready-made
standard. The question is whether the standard helps you or your current resources
are enough.

## Try it
- [ ] Expose a model as a JSON:API resource.
- [ ] Try sparse fieldsets and relationship inclusion.

## Relevant to your project?
- Do you expose APIs to a frontend or third parties that would benefit from a standard?

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
