import { Hono } from "hono";
import type { Bindings } from '../index';
import { adminAuth } from '../middleware/auth';
import { blogMetrics, subscribers, comments } from "../db/schema";
import { getDb } from "../db";
import { sql, desc } from "drizzle-orm";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", adminAuth, async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);

    const [totals, subs, comms, topPosts] = await Promise.all([
      db
        .select({
          totalViews: sql<number>`coalesce(sum(${blogMetrics.views}), 0)::int`,
          totalLikes: sql<number>`coalesce(sum(${blogMetrics.likes}), 0)::int`,
        })
        .from(blogMetrics),
      db.select({ count: sql<number>`count(*)::int` }).from(subscribers),
      db.select({ count: sql<number>`count(*)::int` }).from(comments),
      db.select().from(blogMetrics).orderBy(desc(blogMetrics.views)).limit(10),
    ]);

    return c.json({
      totals: {
        views: totals[0]?.totalViews ?? 0,
        likes: totals[0]?.totalLikes ?? 0,
        subscribers: subs[0]?.count ?? 0,
        comments: comms[0]?.count ?? 0,
      },
      topPosts,
    });
  } catch (error) {
    console.error("[Analytics API] failed:", error);
    return c.json({ error: 'Failed to load analytics' }, 500);
  }
});

export default app;
