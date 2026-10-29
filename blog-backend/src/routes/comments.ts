import { Hono } from "hono";
import { comments } from "../db/schema";
import { getDb } from "../db";
import { and, eq, desc } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import type { Bindings } from '../index';
import { adminAuth } from '../middleware/auth';
import { rateLimit } from '../middleware/rateLimit';

const app = new Hono<{ Bindings: Bindings }>();

const blogIdParam = z.object({ blogId: z.string().min(1).max(255) });

const COMMENTS_PAGE_SIZE = 200;

const commentSchema = z.object({
  authorName: z.string().trim().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().trim().min(1).max(2000),
  // Honeypot: real users never fill this in (the input is hidden in the form)
  website: z.string().max(0).optional(),
});

// Public: approved comments only, and never expose commenter emails.
app.get("/:blogId", zValidator("param", blogIdParam), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    const { blogId } = c.req.valid("param");
    const postComments = await db
      .select({
        id: comments.id,
        blogId: comments.blogId,
        authorName: comments.authorName,
        content: comments.content,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .where(and(eq(comments.blogId, blogId), eq(comments.approved, true)))
      .orderBy(desc(comments.createdAt))
      .limit(COMMENTS_PAGE_SIZE);

    return c.json({ comments: postComments });
  } catch (error) {
    console.error("[Comments API] list failed:", error);
    return c.json({ error: 'Failed to load comments' }, 500);
  }
});

app.post(
  "/:blogId",
  rateLimit('comment', 5, 60_000),
  zValidator("param", z.object({ blogId: z.string().uuid() })),
  zValidator("json", commentSchema),
  async (c) => {
    try {
      const db = getDb(c.env.DATABASE_URL);
      const { blogId } = c.req.valid("param");
      const body = c.req.valid("json");

      const id = crypto.randomUUID();
      await db.insert(comments).values({
        id,
        blogId,
        authorName: body.authorName,
        authorEmail: body.authorEmail || null,
        content: body.content,
        approved: true, // auto-approve for now; flip to false to moderate
      });

      return c.json({ success: true, id }, 201);
    } catch (error) {
      console.error("[Comments API] create failed:", error);
      return c.json({ error: 'Failed to post comment' }, 500);
    }
  }
);

// Moderation: delete by comment id (admin only)
app.delete("/:id", adminAuth, zValidator("param", z.object({ id: z.string().min(1).max(255) })), async (c) => {
  try {
    const db = getDb(c.env.DATABASE_URL);
    await db.delete(comments).where(eq(comments.id, c.req.valid("param").id));
    return c.json({ success: true });
  } catch (error) {
    console.error("[Comments API] delete failed:", error);
    return c.json({ error: 'Failed to delete comment' }, 500);
  }
});

export default app;
