import { useTranslation } from 'react-i18next';

/** Skip-to-content link, visible on keyboard focus. */
export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-on-accent"
    >
      {t('skipToContent')}
    </a>
  );
}
