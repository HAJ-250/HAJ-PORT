// JSON-LD structured-data builders (pure functions, no React).
import { site } from '@/data/site.js';

/** JSON-LD Person — only verified public data (no birthdate, no private address parts). */
export function personJsonLd() {
  const sameAs = [site.facebook, site.instagram];
  if (site.github.username) sameAs.push(site.github.profileUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    alternateName: site.nickname,
    jobTitle: site.title,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Rusizi',
      addressCountry: 'RW',
    },
    sameAs,
  };
}

export function websiteJsonLd(description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name} — Portfolio`,
    url: site.siteUrl,
    description,
    author: { '@type': 'Person', name: site.name },
  };
}
