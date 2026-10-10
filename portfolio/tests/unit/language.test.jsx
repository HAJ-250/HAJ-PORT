import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/index.js';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher.jsx';

function renderWithI18n(ui) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    localStorage.clear();
    await i18n.changeLanguage('en');
  });

  it('switches to French, updates visible text and <html lang>', async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'Français (FR)' }));

    expect(i18n.language).toBe('fr');
    expect(document.documentElement.lang).toBe('fr');
    expect(localStorage.getItem('i18nextLng')).toBe('fr');
  });

  it('switches to Kinyarwanda', async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: 'Kinyarwanda (RW)' }));

    expect(i18n.language).toBe('rw');
    expect(document.documentElement.lang).toBe('rw');
  });

  it('marks the active language', async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);
    await user.click(screen.getByRole('button', { name: 'Français (FR)' }));

    const frenchButton = screen.getByRole('button', { name: 'Français (FR)' });
    expect(frenchButton).toHaveAttribute('aria-pressed', 'true');
  });
});
