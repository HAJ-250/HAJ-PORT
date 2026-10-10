# Translation review checklist

English (en) is the **source of truth**. French (fr) and Kinyarwanda (rw)
translations were generated to match key-for-key (verified by
`scripts/check-locales.js`, which fails the build on any drift), but they have
**not** been reviewed by a native speaker. Please review before publishing.

## How to review

1. `npm run dev`, then switch languages with the switcher in the navbar
   (EN / FR / RW).
2. Walk every page: Home, Projects (+ each project detail), Blog, Contact,
   404. Also toggle the mobile menu.
3. Check each string for:
   - **Accuracy** — does it say what the English says?
   - **Register** — professional but warm; Kinyarwanda should use the
     appropriate level of formality.
   - **Length** — no string should overflow its container (check 360 px wide).
   - **Consistency** — terms like "Full-Stack Developer", "Prototype",
     "Case study" should be translated the same way everywhere.
4. Locale files live in
   `src/i18n/locales/{en,fr,rw}/{common,home,projects,contact,blog}.json`.

## Known review priorities

- **Kinyarwanda (rw)** — highest priority; most likely to contain
  machine-translation artifacts. Pay attention to tech vocabulary
  ("Full-Stack Developer", "GitHub", "API") where borrowing or code-switching
  may be more natural than a neologism.
- **French (fr)** — check formal vs. informal "vous"/"tu" consistency
  (the site uses formal register throughout — keep it consistent).
- **Interpolations** — strings with `{{name}}`, `{{count}}` etc. must keep
  the exact placeholder tokens.
- **Pluralization** — i18next plural keys (`_one`, `_other`, …) must exist
  in all three languages for the same keys.

## After reviewing

- Edit the JSON files directly; the dev server hot-reloads.
- Run `npm run check:locales` — it must report
  `Locale parity OK — en, fr, rw have identical key sets across 5 namespaces.`
- Never delete a key from `en` without removing it from `fr` and `rw` (the
  parity check enforces this).
