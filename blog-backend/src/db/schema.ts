import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const blogMetrics = pgTable("blog_metrics", {
  id: text("id").primaryKey(),
  views: integer("views").default(0).notNull(),
  likes: integer("likes").default(0).notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const supportContacts = pgTable("support_contacts", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  blogId: text("blog_id").notNull(),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  approved: boolean("approved").default(true).notNull(),
});
