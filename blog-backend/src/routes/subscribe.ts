import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getDb } from '../db';
import { subscribers } from '../db/schema';
import type { Bindings } from '../index';

const subscribe = new Hono<{ Bindings: Bindings }>();

// Strict validation schema for the subscriber payload
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address').max(255, 'Email is too long'),
});

/**
 * POST /subscribe
 * Securely adds a new email to the newsletter subscribers table.
 * Enforces email uniqueness and triggers a Discord webhook notification.
 */
subscribe.post('/', zValidator('json', subscribeSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email } = c.req.valid('json');

    // 1. Insert into Postgres DB
    await db.insert(subscribers).values({ id: crypto.randomUUID(), email });
    
    // 2. Send Discord Notification
    const discordWebhookUrl = c.env.DISCORD_SUBSCRIBE_WEBHOOK_URL || c.env.DISCORD_WEBHOOK_URL;
    if (discordWebhookUrl) {
      await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🎉 **New Subscriber!**\n**Email:** ${email}`
        })
      }).catch(err => console.error("[Subscribe API] Discord Webhook Failed:", err));
    }

    return c.json({ success: true });
  } catch (error: any) {
    // 23505 is the Postgres error code for unique_violation
    if (error.code === '23505') {
      console.warn(`[Subscribe API] Duplicate subscription attempt for: ${c.req.valid('json').email}`);
      return c.json({ error: 'Already subscribed' }, 400);
    }
    
    console.error("[Subscribe API] Failed to subscribe user:", error);
    return c.json({ error: 'Failed to subscribe' }, 500);
  }
});

/**
 * GET /subscribe
 * Retrieves all subscribers for the admin dashboard.
 */
subscribe.get('/', async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const allSubscribers = await db.select().from(subscribers);
    return c.json({ success: true, data: allSubscribers });
  } catch (error) {
    console.error("[Subscribe API] Failed to fetch subscribers:", error);
    return c.json({ error: 'Failed to fetch subscribers' }, 500);
  }
});

export default subscribe;
