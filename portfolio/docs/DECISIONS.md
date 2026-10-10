# Technical decisions

Record of the notable decisions made while building this portfolio.

## Stack

- **React 18 + Vite 5** — fast HMR, simple build, easy Vercel deployment.
- **Tailwind CSS v4** via `@tailwindcss/vite` — CSS-first theme tokens
  (`@theme inline` + CSS variables on `:root` / `.dark`) instead of a JS
  `tailwind.config.js`. Dark mode uses a class strategy via
  `@custom-variant dark (&:where(.dark, .dark *))`, toggled by `useTheme`
  and persisted to `localStorage`.
- **React Router 6** — client-side routing with a Vercel SPA rewrite
  (`vercel.json` rewrites everything except `/api/*` to `index.html`).
- **react-i18next** — EN / FR / RW with a dev-only parity check
  (`scripts/check-locales.js`) that fails the build if the three languages
  drift apart. `<html lang>` is synced on `languageChanged`.
- **motion** (Framer Motion) — restrained: small fades/slides, stagger only
  where it aids comprehension, everything disabled under
  `prefers-reduced-motion` (`useReducedMotion`).
- **react-helmet-async** — per-page `<title>`, meta, canonical, OG tags, and
  JSON-LD (Person + WebSite) on the home page.
- **Custom cursor** — rendered only on fine pointers (`matchMedia('(pointer: fine)')`)
  and never hides the native cursor (accessibility-first).

## Contrast

Tailwind's default `blue-600` fails WCAG AA for large text in light mode when
used with white text at our sizes. Dedicated accent tokens were added:

- Light theme: text-on-accent `#ffffff` on accent `#1F5FE0` → **5.1:1** (AA).
- Dark theme: text-on-accent `#0a0c10` on accent `#4C8DFF` → **5.66:1** (AA).
- Hover states use `opacity-90` (not `brightness`), which preserves the
  contrast ratio of the underlying pair.

## ESLint

- Pinned `eslint@9.17.0` + `eslint-plugin-react@7.37.5` (flat config).
- **Why eslint-plugin-react is required:** this environment's ESLint core
  never passes `jsx` to `eslint-scope`'s scope analysis, so ESLint cannot see
  JSX references — every component import would be a false "unused var".
  `react.configs.flat.recommended` provides `react/jsx-uses-vars`, which marks
  JSX-used imports as used.
- `react/prop-types` and `react/react-in-jsx-scope` are off (React 18 + no
  propTypes in the codebase). `react-refresh/only-export-components` is warn.
- Non-component exports were moved out of component files
  (`src/lib/blog-data.js` holds the blog data functions; `blog.jsx` keeps only
  the `Markdown` component) to keep Fast Refresh clean.
- Files that contain JSX must use the `.jsx` extension for Vite's import
  analysis (`seo.jsx`, `blog.jsx`).

## Blog

File-based: Markdown files in `src/content/blog/*.md` with a small frontmatter
parser (title, date, summary, tags, draft). Draft posts are never rendered
publicly (`getPublishedPosts`). The sample post
(`how-this-portfolio-was-built.md`) is shipped as `draft: true`.

## Contact form

- Client (`ContactSection`) and server (`api/contact.js`) share the exact same
  validation/sanitization code (`src/lib/validators.js`) so rules can never
  drift apart.
- Server behavior:
  - `405` for non-POST requests
  - `200` (silently) for honeypot hits — bots get no feedback
  - `400` on validation failure with field-level messages
  - `429` on >5 submissions / 15 min per IP (in-memory map; per-serverless-
    instance, which is the correct granularity for a personal site)
  - `503 not_configured` when `RESEND_API_KEY` is missing — the UI then shows
    a graceful mailto + WhatsApp fallback instead of failing silently
  - HTML is escaped before the email body is built
- **Never silently fails:** every outcome surfaces a visible, localised status.

## Tests

- **Vitest + React Testing Library**: theme toggle/persistence, language
  switching + `<html lang>` sync, navbar (render, mobile menu, Esc,
  focus trap), contact form (validation, success, error, fallback,
  network error, disable-while-sending), conditional sections, locale parity,
  and 8 tests for `api/contact.js` (honeypot, rate limit, HTML escaping,
  not_configured).
- `tests/setup.js` installs an in-memory `Storage` polyfill: Node 26 defines a
  broken global `localStorage` (requires `--localstorage-file`) that shadows
  jsdom's — the polyfill only activates when the native one is unusable.
- Contact-form tests use `fireEvent.change` instead of `userEvent.type` for
  bulk values: typing 5001 chars with user-event times out and corrupts
  keyboard state for later tests.
- Playwright config excludes `tests/e2e/**` from Vitest.

## No invented facts

- GitHub username **HAJ-250** was verified live via `api.github.com`
  (`scripts/verify-github.js`): HTTP 200, 8 public repos.
  (`HAJ_250` is invalid — GitHub usernames cannot contain underscores;
  `HAJ250` returns 404.)
- Only two repos are hand-picked for the featured section, both verified:
  `KABOSSInc` and `umudugudu-system`. The rest of the GitHub section is
  fetched live from the API with skeleton / error / empty states.
- The KABOSS case study describes only sections verified on the live site
  (kabossimage.vercel.app). Its "0+" stats are placeholders and are not
  reproduced here.
- `testimonials.js` ships as an **empty array** — the section renders only
  when real testimonials exist.
- The CV card is disabled ("coming soon") until a real PDF is added to
  `public/cv/`.
