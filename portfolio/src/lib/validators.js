// Shared contact-form validation and sanitization.
// Used by the client form (src) and the serverless function (api/) so both
// enforce identical limits.
export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  subject: { max: 200 },
  message: { min: 10, max: 5000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F]/g; // eslint-disable-line no-control-regex

/** Returns a map of field -> error code. Empty object means valid. */
export function validateContact(body) {
  const errors = {};
  const name = String(body?.name ?? '').trim();
  const email = String(body?.email ?? '').trim();
  const subject = String(body?.subject ?? '').trim();
  const message = String(body?.message ?? '').trim();

  if (name.length < LIMITS.name.min || name.length > LIMITS.name.max) {
    errors.name = 'invalid_name';
  }
  if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) {
    errors.email = 'invalid_email';
  }
  if (subject.length > LIMITS.subject.max) {
    errors.subject = 'invalid_subject';
  }
  if (message.length < LIMITS.message.min || message.length > LIMITS.message.max) {
    errors.message = 'invalid_message';
  }
  return errors;
}

/** Strip angle brackets and control characters before further processing. */
export function sanitizeText(value, max = 5000) {
  return String(value ?? '')
    .replace(/[<>]/g, '')
    .replace(CONTROL_CHARS_RE, '')
    .trim()
    .slice(0, max);
}

/** Escape HTML entities for safe injection into an HTML email body. */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Build a pre-addressed `mailto:` link. This is the secret-free
 * delivery path: when no transactional email service is configured,
 * the visitor's own mail app composes the message to the site owner,
 * so the owner still receives the comment without any API key.
 * encodeURIComponent (not URLSearchParams) is used so spaces become
 * %20 — some mail clients do not decode '+' inside query strings.
 */
export function buildMailtoUrl({ to, name, email, subject, message }) {
  const subjectLine = `[Portfolio] ${subject ? `${subject} — ` : ''}${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  return `mailto:${to}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
}
