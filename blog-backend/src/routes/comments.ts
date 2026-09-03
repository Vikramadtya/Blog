import { Hono } from "hono";
import { comments } from "../db/schema";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono<{ Bindings: Env }>();

const commentSchema = z.object({
  authorName: z.string().min(1).max(100),
  authorEmail: z.string().email().optional().or(z.literal("")),
  content: z.string().min(1).max(2000),
});

// Get comments for a blog
app.get("/:blogId", async (c) => {
  const db = getDb(c.env);
  const blogId = c.req.param("blogId");

  try {
    const postComments = await db
      .select()
      .from(comments)
      .where(eq(comments.blogId, blogId))
      .orderBy(desc(comments.createdAt));

    return c.json({ comments: postComments });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Post a new comment
app.post(
  "/:blogId",
  zValidator("json", commentSchema),
  async (c) => {
    const db = getDb(c.env);
    const blogId = c.req.param("blogId");
    const body = c.req.valid("json");

    try {
      const id = crypto.randomUUID();
      await db.insert(comments).values({
        id,
        blogId,
        authorName: body.authorName,
        authorEmail: body.authorEmail || null,
        content: body.content,
        approved: true, // auto-approve for now, can be moderated later
      });

      return c.json({ success: true, id }, 201);
    } catch (error: any) {
      return c.json({ error: error.message }, 500);
    }
  }
);

// Delete a comment (for moderation)
app.delete("/:id", async (c) => {
  const db = getDb(c.env);
  const id = c.req.param("id");

  try {
    await db.delete(comments).where(eq(comments.id, id));
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;
