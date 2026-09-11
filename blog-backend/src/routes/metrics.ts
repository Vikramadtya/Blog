import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db';
import { blogMetrics } from '../db/schema';
import type { Bindings } from '../index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { metrics as otelMetrics } from '@opentelemetry/api';

const metrics = new Hono<{ Bindings: Bindings }>();

// Create OpenTelemetry counters
const meter = otelMetrics.getMeter('blog-backend');
const viewsCounter = meter.createCounter('blog.views.total', {
  description: 'Total number of blog views',
});
const likesCounter = meter.createCounter('blog.likes.total', {
  description: 'Total number of blog likes',
});

// Strict validation schema for the blogId parameter
const paramSchema = z.object({
  blogId: z.string().min(1, 'Blog ID is required').max(255, 'Blog ID is too long'),
});

/**
 * GET /metrics/:blogId
 */
metrics.get('/:blogId', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');
    
    console.log(`[Metrics API] Fetching metrics for blogId: ${blogId}`);
    const metric = await db.select().from(blogMetrics).where(eq(blogMetrics.id, blogId)).limit(1);
    
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
 */
metrics.post('/:blogId/views', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');

    // Emit OTel Metric
    viewsCounter.add(1, { blog_id: blogId });
    console.log(`[Metrics API] Recorded 1 view for blogId: ${blogId}`);

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
 */
metrics.post('/:blogId/likes', zValidator('param', paramSchema), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid('param');

    // Emit OTel Metric
    likesCounter.add(1, { blog_id: blogId });
    console.log(`[Metrics API] Recorded 1 like for blogId: ${blogId}`);

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
