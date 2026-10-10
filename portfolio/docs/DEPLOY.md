# Deployment guide (Vercel)

## Prerequisites

- A Vercel account (https://vercel.com) connected to the GitHub repo.
- A Resend account + API key (https://resend.com) for the contact form.
- The production URL (e.g. `https://haj-portfolio.vercel.app` or a custom
  domain).

## Steps

1. **Push the project to GitHub** (see "Git" below).
2. **Import the repo in Vercel** — framework preset "Vite", root directory
   `portfolio/` (or move the contents to the repo root).
3. **Environment variables** (Project → Settings → Environment Variables):

   | Variable           | Value                                        |
   | ------------------ | -------------------------------------------- |
   | `VITE_SITE_URL`    | production URL, no trailing slash            |
   | `RESEND_API_KEY`   | from Resend dashboard                        |
   | `CONTACT_TO_EMAIL` | inbox that should receive contact messages   |

4. **Deploy.** Vercel runs `npm run build`, which regenerates
   `sitemap.xml` and `og-image.png` with the correct URL, then builds to
   `dist/`. `vercel.json` handles SPA rewrites and security headers.

## What the contact endpoint needs

`api/contact.js` is a Vercel serverless function. It sends email through
Resend's REST API. If `RESEND_API_KEY` is unset it returns
`503 not_configured` and the UI shows a mailto + WhatsApp fallback — the
form never silently fails.

## Custom domain

Add the domain in Vercel (Project → Settings → Domains), then update
`VITE_SITE_URL` and re-deploy so canonical tags, sitemap and OG image match.

## Verifying a deploy

- `https://<your-domain>/robots.txt` and `/sitemap.xml` resolve.
- Contact form: with the API key set, a test message arrives by email;
  without it, the fallback block appears.
- Run `npm run verify:github` locally to re-confirm the GitHub username and
  hand-picked repos resolve.

## Git

The project is committed with per-phase commits (see `git log`). Local
identity is set to the owner's name/email in the repo config.
