# Content TODO

Everything on this list is a **deliberate placeholder** — the site contains no
invented facts. Items are ordered roughly by impact on the site's completeness.

## Must-have before "real" launch

1. **Profile photo** — `Avatar` falls back to the "HAJ" monogram. Drop a
   photo at `public/images/profile.jpg` (or update the path in
   `src/data/site.js`).
2. **CV / résumé PDF** — the CV card in the contact section is disabled with
   "coming soon". Add a PDF to `public/cv/cv.pdf` and set
   `cv: { available: true, file: '/cv/cv.pdf' }` in `src/data/site.js`.
   See `docs/CV-CONTENT-DRAFT.md` for a draft built only from verified facts.
3. **Umudugudu screenshots** — the project page shows styled placeholder
   panels. Add real screenshots to `public/images/umudugudu/` and reference
   them in `src/data/projects.js`. **They must show fictional demo data only**
   (no real citizen information).
4. **Umudugudu feature list** — the case study currently describes the repo
   as "the management system" (the verified self-description). Expand with the
   real feature set once confirmed.
5. **KABOSS repo description** — `KABOSSInc` is described as "the client's
   website" (verified). Consider a fuller, still-honest description.
6. **Real testimonials** — `src/data/testimonials.js` is an empty array, so
   the section is hidden. Add genuine, permission-based quotes (name + role +
   consent) and the section appears automatically.
7. **Translation review** — EN is the source of truth; FR/RW were generated
   programmatically. A native speaker should review all three languages.
   See `docs/TRANSLATION-REVIEW.md`.

## Deployment

8. **`VITE_SITE_URL`** — set to the real production URL (currently
   `https://your-project.vercel.app`). Affects canonical links, sitemap,
   OG tags, and robots.txt. Regenerate the sitemap after changing it
   (`npm run sitemap`).
9. **`RESEND_API_KEY` + `CONTACT_TO_EMAIL`** — required for the contact form
   to send email. Without them the API returns `503 not_configured` and the
   form shows the mailto/WhatsApp fallback.
10. **GitHub username** — verified as `HAJ-250`. If the account is ever
    renamed, update `github.username` in `src/data/site.js` and re-run
    `npm run verify:github`.

## Optional polish

11. **Blog posts** — one draft sample post ships (`draft: true`). Publish by
    removing the `draft` flag, or delete the file.
12. **More GitHub projects** — the GitHub section auto-fetches all 8 public
    repos; nothing to do unless new repos are pushed.
13. **Domain** — point a custom domain at the Vercel project and update
    `VITE_SITE_URL`.

## Explicitly out of scope (by design)

- No date of birth, birthplace, cell, or sector anywhere (privacy).
- No skill percentages, years-of-experience counters, or other unverifiable
  stats.
- No stock "client" logos or invented company names.
