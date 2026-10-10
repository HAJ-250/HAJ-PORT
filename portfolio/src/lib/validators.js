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
