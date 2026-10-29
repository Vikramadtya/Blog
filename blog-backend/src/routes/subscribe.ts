import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { desc, eq } from 'drizzle-orm';
import { getDb } from '../db';
import { subscribers } from '../db/schema';
import type { Bindings } from '../index';
import { adminAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { notifyDiscord } from '../lib/discord';

const subscribe = new Hono<{ Bindings: Bindings }>();

const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email is too long'),
});

/** POST /subscribe — adds a (normalised) email to the newsletter list. */
subscribe.post('/', rateLimit('subscribe', 5, 60_000), zValidator('json', subscribeSchema), async (c) => {
  const { email } = c.req.valid('json');
  try {
    const db = getDb(c.env.DATABASE_URL);
    await db.insert(subscribers).values({ id: crypto.randomUUID(), email });

    c.executionCtx.waitUntil(
      notifyDiscord(
        c.env.DISCORD_SUBSCRIBE_WEBHOOK_URL || c.env.DISCORD_WEBHOOK_URL,
        `🎉 **New Subscriber!**\n**Email:** ${email}`,
      ),
    );
    return c.json({ success: true });
  } catch (error: any) {
    // 23505 = unique_violation
    if (error?.code === '23505') {
      return c.json({ error: 'Already subscribed' }, 409);
    }
    console.error('[Subscribe API] failed:', error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

/** GET /subscribe — admin only. */
subscribe.get('/', adminAuth, async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    return c.json({ success: true, data: await db.select().from(subscribers).orderBy(desc(subscribers.createdAt)) });
  } catch (error) {
    console.error('[Subscribe API] list failed:', error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

/** HMAC-SHA256(email) keyed with UNSUBSCRIBE_SECRET (or ADMIN_SECRET if unset); the frontend signs the unsubscribe links it emails out. */
export async function unsubscribeToken(email: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const page = (message: string) =>
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Newsletter</title>` +
  `<body style="font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1rem;text-align:center"><p>${message}</p></body>`;

/** GET /subscribe/unsubscribe?email=…&token=… — one-click unsubscribe from newsletter emails. */
subscribe.get('/unsubscribe', rateLimit('unsubscribe', 10, 60_000), async (c) => {
  const email = (c.req.query('email') ?? '').trim().toLowerCase();
  const token = c.req.query('token') ?? '';
  const secret = c.env.UNSUBSCRIBE_SECRET || c.env.ADMIN_SECRET;
  if (!email || !secret) return c.html(page('Invalid unsubscribe link.'), 400);

  const expected = await unsubscribeToken(email, secret);
  // Compare hashes of both values so timing doesn't leak the expected token
  const [a, b] = await Promise.all(
    [expected, token].map(async (v) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))),
  );
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  if (diff !== 0) return c.html(page('Invalid unsubscribe link.'), 400);

  try {
    await getDb(c.env.DATABASE_URL).delete(subscribers).where(eq(subscribers.email, email));
    return c.html(page("You've been unsubscribed. Sorry to see you go!"));
  } catch (error) {
    console.error('[Subscribe API] unsubscribe failed:', error);
    return c.html(page('Something went wrong. Please try again later.'), 500);
  }
});

export default subscribe;
