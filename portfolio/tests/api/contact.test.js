// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { escapeHtml } from '../../src/lib/validators.js';

process.env.RESEND_API_KEY = 'test-key';
process.env.CONTACT_FROM_EMAIL = 'test@example.com';

const { default: handler } = await import('../../api/contact.js');

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(key, value) {
      this.headers[key] = value;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

function mockReq({ method = 'POST', body = {}, headers = {} } = {}) {
  return {
    method,
    body,
    headers,
    socket: { remoteAddress: '127.0.0.1' },
  };
}

const validBody = {
  name: 'Test User',
  email: 'test@example.com',
  subject: 'Hello',
  message: 'This is a test message.',
};

describe('api/contact', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('rejects non-POST requests with 405', async () => {
    const res = mockRes();
    await handler(mockReq({ method: 'GET' }), res);
    expect(res.statusCode).toBe(405);
    expect(res.headers['Allow']).toBe('POST');
  });

  it('returns field errors for an invalid payload', async () => {
    const res = mockRes();
    await handler(mockReq({ body: {} }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('validation');
    expect(res.body.fields).toHaveProperty('name');
    expect(res.body.fields).toHaveProperty('email');
    expect(res.body.fields).toHaveProperty('message');
  });

  it('silently ignores honeypot hits without sending email', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const res = mockRes();
    await handler(
      mockReq({
        body: { ...validBody, company: 'spam link' },
      }),
      res,
    );
    expect(res.statusCode).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a sanitized email through Resend for valid payloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const res = mockRes();
    await handler(mockReq({ body: validBody }), res);

    expect(res.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ method: 'POST' }),
    );
    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(init.body);
    expect(payload.to).toEqual(['hirwaaime41@gmail.com']);
    expect(payload.from).toBe('test@example.com');
    expect(payload.subject).toContain('Hello');
  });

  it('escapes HTML in the email body', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    await handler(
      mockReq({
        body: {
          name: '<script>alert(1)</script>',
          email: 'a@b.co',
          message: 'Hi <b>there</b>',
        },
      }),
      mockRes(),
    );

    const [, init] = fetchMock.mock.calls[0];
    const payload = JSON.parse(init.body);
    // sanitizeText strips angle brackets before anything is embedded
    expect(payload.html).not.toContain('<script>');
    expect(payload.html).not.toContain('<b>');
    expect(payload.html).not.toContain('alert(1)</');
    vi.unstubAllGlobals();
  });

  it('escapeHtml escapes all HTML entities', () => {
    expect(escapeHtml('<b>"x" & \'y\'</b>')).toBe(
      '&lt;b&gt;&quot;x&quot; &amp; &#39;y&#39;&lt;/b&gt;',
    );
    expect(escapeHtml('plain')).toBe('plain');
  });

  it('rate limits repeated requests from one IP', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);

    const ip = '203.0.113.99';
    for (let i = 0; i < 5; i += 1) {
      const res = mockRes();
      await handler(
        mockReq({ body: validBody, headers: { 'x-forwarded-for': ip } }),
        res,
      );
      expect(res.statusCode).toBe(200);
    }

    const res = mockRes();
    await handler(
      mockReq({ body: validBody, headers: { 'x-forwarded-for': ip } }),
      res,
    );
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toBe('rate_limited');
  });

  it('returns 503 when environment variables are missing', async () => {
    const originalKey = process.env.RESEND_API_KEY;
    const originalFrom = process.env.CONTACT_FROM_EMAIL;
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_FROM_EMAIL;

    vi.resetModules();
    const { default: freshHandler } = await import('../../api/contact.js');

    const res = mockRes();
    await freshHandler(mockReq({ body: validBody }), res);
    expect(res.statusCode).toBe(503);
    expect(res.body.error).toBe('not_configured');

    process.env.RESEND_API_KEY = originalKey;
    process.env.CONTACT_FROM_EMAIL = originalFrom;
  });

  it('returns email_failed when Resend responds with an error', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
    vi.stubGlobal('fetch', fetchMock);

    const res = mockRes();
    await handler(mockReq({ body: validBody }), res);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('email_failed');
  });
});
