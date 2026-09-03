import { Hono } from "hono";
import { blogMetrics, subscribers, comments } from "../db/schema";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const db = getDb(c.env);

  try {
    // Total Views and Likes
    const totals = await db
      .select({
        totalViews: sql<number>`sum(${blogMetrics.views})`,
        totalLikes: sql<number>`sum(${blogMetrics.likes})`,
      })
      .from(blogMetrics);

    // Total Subscribers
    const subs = await db
      .select({ count: sql<number>`count(*)` })
      .from(subscribers);
      
    // Total Comments
    const comms = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments);

    // Leaderboard
    const topPosts = await db
      .select()
      .from(blogMetrics)
      .orderBy(sql`${blogMetrics.views} desc`)
      .limit(10);

    return c.json({
      totals: {
        views: totals[0]?.totalViews || 0,
        likes: totals[0]?.totalLikes || 0,
        subscribers: subs[0]?.count || 0,
        comments: comms[0]?.count || 0,
      },
      topPosts,
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
