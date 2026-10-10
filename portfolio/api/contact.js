import { escapeHtml, sanitizeText, validateContact } from '../src/lib/validators.js';

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'hirwaaime41@gmail.com';
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || '';

// Best-effort, in-memory per-IP rate limiting.
// Serverless instances are ephemeral, so this is a soft guard, not a firewall.
const rateLimits = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

function clientIp(req) {
  const forwarded = req.headers && req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (entry && now < entry.resetAt) {
    entry.count += 1;
    return entry.count > RATE_LIMIT_MAX;
  }
  rateLimits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  return false;
}

function parseBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return {};
}

function buildEmailHtml({ name, email, subject, message }) {
  const subjectRow = subject
    ? `<tr><td style="padding:4px 16px 4px 0;font-weight:600;">Subject</td><td>${escapeHtml(subject)}</td></tr>`
    : '';
  return `<!doctype html>
<html>
<body style="font-family:system-ui,sans-serif;padding:24px;">
  <h2 style="margin:0 0 16px;">New portfolio contact message</h2>
  <table style="border-collapse:collapse;">
    <tr><td style="padding:4px 16px 4px 0;font-weight:600;">Name</td><td>${escapeHtml(name)}</td></tr>
    <tr><td style="padding:4px 16px 4px 0;font-weight:600;">Email</td><td>${escapeHtml(email)}</td></tr>
    ${subjectRow}
    <tr><td style="padding:4px 16px 4px 0;font-weight:600;vertical-align:top;">Message</td><td>${escapeHtml(message).replace(/\n/g, '<br>')}</td></tr>
  </table>
</body>
</html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Clear signal for the UI: email delivery is not configured on this deployment.
  // The client shows a graceful fallback (direct mailto + WhatsApp) instead of failing silently.
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL) {
    return res.status(503).json({ error: 'not_configured' });
  }

  const body = parseBody(req);

  // Honeypot: bots fill hidden fields. Reject silently without revealing why.
  if (body.company && String(body.company).trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  const errors = validateContact(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'validation', fields: errors });
  }

  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const name = sanitizeText(body.name, 100);
  const email = sanitizeText(body.email, 254);
  const subject = sanitizeText(body.subject, 200);
  const message = sanitizeText(body.message, 5000);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM_EMAIL,
        to: [CONTACT_TO_EMAIL],
        subject: `[Portfolio] ${subject ? `${subject} — ` : ''}${name}`,
        html: buildEmailHtml({ name, email, subject, message }),
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: 'email_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: 'email_failed' });
  }
}
