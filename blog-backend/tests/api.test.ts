import { describe, expect, it } from 'vitest';
import { Hono } from 'hono';
import { app } from '../src/index';
import { adminAuth } from '../src/middleware/auth';
import { rateLimit } from '../src/middleware/rateLimit';

const env = { ALLOWED_ORIGIN: 'http://localhost:3000', ADMIN_SECRET: 's3cret' };

describe('app', () => {
  it('serves /health', async () => {
    const res = await app.request('/health', {}, env);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });

  it('only allows the configured CORS origin', async () => {
    const res = await app.request('/health', { headers: { Origin: 'http://localhost:3000' } }, env);
    expect(res.headers.get('access-control-allow-origin')).toBe('http://localhost:3000');
  });

  it('rejects a filled honeypot before touching the database', async () => {
    const res = await app.request(
      '/comments/some-post',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: 'bot', content: 'spam', website: 'http://spam' }),
      },
      env,
    );
    expect(res.status).toBe(400);
  });
});

describe('adminAuth', () => {
  const guarded = new Hono<{ Bindings: typeof env }>();
  guarded.get('/x', adminAuth, (c) => c.json({ ok: true }));

  it('rejects missing and wrong tokens', async () => {
    expect((await guarded.request('/x', {}, env)).status).toBe(401);
    const bad = await guarded.request('/x', { headers: { Authorization: 'Bearer nope' } }, env);
    expect(bad.status).toBe(401);
  });

  it('accepts the right token', async () => {
    const ok = await guarded.request('/x', { headers: { Authorization: 'Bearer s3cret' } }, env);
    expect(ok.status).toBe(200);
  });

  it('rejects everything when no secret is configured', async () => {
    const res = await guarded.request('/x', { headers: { Authorization: 'Bearer ' } }, {});
    expect(res.status).toBe(401);
  });
});

describe('rateLimit', () => {
  it('returns 429 once the limit is exceeded', async () => {
    const limited = new Hono();
    limited.get('/x', rateLimit('t', 2, 60_000), (c) => c.json({ ok: true }));
    const statuses = [];
    for (let i = 0; i < 3; i++) statuses.push((await limited.request('/x')).status);
    expect(statuses).toEqual([200, 200, 429]);
  });
});
