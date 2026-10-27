import { Hono } from 'hono';
import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db';
import { blogMetrics } from '../db/schema';
import type { Bindings } from '../index';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { metrics as otelMetrics, type Counter } from '@opentelemetry/api';
import { rateLimit } from '../middleware/rateLimit';

const metrics = new Hono<{ Bindings: Bindings }>();

type Field = 'views' | 'likes';
const counters: Partial<Record<Field, Counter>> = {};

function counter(field: Field): Counter {
  return (counters[field] ??= otelMetrics
    .getMeter('blog-backend')
    .createCounter(`blog.${field}.total`, { description: `Total number of blog ${field}` }));
}

const paramSchema = z.object({
  blogId: z.string().min(1, 'Blog ID is required').max(255, 'Blog ID is too long'),
});

/** Atomically +1 on a metrics column, creating the row on first use. */
async function increment(databaseUrl: string, blogId: string, field: Field) {
  const db = getDb(databaseUrl);
  counter(field).add(1, { blog_id: blogId });
  const [row] = await db
    .insert(blogMetrics)
    .values({ id: blogId, views: field === 'views' ? 1 : 0, likes: field === 'likes' ? 1 : 0 })
    .onConflictDoUpdate({
      target: blogMetrics.id,
      set: { [field]: sql`${blogMetrics[field]} + 1` },
    })
    .returning();
  return row;
}

/** GET /metrics/:blogId */
metrics.get('/:blogId', zValidator('param', paramSchema), async (c) => {
  const { blogId } = c.req.valid('param');
  try {
    const db = getDb(c.env.DATABASE_URL);
    const [metric] = await db.select().from(blogMetrics).where(eq(blogMetrics.id, blogId)).limit(1);
    return c.json(metric ?? { id: blogId, views: 0, likes: 0 });
  } catch (error) {
    console.error(`[Metrics API] fetch failed for ${blogId}:`, error);
    return c.json({ error: 'Failed to fetch metrics' }, 500);
  }
});

for (const field of ['views', 'likes'] as const) {
  metrics.post(
    `/:blogId/${field}`,
    rateLimit(`metrics-${field}`, field === 'likes' ? 10 : 30, 60_000),
    zValidator('param', paramSchema),
    async (c) => {
      const { blogId } = c.req.valid('param');
      try {
        return c.json(await increment(c.env.DATABASE_URL, blogId, field));
      } catch (error) {
        console.error(`[Metrics API] ${field} increment failed for ${blogId}:`, error);
        return c.json({ error: `Failed to increment ${field}` }, 500);
      }
    },
  );
}

export default metrics;
