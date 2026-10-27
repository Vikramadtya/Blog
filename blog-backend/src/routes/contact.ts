import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getDb } from '../db';
import { supportContacts } from '../db/schema';
import type { Bindings } from '../index';
import { adminAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';
import { notifyDiscord } from '../lib/discord';

const contact = new Hono<{ Bindings: Bindings }>();

// Strict validation schema for the contact payload
const contactSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address').max(255, 'Email is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters long').max(2000, 'Message is too long'),
});

/**
 * POST /contact
 * Securely saves a user support/contact message to the database.
 * Triggers a Discord webhook notification for immediate visibility.
 */
contact.post('/', rateLimit('contact', 3, 60_000), zValidator('json', contactSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { email, message } = c.req.valid('json');

    // 1. Save to Postgres DB
    await db.insert(supportContacts).values({
      id: crypto.randomUUID(),
      email,
      message,
    });

    // 2. Notify (never blocks or fails the request)
    c.executionCtx.waitUntil(
      notifyDiscord(
        c.env.DISCORD_WEBHOOK_URL,
        `🚨 **New Support Request**\n**From:** ${email}\n**Message:**\n> ${message}`,
      ),
    );

    return c.json({ success: true });
  } catch (error: any) {
    console.error("[Contact API] Failed to save contact request:", error);
    return c.json({ error: 'Failed to submit request' }, 500);
  }
});

/**
 * GET /contact
 * Retrieves all support contacts for the admin dashboard.
 */
contact.get('/', adminAuth, async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const allContacts = await db.select().from(supportContacts);
    return c.json({ success: true, data: allContacts });
  } catch (error) {
    console.error("[Contact API] Failed to fetch contacts:", error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

export default contact;
