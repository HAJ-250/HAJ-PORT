import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/i18n/index.js';

const LONG_NAMES = { en: 'English', fr: 'Français', rw: 'Kinyarwanda' };

/** EN / FR / RW switcher with accessible pressed state. */
export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  return (
    <div role="group" aria-label={t('language.label')} className="flex items-center gap-0.5">
      {SUPPORTED_LANGUAGES.map(({ code, short }) => {
        const active = i18n.language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={active}
            aria-label={`${LONG_NAMES[code]} (${short})`}
            className={`min-h-[44px] min-w-[44px] rounded-full px-2 text-xs font-semibold transition-colors duration-150 ${
              active
                ? 'bg-accent text-on-accent'
                : 'text-muted hover:bg-elevated hover:text-text'
            }`}
          >
            {short}
          </button>
        );
      })}
    </div>
  );
}
