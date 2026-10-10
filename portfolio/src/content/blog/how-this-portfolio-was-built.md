---
title: "How this portfolio was built"
date: "2026-10-09"
summary: "A walkthrough of the stack, architecture and design decisions behind this site."
tags: [portfolio, vite, react, tailwind, i18n]
draft: true
---

This post is a **draft** — it describes how this portfolio itself was built, and is here for the owner's review before it goes public.

## Stack

- **React 18 + Vite** — the app shell, rendered client-side with route-level code splitting.
- **Tailwind CSS v4** — design tokens defined as CSS variables, with class-based dark mode and no flash of the wrong theme.
- **react-router** — routes for the home page, project case studies, the blog and a friendly 404.
- **react-i18next** — English, French and Kinyarwanda, with a dev-only parity check that fails the build when a key exists in one language but not another.
- **motion** — subtle reveal-on-scroll animations, disabled entirely when `prefers-reduced-motion` is set.
- **react-helmet-async** — per-route titles, descriptions, Open Graph tags and JSON-LD structured data.
- **lucide-react** for icons and **@fontsource** for self-hosted fonts (Space Grotesk, Inter, JetBrains Mono) — no external font requests.

## Architecture

- All content lives in `src/data/` and the locale files, so the site can be updated without touching component code.
- Blog posts are Markdown files with frontmatter (`title`, `date`, `summary`, `tags`, `draft`), loaded with `import.meta.glob`. Drafts never render publicly.
- The contact form posts to a Vercel serverless function (`api/contact.js`) which validates and sanitizes input, ignores honeypot hits silently, applies best-effort per-IP rate limiting, and sends email through Resend.
- Theme and language preferences are persisted in `localStorage` and detected from the system on first visit.

## Testing

- Vitest + React Testing Library for unit and interaction tests.
- `npm run check:locales` fails if `en` has a key that `fr` or `rw` is missing.
- Playwright smoke tests cover the main flows.

*This post is marked `draft: true` and is not publicly listed until the owner reviews it.*
