// src/lib/contact.ts
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
  preferredDate?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  if (!data.name?.trim()) return { valid: false, error: 'Name is required' };
  if (!data.email?.trim() || !EMAIL_REGEX.test(data.email)) return { valid: false, error: 'A valid email is required' };
  if (!data.message?.trim()) return { valid: false, error: 'Message is required' };
  return { valid: true };
}

export function buildEmailHtml(data: ContactFormData): string {
  return `
    <h2>New booking request from Kayablue.nl</h2>
    <table>
      <tr><td><strong>Name</strong></td><td>${data.name}</td></tr>
      <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
      ${data.phone ? `<tr><td><strong>Phone</strong></td><td>${data.phone}</td></tr>` : ''}
      ${data.preferredDate ? `<tr><td><strong>Preferred date</strong></td><td>${data.preferredDate}</td></tr>` : ''}
      <tr><td><strong>Message</strong></td><td>${data.message}</td></tr>
    </table>
  `;
}
