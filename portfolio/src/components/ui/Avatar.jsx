import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Owner's photo when public/images/profile.jpg exists,
 * otherwise an intentional "HAJ" monogram fallback.
 */
export function Avatar({ className = '' }) {
  const { t } = useTranslation('home');
  const [failed, setFailed] = useState(false);
  const alt = t('hero.avatarAlt');

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-elevated to-surface font-display text-5xl font-bold tracking-wide text-accent ${className}`}
      >
        HAJ
      </div>
    );
  }

  return (
    <img
      src="/images/profile.jpg"
      alt={alt}
      width={320}
      height={320}
      loading="eager"
      onError={() => setFailed(true)}
      className={`rounded-2xl border border-border bg-surface object-cover ${className}`}
    />
  );
}
