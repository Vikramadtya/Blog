/**
 * Blog data route service — business logic for /api/blog/data.
 *
 * All read queries are routed through localDatastore (the single source
 * of truth for static blog metadata). Firebase is used only for
 * dynamic metadata mutations (likes/views increment).
 */

import {
  getAllBlogs,
  getBlogMetadataById,
  getBlogsByFilter,
  getBlogsByTagId,
} from "../../lib/localDatastore";
import { logger } from "../../lib/api-utils";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import datastore from "../../lib/datastore-info";
import { getDocumentById } from "../../lib/commons";
import { AppError, ErrorCode } from "../../lib/errors";

/**
 * Fetches blogs from the local filesystem with flexible filtering.
 *
 * Unified query interface — all filter types are handled here so the
 * route handler stays thin.
 *
 * @param {object} [filter] - Optional filter object.
 * @param {string} filter.key - The field to filter by ("id", "slug", "type", "tag").
 * @param {any|Array<any>} filter.value - The value or array of values to match.
 * @returns {Promise<Array<object>>} - A promise resolving to an array of blogs.
 */
export async function getBlogs(filter) {
  // No filter → return all blogs
  if (!filter || !filter.key || filter.value === undefined) {
    logger.info("Fetching all blogs");
    return getAllBlogs();
  }

  const { key, value } = filter;
  logger.info(`Fetching blogs where '${key}' is ${JSON.stringify(value)}`);

  switch (key) {
    case "id": {
      const ids = Array.isArray(value) ? value : [value];
      const blogs = await Promise.all(ids.map(getBlogMetadataById));
      return blogs.filter(Boolean);
    }

    case "tag":
      return getBlogsByTagId(value);

    default:
      // Handles "slug", "type", and any other field-based filter
      return getBlogsByFilter(key, value);
  }
}

/**
 * Increments a numeric field in a blog's Firestore metadata.
 *
 * Note: This is the only operation that still uses Firebase, since
 * likes/views are dynamic counters that can't live on the filesystem.
 *
 * @param {string} id - The ID of the blog.
 * @param {string} field - The field to increment ("likes" or "views").
 * @returns {Promise<object>} - The updated metadata from Firestore.
 */
export async function incrementMetadataField(id, field) {
  const metadataRef = doc(db, datastore.blog.name, id);
  await updateDoc(metadataRef, { [field]: increment(1) });
  return getDocumentById(
    id,
    datastore.blog.converter,
    datastore.blog.name,
    datastore.blog.type,
  );
}

/**
 * Fetches dynamic blog metadata (likes, views) from Firestore.
 *
 * @param {string} id - The blog ID.
 * @returns {Promise<object|null>} The dynamic metadata, or null if not found.
 * @throws {AppError} With FIREBASE code on failure.
 */
export async function getDynamicMetadataById(id) {
  if (!id) return null;

  try {
    return await getDocumentById(
      id,
      datastore.blog.converter,
      datastore.blog.name,
      datastore.blog.type,
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
