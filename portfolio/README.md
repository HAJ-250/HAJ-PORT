# HIRWA Aime JOSPIN — Personal Portfolio

Personal portfolio of **HIRWA Aime JOSPIN (MC HAJ)**, Full-Stack Developer based in
Rusizi, Rwanda.

Built with **React 18 + Vite**, **Tailwind CSS v4**, **React Router**, **react-i18next**
(English / Français / Kinyarwanda), **motion** (restrained, reduced-motion aware),
**react-helmet-async**, tested with **Vitest + Testing Library** and **Playwright**,
deployed as a **Vercel** project with a serverless contact endpoint.

## Quick start

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # generate sitemap + OG image, then production build → dist/
npm run preview    # serve the production build locally
```

## Quality gate

```bash
npm run lint          # ESLint (flat config)
npm run check:locales # verifies EN/FR/RW locale files have identical key sets
npm run test          # Vitest + React Testing Library (unit + component + API)
npm run check         # runs lint + locale check + tests + build (the full gate)
```

## Other scripts

```bash
npm run verify:github  # verifies the GitHub username + hand-picked repos exist
npm run sitemap        # regenerates public/sitemap.xml from src/data/site.js
```

## Project structure

```
├── api/contact.js            # Vercel serverless contact endpoint (Resend)
├── scripts/                  # locale parity check, sitemap + OG image generators, GitHub verification
├── public/                   # favicon, robots.txt, sitemap.xml, og-image.png, images/, cv/
├── src/
│   ├── components/           # ui primitives, layout, sections, effects
│   ├── data/                 # site config, projects, skills, journey, testimonials (empty by default)
│   ├── hooks/                # useTheme, useReducedMotion, useScrollSpy, useGithubRepos
│   ├── i18n/locales/         # en / fr / rw × common, home, projects, contact, blog
│   ├── lib/                  # validators (shared client/server), seo, blog data + renderer
│   ├── pages/                # Home, ProjectPage, BlogIndex, BlogPost, NotFound
│   └── styles/index.css      # Tailwind v4 theme tokens (CSS-first)
├── tests/                    # Vitest unit/component tests + Playwright e2e specs
└── docs/                     # DECISIONS, CONTENT-TODO, TRANSLATION-REVIEW, CV-CONTENT-DRAFT, DEPLOY
```

## Configuration

Copy `.env.example` to `.env` (local) or set the variables in Vercel:

| Variable          | Required for                | Notes                                            |
| ----------------- | --------------------------- | ------------------------------------------------ |
| `VITE_SITE_URL`   | canonical URLs, sitemap, OG | e.g. `https://your-name.vercel.app`              |
| `RESEND_API_KEY`  | contact form emails         | *optional* — without it the form auto-falls-back to a pre-addressed mailto: |
| `CONTACT_FROM_EMAIL` | sender address for Resend | *optional* — must be a verified Resend sender |

> **Privacy note:** the portfolio only ever shows "Rusizi, Rwanda" as the public
> location. No date of birth, birthplace, cell, or sector is included anywhere.

## Honest-content policy

This site contains **no invented facts**: no fake testimonials, stats, skill
percentages, job history, or results. Placeholders are clearly marked and tracked in
[`docs/CONTENT-TODO.md`](docs/CONTENT-TODO.md). The Umudugudu project is labelled a
**Prototype**, and the KABOSS case study describes only verified, observed sections of
the live site.
