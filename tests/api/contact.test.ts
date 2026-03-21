// tests/api/contact.test.ts
import { describe, it, expect } from 'vitest';
import { validateContactForm, buildEmailHtml } from '../../src/lib/contact';

describe('validateContactForm', () => {
  it('returns error when name is missing', () => {
    const result = validateContactForm({ name: '', email: 'a@b.com', message: 'hi' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/name/i);
  });

  it('returns error when email is invalid', () => {
    const result = validateContactForm({ name: 'Jan', email: 'notanemail', message: 'hi' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/email/i);
  });

  it('returns error when message is missing', () => {
    const result = validateContactForm({ name: 'Jan', email: 'a@b.com', message: '' });
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/message/i);
  });

  it('returns valid for correct input', () => {
    const result = validateContactForm({ name: 'Jan', email: 'jan@kayablue.nl', message: 'Hello!' });
    expect(result.valid).toBe(true);
  });
});

describe('buildEmailHtml', () => {
  it('includes name, email, and message in output', () => {
    const html = buildEmailHtml({
      name: 'Jan',
      email: 'jan@kayablue.nl',
      message: 'Hello!',
      phone: '0612345678',
      preferredDate: '2026-04-15',
    });
    expect(html).toContain('Jan');
    expect(html).toContain('jan@kayablue.nl');
    expect(html).toContain('Hello!');
    expect(html).toContain('0612345678');
    expect(html).toContain('2026-04-15');
  });
});
