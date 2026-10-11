import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n/index.js';
import { ContactSection } from '@/components/sections/ContactSection.jsx';
import { buildMailtoUrl } from '@/lib/validators.js';

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

function expectMailtoShown() {
  expect(screen.getByText(/your email app should be open/i)).toBeInTheDocument();
  // Check email in the message text (not the link) to avoid duplicate match
  expect(screen.getByText(/a pre-addressed message to hirwaaime41@gmail.com was prepared/i)).toBeInTheDocument();
  const again = screen.getByRole('link', { name: /open email app again/i });
  expect(again).toHaveAttribute('href', expect.stringContaining('mailto:hirwaaime41@gmail.com'));
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

  it('falls back to a pre-addressed email when the API is not configured', async () => {
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

    expectMailtoShown();
  });

  it('falls back to a pre-addressed email when the network fails', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    renderWithI18n(<ContactSection />);

    fillForm(validForm);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expectMailtoShown();
  });

  it('silently ignores bots via the honeypot field', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const user = userEvent.setup();
    const { container } = renderWithI18n(<ContactSection />);

    fillForm(validForm);
    const honeypot = container.querySelector('input[name="company"]');
    fireEvent.change(honeypot, { target: { value: 'filled by bot' } });
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await new Promise((r) => setTimeout(r, 50));
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/message sent/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/your email app should be open/i)).not.toBeInTheDocument();
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

    const sendingLabel = screen.getByText(/sending/i);
    const disabledWrapper = sendingLabel.closest('[aria-disabled]');
    expect(disabledWrapper).not.toBeNull();
    expect(disabledWrapper).toHaveAttribute('aria-disabled', 'true');

    resolveFetch({ ok: true, json: async () => ({ ok: true }) });
    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });
});

describe('buildMailtoUrl', () => {
  it('builds a pre-addressed mailto link with subject and body', () => {
    const url = buildMailtoUrl({
      to: 'owner@example.com',
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Project inquiry',
      message: 'Hello,\nI would like to work with you.',
    });

    expect(url).toBe(
      'mailto:owner@example.com'
        + `?subject=${encodeURIComponent('[Portfolio] Project inquiry — Jane Doe')}`
        + `&body=${encodeURIComponent('Name: Jane Doe\nEmail: jane@example.com\n\nHello,\nI would like to work with you.')}`,
    );
    expect(url).toContain('mailto:owner@example.com?subject=');
    expect(url).toContain(encodeURIComponent('Jane Doe'));
    expect(url).toContain(encodeURIComponent('jane@example.com'));
  });

  it('works without an optional subject', () => {
    const url = buildMailtoUrl({
      to: 'owner@example.com',
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: '',
      message: 'Hi there',
    });

    expect(url).toContain(encodeURIComponent('[Portfolio] Jane Doe'));
    expect(url).not.toContain('—');
  });

  it('percent-encodes newlines and special characters', () => {
    const url = buildMailtoUrl({
      to: 'owner@example.com',
      name: 'A B',
      email: 'a@b.co',
      subject: '',
      message: 'line1\nline2 <>&"\'',
    });

    expect(url).toContain('%0A');
    expect(url).not.toContain('<');
    expect(url).not.toContain('>');
    expect(url).not.toContain(' ');
  });
});