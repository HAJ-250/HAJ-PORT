import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/index.js';
import { Navbar } from '@/components/layout/Navbar.jsx';

function renderWithI18n(ui) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the site name and section links', () => {
    renderWithI18n(<Navbar />);
    expect(screen.getByText('HIRWA Aime JOSPIN')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('opens the mobile menu and focuses the close button', async () => {
    const user = userEvent.setup();
    renderWithI18n(<Navbar />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: /close menu/i });
    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it('closes the mobile menu on Escape and restores focus', async () => {
    const user = userEvent.setup();
    renderWithI18n(<Navbar />);

    const openButton = screen.getByRole('button', { name: /open menu/i });
    await user.click(openButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(openButton).toHaveFocus();
  });

  it('traps Tab focus inside the mobile menu', async () => {
    const user = userEvent.setup();
    renderWithI18n(<Navbar />);

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    const closeButton = screen.getByRole('button', { name: /close menu/i });
    await waitFor(() => expect(closeButton).toHaveFocus());

    // Shift+Tab from the first focusable element wraps to the last one
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    const links = screen
      .getAllByRole('link')
      .filter((link) => link.textContent && link.textContent.trim() !== '');
    const lastLink = links[links.length - 1];
    expect(document.activeElement).toBe(lastLink);
  });
});
