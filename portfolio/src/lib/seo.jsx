import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { site } from '@/data/site.js';

function ogLocale(lng) {
  switch (lng) {
    case 'fr':
      return 'fr_FR';
    case 'rw':
      return 'rw_RW';
    default:
      return 'en_US';
  }
}

/** Per-route SEO metadata + Open Graph / Twitter / JSON-LD. */
export function Seo({ title, description, path = '', jsonLd = [], noindex = false }) {
  const { i18n, t } = useTranslation();
  const baseUrl = site.siteUrl.replace(/\/$/, '');
  const url = `${baseUrl}/${path.replace(/^\//, '')}`;
  const fullTitle = title ? `${title} — ${site.name}` : `${site.name} — ${t('meta.titleSuffix')}`;
  const metaDescription = description || t('meta.tagline');
  const ogImage = `${baseUrl}/og-image.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex" /> : null}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content={ogLocale(i18n.language)} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLd.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}
