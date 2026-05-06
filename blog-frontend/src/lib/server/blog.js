/**
 * Unified server-side blog business logic.
 * Handles filesystem reads, Firestore dynamic metadata, and content processing.
 */

import * as datastore from "@/lib/server/datastore";
import * as firebase from "@/lib/server/firebase";
import { db, COLLECTIONS, getDocumentById, convertBlogData } from "@/lib/server/firebase";
import { doc, updateDoc, increment, collection, addDoc, Timestamp } from "firebase/firestore";
import { siteMetadata } from "../../../site.config";
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
    await fetch(url, {
      method: "POST",
      body: JSON.stringify({ text: message }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    logger.error("Slack notification failed", err);
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
} from "./datastore";

// ─── Dynamic Metadata (Firestore) ────────────────────────────────────────────

export async function incrementMetadataField(id, field) {
  if (!siteMetadata.firebaseEnabled) return null;
  const metadataRef = doc(db, COLLECTIONS.BLOG_METADATA, id);
  await updateDoc(metadataRef, { [field]: increment(1) });
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
    const ref = collection(db, COLLECTIONS.SUBSCRIPTIONS);
    const newDoc = await addDoc(ref, {
      email,
      subscribedAt: Timestamp.now(),
    });

    await sendSlackNotification(`🎉 New Subscription: ${email}`);
    return newDoc.id;
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

  return content
    .split("\n")
    .filter((line) => /^#{1,6}\s+.+/.test(line))
    .map((heading) => ({
      heading,
      slug: heading
        .replace(/#/g, "")
        .trim()
        .toLowerCase()
        .replace(/\?/g, "")
        .replace(/\s+/g, "-"),
    }));
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
