# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with Turbopack at localhost:3000
npm run build     # Production build
npm run lint      # Run ESLint
```

No test framework is configured in this project.

## Architecture Overview

This is a **Next.js 15 App Router** site for author Steven Schrader, using React 19, TypeScript, Tailwind CSS v4, and Framer Motion.

### Key architectural decisions

**CSS / Design System** (`src/app/globals.css`): Uses a four-layer token system:
1. `:root` — primitive CSS variables prefixed `--jp-*` (colors, spacing, fonts)
2. `[dark-theme='dark']` — dark theme overrides of the same primitives
3. `@theme inline` — semantic tokens (CSS-only, used in `.css` files via `var()`)
4. `@theme` — Tailwind utility tokens (generates utility classes for use in JSX `className`)

Do not add raw hex colors or ad-hoc spacing in JSX — always trace back to the token system.

**Global layout** (`src/app/layout.tsx`): Wraps the entire app in `ContactModalProvider`, which mounts the floating `ChatButton` and the `Modal` globally. The `ModalUrlHandlerWrapper` enables opening the contact modal via URL parameters.

**Contact form flow**:
1. `ChatButton` (floating bottom-right) → opens `ContactModalProvider`'s modal
2. `ContactForm` submits to `POST /api/contact`
3. API route (`src/app/api/contact/route.ts`) validates, rate-limits, then calls `sendContactFormEmail` from `src/lib/email-smtp.ts`
4. Email is sent via SMTP using `nodemailer` (a `EmailService` singleton)

**Email service** (`src/lib/email-smtp.ts`): Singleton class initialized lazily on first send. Requires these environment variables:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`
- `RECIPIENT_EMAIL` (required), `RECIPIENT_NAME` (optional)

A Mailgun alternative exists at `src/lib/email-mailgun.ts` but is currently commented out in the contact route.

**Modal system** (`src/app/components/modal/`): Generic `useModal` hook + `Modal` component. Usage: `useModal()` returns `[modalState, modalControls]`. See `src/app/components/modal/README.md` for the full API. The `/modal-examples` route has live demos.

**Data layer**: All page content lives in JSON/JS files under `src/app/data/`. Pages import directly — no CMS or database. Audio file paths for the music page should be defined in a data file here — do not hardcode paths in components.

**Static audio** (`/public/audio/`): Contains 18 MP3s for the music page. All files use kebab-case song-title-only naming — no artist suffix, no numeric prefix (e.g., `i-love-my-baby.mp3`, not `I Love My Baby - Steve Schrader.mp3`). Source files live in Google Drive at the `Music` folder (ID: `1_Qjt8Qjki9FRKZRTPU9rSANs3x2RuI0H`) inside the `Steven Schrader` Drive folder. When adding new tracks, pull from Drive, apply the same kebab-case convention, and drop them in `/public/audio/`.

**Remote images**: Only `images.unsplash.com` is allowlisted in `next.config.ts`. Add new domains there if needed.

### Route structure

| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/about` | About page with `Timeline` and `MosaicGallery` |
| `/books` | Books listing |
| `/books/[bookId]` | Individual book detail |
| `/contact` | Contact page (standalone, separate from modal) |
| `/modal-examples` | Dev/demo page for the modal system |
| `/api/contact` | Contact form POST endpoint |
| `/api/dev` | Development utilities |
| `/api/diagnostic` | SMTP/service diagnostic endpoint |
<!-- handoff-stanza-v3 -->
## Agent Continuity Protocol

Two kinds of brief, so parallel branches never conflict:
- `HANDOFF.md` (repo brief): Critical Context and Decisions Made that hold on every branch. Edit it only when a repo-wide fact or decision changes.
- `.handoff/briefs/<branch>.md` (branch brief): current state, branch decisions, next steps and the lease for one branch. `<branch>` is the branch name with `/` replaced by `-` (`feat/trello-reader` → `feat-trello-reader.md`).

FIRST ACTION every session: read `HANDOFF.md`, then your branch's brief. If none exists, create it from `~/.handoff/template/brief.md` if available, else copy another brief's frontmatter and headings. Skim the other briefs in `.handoff/briefs/` to see what else is in flight. If a brief links a Paperclip issue (`issue:` is not `none`), fetch its status from http://localhost:3100; if Paperclip is unreachable, the files are authoritative. If `card:` is set, read that card for scope. Check live status yourself (`git status`, `git log`, `gh pr list`): briefs are not the source of truth for branch, commit or PR state.

- Work on a branch, not the default branch. The default branch has no branch brief.
- After each completed unit of work AND before stopping: rewrite your branch brief, setting frontmatter `updated` to the current ISO8601 time and `agent` to `<tool>:<session-short-id>` (e.g. `claude-code:a3f2`).
- Record context, not status. Don't write what git, gh or the tracker already answer (PR open/merged, pushed, CI result). Write what they can't: what's verified and how, gotchas, rationale, what's half-done in the working tree.
- Write briefs to be true where they land. A branch brief ships with its PR, so describe the post-merge state, never "not yet pushed" or "PR open".
- Respect **Decisions Made** in both briefs; don't re-litigate settled choices. If you must reverse one, record the reversal and rationale. If the repo keeps a canonical decisions log (e.g. `DESIGN.md`, ADRs), record decisions there and link them.
- Leases are per branch. Parallel branches are fine. If your branch's brief (or another brief with the same `card:`) was updated within `lease_hours` by a different agent, continue that work or stop and flag the collision. Older than `lease_hours`: you may take over; note the takeover in the brief and (if Paperclip is up) re-claim the issue with the force flag.
- Archive on sight: if a brief in `.handoff/briefs/` belongs to a branch already merged into the default branch, `git mv` it to `.handoff/log/<branch>.md` in your next commit.
- Changelog (repos with `CHANGELOG.md`): never edit `CHANGELOG.md` directly. Add or extend `changelog.d/<branch>.md` in the same commit as the change, using `### Added` / `### Changed` / `### Fixed` / `### Removed` headings and one bullet per change. Fragments are folded into `CHANGELOG.md` by `~/.handoff/bin/handoff-changelog` on a separate `chore/changelog-<date>` PR.
<!-- /handoff-stanza-v3 -->
