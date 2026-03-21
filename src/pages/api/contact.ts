// src/pages/api/contact.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { validateContactForm, buildEmailHtml } from '../../lib/contact';

export const POST: APIRoute = async ({ request }) => {
  const headers = { 'Content-Type': 'application/json' };

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), { status: 400, headers });
  }

  // Honeypot check
  if (body.website) {
    return new Response(JSON.stringify({ success: false, error: 'Bot detected' }), { status: 400, headers });
  }

  const validation = validateContactForm(body);
  if (!validation.valid) {
    return new Response(JSON.stringify({ success: false, error: validation.error }), { status: 400, headers });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  const toEmail = import.meta.env.TO_EMAIL;

  try {
    await resend.emails.send({
      from: 'Kayablue Website <noreply@kayablue.nl>',
      to: [toEmail],
      subject: `New booking request from ${body.name}`,
      html: buildEmailHtml({
        name: body.name,
        email: body.email,
        message: body.message,
        phone: body.phone,
        preferredDate: body.preferredDate,
      }),
    });
  } catch (err) {
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send email' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
};
