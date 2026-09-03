import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db';
import { blogMetrics } from '../db/schema';
import type { Bindings } from '../index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';

const metrics = new Hono<{ Bindings: Bindings }>();

// Strict validation schema for the blogId parameter
const paramSchema = z.object({
  blogId: z.string().min(1, 'Blog ID is required').max(255, 'Blog ID is too long'),
});

/**
 * GET /metrics/:blogId
 * Fetches the current view and like counts for a specific blog post.
 * If the blog post does not exist in the DB yet, returns 0 for both metrics.
 */
metrics.get('/:blogId', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');
    
    const metric = await db.select().from(blogMetrics).where(eq(blogMetrics.id, blogId)).limit(1);
    
    // Return default 0 metrics if not found
    if (metric.length === 0) {
      return c.json({ id: blogId, views: 0, likes: 0 });
    }
    
    return c.json(metric[0]);
  } catch (error: any) {
    console.error(`[Metrics API] Failed to fetch metrics for blogId ${c.req.param('blogId')}:`, error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

/**
 * POST /metrics/:blogId/views
 * Atomically increments the view count for a specific blog post.
 * Uses an UPSERT (ON CONFLICT DO UPDATE) to avoid race conditions.
 */
metrics.post('/:blogId/views', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');

    const metric = await db.insert(blogMetrics)
      .values({ id: blogId, views: 1, likes: 0 })
      .onConflictDoUpdate({
        target: blogMetrics.id,
        set: { views: sql`${blogMetrics.views} + 1` }
      })
      .returning();

    return c.json(metric[0]);
  } catch (error: any) {
    console.error(`[Metrics API] Failed to increment views for blogId ${c.req.param('blogId')}:`, error);
    return c.json({ error: 'Failed to increment views' }, 500);
  }
});

/**
 * POST /metrics/:blogId/likes
 * Atomically increments the like count for a specific blog post.
 * Uses an UPSERT (ON CONFLICT DO UPDATE) to avoid race conditions.
 */
metrics.post('/:blogId/likes', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');

    const metric = await db.insert(blogMetrics)
      .values({ id: blogId, views: 0, likes: 1 })
      .onConflictDoUpdate({
        target: blogMetrics.id,
        set: { likes: sql`${blogMetrics.likes} + 1` }
      })
      .returning();

    return c.json(metric[0]);
  } catch (error: any) {
    console.error(`[Metrics API] Failed to increment likes for blogId ${c.req.param('blogId')}:`, error);
    return c.json({ error: 'Failed to increment likes' }, 500);
  }
});

export default metrics;
