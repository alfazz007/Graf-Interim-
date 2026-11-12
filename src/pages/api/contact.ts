import type { APIRoute } from 'astro';

// On-demand (serverless) route on Vercel – the rest of the site is static.
export const prerender = false;

const env = (k: string): string | undefined => (import.meta.env as any)[k] ?? (typeof process !== 'undefined' ? process.env[k] : undefined);
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);

// very small in-memory rate limit (per serverless instance)
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const arr = (hits.get(ip) || []).filter((t) => now - t < win);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let data: Record<string, unknown> = {};
  try { data = await request.json(); } catch { return json(400, { ok: false, error: 'bad_request' }); }

  if (clean(data.website, 200)) return json(200, { ok: true }); // honeypot – silently accept bots

  const name = clean(data.name, 120), email = clean(data.email, 200), company = clean(data.company, 160),
    phone = clean(data.phone, 60), message = clean(data.message, 5000), lang = clean(data.lang, 5) === 'en' ? 'en' : 'de';
  const consent = !!data.consent;
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || message.length < 5 || !consent) return json(422, { ok: false, error: 'invalid' });

  let ip = 'unknown';
  try { ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || clientAddress || 'unknown'; } catch {}
  if (limited(ip)) return json(429, { ok: false, error: 'rate_limited' });

  const key = env('RESEND_API_KEY'), from = env('CONTACT_FROM_EMAIL'), to = env('CONTACT_TO_EMAIL') || 'graf@graf-interim.de';
  if (!key || !from) {
    console.error('Contact form: RESEND_API_KEY / CONTACT_FROM_EMAIL not configured');
    return json(503, { ok: false, error: 'not_configured' });
  }

  const text = [
    `Neue Anfrage über graf-interim.de (${lang.toUpperCase()})`, '',
    `Name:        ${name}`, `Unternehmen: ${company || '–'}`, `E-Mail:      ${email}`, `Telefon:     ${phone || '–'}`, '',
    'Nachricht:', message, '',
    `Datenschutz-Einwilligung: ja (${new Date().toISOString()})`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Anfrage: ${name}${company ? ' – ' + company : ''}`, text }),
    });
    if (!res.ok) { console.error('Resend error', res.status, await res.text()); return json(502, { ok: false, error: 'send_failed' }); }
    return json(200, { ok: true });
  } catch (e) {
    console.error('Resend exception', e);
    return json(502, { ok: false, error: 'send_failed' });
  }
};

export const ALL: APIRoute = () => json(405, { ok: false, error: 'method_not_allowed' });
