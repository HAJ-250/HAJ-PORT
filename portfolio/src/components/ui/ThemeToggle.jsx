import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/useTheme.js';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t('theme.toggle')}
      aria-pressed={dark}
      title={dark ? t('theme.light') : t('theme.dark')}
      className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-muted transition-colors duration-150 hover:bg-elevated hover:text-text"
    >
      {dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  );
}
