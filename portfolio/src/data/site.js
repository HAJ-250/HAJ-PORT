// Single source of truth for the site's identity, links and feature flags.
// Never hard-code these values in components.
export const site = {
  name: 'HIRWA Aime JOSPIN',
  nickname: 'MC HAJ',
  title: 'Full-Stack Developer',
  location: 'Rusizi, Rwanda',
  email: 'hirwaaime41@gmail.com',
  emailUrl: 'mailto:hirwaaime41@gmail.com',
  whatsapp: {
    display: '+250 795 477 584',
    url: 'https://wa.me/250795477584',
  },
  facebook: 'https://www.facebook.com/H.A.J.250',
  instagram: 'https://www.instagram.com/H.A.J.250',
  github: {
    // Verified via `npm run verify:github` — HAJ_250 (owner's note) is invalid;
    // HAJ-250 resolves on the GitHub API, HAJ250 does not.
    username: 'HAJ-250',
    profileUrl: 'https://github.com/HAJ-250',
    // Shown as pinned cards; data is enriched live from the API when possible.
    handpicked: ['KABOSSInc', 'umudugudu-system'],
    // Repos excluded from the "More from GitHub" list (description reads as placeholder text).
    exclude: ['my-project'],
    maxAutoRepos: 6,
  },
  cv: {
    // Flip to true and drop the PDF into public/cv/ when the owner supplies it.
    available: false,
    path: '/cv/HIRWA-Aime-Jospin-CV.pdf',
  },
  // Set VITE_SITE_URL to the real deployment URL (see .env.example and docs/DEPLOY.md).
  siteUrl: (import.meta.env && import.meta.env.VITE_SITE_URL) || 'https://your-project.vercel.app',
};
