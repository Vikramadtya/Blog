/**
 * Unified server-side blog business logic.
 * Handles filesystem reads, Firestore dynamic metadata, and content processing.
 */

import * as datastore from "@/lib/server/local-datastore";
import { COLLECTIONS, getDocumentById, convertBlogData, incrementFieldREST, createDocumentREST } from "@/lib/server/firebase";
import { siteMetadata } from "../../../site.config.mjs";
import { AppError, ErrorCode } from "@/lib/server/errors";
import { logger } from "@/lib/server/api-utils";

// ─── Utilities ───────────────────────────────────────────────────────────────

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

async function sendSlackNotification(message) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ text: message }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      logger.warn(`Slack notification returned status ${response.status}`);
    }
  } catch (err) {
    logger.error("Slack notification network error", err);
  }
}

// ─── Re-exports for convenience ──────────────────────────────────────────────
export {
  getAllTags,
  getAllBlogs,
  getBlogsByType,
  getBlogBySlug,
  getBlogsByTagId,
  getBlogContent,
  getBlogMetadataById,
  getTagById,
} from "./local-datastore";

// ─── Dynamic Metadata (Firestore) ────────────────────────────────────────────

export async function incrementMetadataField(id, field) {
  if (!siteMetadata.firebaseEnabled) return null;
  await incrementFieldREST(id, field, COLLECTIONS.BLOG_METADATA);
  return getDynamicMetadataById(id);
}

/**
 * Fetches dynamic blog metadata from Firestore.
 */
export async function getDynamicMetadataById(id) {
  if (!id || !siteMetadata.firebaseEnabled) return null;
  try {
    return await getDocumentById(
      id,
      convertBlogData,
      COLLECTIONS.BLOG_METADATA,
      "Blog",
    );
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      `Failed to fetch dynamic metadata for blog: ${id}`,
      ErrorCode.FIREBASE,
      error,
    );
  }
}

/**
 * Adds a new subscription to Firestore and triggers a Slack notification.
 */
export async function addSubscription(email) {
  if (!siteMetadata.firebaseEnabled) {
    logger.info(`Subscription received (Firebase disabled): ${email}`);
    await sendSlackNotification(`🎉 New Subscription (Firebase disabled): ${email}`);
    return "disabled";
  }
  try {
    const docId = await createDocumentREST({
      email,
      subscribedAt: new Date()
    }, COLLECTIONS.SUBSCRIPTIONS);

    await sendSlackNotification(`🎉 New Subscription: ${email}`);
    return docId;
  } catch (error) {
    throw new AppError("Failed to save subscription", ErrorCode.FIREBASE, error);
  }
}

// ─── Content Processing ──────────────────────────────────────────────────────

/**
 * Extracts a table of contents from markdown content.
 */
export function getBlogToc(content) {
  if (!content) return [];

  const headings = [];
  // Support H1-H4, handle optional spaces and common MDX artifacts
  const headingRegex = /^(#{1,4})\s+(.+)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const headingText = match[2].trim();
    
    // Improved slugifier to match github-slugger/rehype-slug
    // 1. Lowercase
    // 2. Remove all non-word characters (except spaces and hyphens)
    // 3. Replace spaces with hyphens
    // 4. Collapse multiple hyphens
    const slug = headingText
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    
    headings.push({ heading: headingText, slug, level });
  }

  return headings;
}

/**
 * Builds a mapping of tag IDs to their associated blog metadata.
 */
export async function getTagToBlogMap(tags) {
  if (!tags || tags.length === 0) return {};

  const entries = await Promise.all(
    tags.map(async (tag) => {
      const blogs = await datastore.getBlogsByTagId(tag.id);
      return [tag.id, blogs];
    }),
  );

  return Object.fromEntries(entries);
}
