import { NextResponse } from 'next/server';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;

  // Honeypot: hidden field no human can see. Bots fill it — accept silently, send nothing.
  if (asString(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name);
  const email = asString(body.email);
  const service = asString(body.service) || 'General inquiry';
  const message = asString(body.message);

  if (!name || !message || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: 'Please include your name, a valid email address, and a message.' },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? 'nm261897@gmail.com';

  // Not configured yet — say so instead of pretending the message was sent.
  if (!apiKey || !from) {
    return NextResponse.json(
      { error: 'The contact form is not connected yet.', fallbackEmail: to },
      { status: 503 },
    );
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New project inquiry from ${name} — ${service}`,
        text: `Name: ${name}\nEmail: ${email}\nService: ${service}\n\n${message}`,
      }),
    });

    if (!response.ok) {
      console.error('Contact form delivery failed:', response.status, await response.text());
      return NextResponse.json(
        { error: 'The message could not be delivered right now.', fallbackEmail: to },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error('Contact form delivery error:', error);
    return NextResponse.json(
      { error: 'The message could not be delivered right now.', fallbackEmail: to },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
