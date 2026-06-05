# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint
```

## Architecture

Next.js 15 App Router project with TypeScript and Tailwind CSS v4.

- **`src/app/`** — App Router pages and layouts. `layout.tsx` is the root layout (fonts, metadata); `page.tsx` is the home route.
- **`src/app/globals.css`** — Global styles via Tailwind v4 PostCSS plugin.
- Path alias `@/*` maps to `src/*`.

Tailwind CSS v4 is configured via PostCSS (`postcss.config.mjs`) — there is no `tailwind.config.*` file; theme customization goes in `globals.css` using `@theme`.
