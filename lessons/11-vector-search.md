# Lesson 11 — Vector search and semantic search

> Version: 13.0 (Mar 17, 2026) · Type: new · Source: laravel-news.com/laravel-13

## What changed
Laravel 13 adds **native vector queries** and **semantic search** to the query
builder, integrated with the AI SDK's embedding workflow. You can run a similarity
search straight from the builder, with embeddings generated from plain text:
```php
$documents = DB::table('documents')
    ->whereVectorSimilarTo('embedding', 'Best wineries in Napa Valley')
    ->limit(10)
    ->get();
```
Important: this is built on **PostgreSQL + pgvector**. It's not a generic, any-database
feature.

## Why it might matter
Search by meaning rather than keywords, without bolting on an external service —
*provided* your stack matches (Postgres + pgvector + an embedding provider via the AI SDK).

## Try it
- [ ] Set up pgvector on a Postgres database and add a vector column.
- [ ] Store embeddings for some content, then query with `whereVectorSimilarTo()`.
- [ ] Compare the results with a full-text search.

## Relevant to your project?
- Do you have content where semantic search would help?
- **What database engine are you on?** If you're on MySQL, native vector search isn't
  available — you'd need Postgres + pgvector, or an external vector store.

_Example — {{reference_project}}:_ your assessment here.

## Sources
- https://laravel-news.com/laravel-13
