import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/index.js';
import { ThemeToggle } from '@/components/ui/ThemeToggle.jsx';

function renderWithI18n(ui) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    localStorage.clear();
  });

  it('toggles the dark class and persists the choice', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /toggle color theme/i });
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    await user.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await user.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('exposes its pressed state', () => {
    renderWithI18n(<ThemeToggle />);
    const button = screen.getByRole('button', { name: /toggle color theme/i });
    expect(button).toHaveAttribute('aria-pressed');
  });
});
