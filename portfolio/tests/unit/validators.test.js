import { describe, expect, it } from 'vitest';
import { buildMailtoUrl } from '@/lib/validators.js';

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
