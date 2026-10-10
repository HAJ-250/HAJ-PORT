import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/index.js';
import { ContactSection } from '@/components/sections/ContactSection.jsx';

function renderWithI18n(ui) {
  return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

const validForm = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Hello',
  message: 'This is a test message.',
};

function fillForm(values) {
  fireEvent.change(screen.getByLabelText(/your name/i), {
    target: { value: values.name },
  });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: values.email },
  });
  if (values.subject) {
    fireEvent.change(screen.getByLabelText(/subject/i), {
      target: { value: values.subject },
    });
  }
  fireEvent.change(screen.getByLabelText(/^message$/i), {
    target: { value: values.message },
  });
}

describe('ContactSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows inline errors for empty fields', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/please enter your name/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/please write a message/i)).toBeInTheDocument();
  });

  it('shows an error for an invalid email', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm({ ...validForm, email: 'not-an-email' });
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('rejects messages that are too long', async () => {
    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm({ ...validForm, message: 'x'.repeat(5001) });
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/please write a message/i)).toBeInTheDocument();
  });

  it('submits a valid form and announces success', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm(validForm);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.name).toBe('Test User');
    expect(body.company).toBe('');
  });

  it('shows the error state and graceful fallback when email is not configured', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => ({ error: 'not_configured' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm(validForm);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(
      await screen.findByText(/isn't available on this deployment/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /send by email/i }),
    ).toHaveAttribute('href', 'mailto:hirwaaime41@gmail.com');
    const whatsappLinks = screen.getAllByRole('link', { name: /whatsapp/i });
    expect(
      whatsappLinks.some(
        (link) => link.getAttribute('href') === 'https://wa.me/250795477584',
      ),
    ).toBe(true);
  });

  it('announces network failures', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm(validForm);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('disables the submit button while sending', async () => {
    let resolveFetch;
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm(validForm);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    // The disabled Button renders as a span with aria-disabled
    const sendingLabel = screen.getByText(/sending/i);
    const disabledWrapper = sendingLabel.closest('[aria-disabled]');
    expect(disabledWrapper).not.toBeNull();
    expect(disabledWrapper).toHaveAttribute('aria-disabled', 'true');

    resolveFetch({ ok: true, json: async () => ({ ok: true }) });
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });
});
