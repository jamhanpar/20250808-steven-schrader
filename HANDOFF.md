---
issue: none
agent: "claude-code:d1e3"
updated: "2026-10-22T09:00:00Z"
lease_hours: 4
template_version: 1
---
# Handoff Brief

> Live work state for this repo. Read this FIRST every session; rewrite it after each
> completed unit of work and before stopping. See the Agent Continuity Protocol stanza
> in AGENTS.md/CLAUDE.md.

## Current State

Testing PR #48 (Media Optimization & Schema Markup, branch `feature/OvWHcgqM-media-optimization-schema-markup` → `dev`) locally. Lint + `npm run build` pass. JSON-LD Book schema renders on all 6 `/books/[bookId]` pages; all referenced `.webp` files exist. Fixed (uncommitted): `steve-schrader-author.webp` regenerated upright (EXIF Orientation=6 was dropped in conversion); `threads-history-1/2/3.webp` re-encoded from the jpeg originals with scan borders/frame cropped off (sharp, q80, max 1600px). Added optional `objectPosition` to `MosaicItem` (Mosaic.tsx) and set `"center top"` on the childhood photo in about-mosaic-data.json so the head isn't cropped. Implemented card https://trello.com/c/2rLr3uc1 in this PR (commit 39591cb, pushed; card moved to In Progress with results comment; user manual test passed): BooksGroup initial state from props (no isLoading gate), preview read from searchParams in /books and /books/[bookId] pages (now per-request rendered), Suspense fallbacks removed, sidebar thumbnails get `sizes`; Hero image gets `sizes`, real alt (hero-content.json), quality 100 dropped; both LCP images get fetchPriority="high". Lighthouse mobile, prod build: simulated perf 95–97 / LCP 2.7–2.9 s (simulation is pessimistic on localhost: observed LCP 143 ms = FCP); applied DevTools throttling: perf 96–99, LCP 1.7 s (home 1.7–2.2 s), CLS 0.001 everywhere (was 1.008 on book pages). Prod server running on :3100 from the Claude session; dev server stopped. Originals cleanup tracked in https://trello.com/c/MF5SPTSQ (Backlog).

## Critical Context

- JSON-LD `url` falls back to `http://localhost:3000` unless `NEXT_PUBLIC_SITE_URL` is set — it is not set in any local .env (only `.env.example`). Must be set in Vercel prod env or schema URLs are wrong.
- Two books (`on-sundays-we-visit-the-in-laws`, `crime-of-passion`) get no publisher/isbn — they have no Hanging Loose Press / Bookshop purchase link.
- `src/app/data/mosaicData.ts` still references the old .jpg/.jpeg files (not imported anywhere, appears to be dead code). Old jpg/png originals are still in `public/images/` (not deleted by the PR).

## Decisions Made

- About-page scans are cropped to remove print borders/frames (user approved 2026-10-21). Photos 4 and 5 were already clean edge to edge and are untouched.
- Any image conversion must apply EXIF orientation (sharp `.rotate()`), since WebP output drops the tag.

## Immediate Next Steps

1. Merge PR #48 after review; then move cards OvWHcgqM and 2rLr3uc1 to Done.
2. After deploy, view source on a live book page and confirm the ld+json `url` uses the real domain (NEXT_PUBLIC_SITE_URL set for prod + staging on 2026-10-22; it is build-time, so only builds after that pick it up).
3. After deploy, confirm LCP with PageSpeed Insights on the live URL.
4. Backlog: originals cleanup (https://trello.com/c/MF5SPTSQ). To Do: request publisher/ISBN from client for on-sundays-we-visit-the-in-laws and crime-of-passion (card created by user 2026-10-22).
