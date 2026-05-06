/**
 * Local filesystem data-access layer (Repository Pattern).
 *
 * Reads blog metadata and tags from the local `blog-datastore` directory
 * and exposes a clean API surface with in-memory caching.
 *
 * Design decisions:
 * - Cache-Aside pattern: check cache → miss → read disk → populate → return
 * - TTL-based expiry: 5 min in production, 10s in development
 * - Single normalization function for consistent data shape
 * - All errors wrapped in AppError with FILESYSTEM / NOT_FOUND codes
 */

import fs from "fs/promises";
import path from "path";
import { siteMetadata } from "../../../../site.config";
import { AppError, ErrorCode } from "./errors";
import { logger } from "./api-utils";

// ─── Configuration ───────────────────────────────────────────────────────────

const DATASTORE_ROOT = path.join(
  process.cwd(),
  siteMetadata.localBlogDatastorePath,
);

const CACHE_TTL_MS =
  process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 10 * 1000;

// ─── Cache Infrastructure ────────────────────────────────────────────────────

/**
 * Simple in-memory cache entry with TTL tracking.
 * @template T
 * @typedef {{ data: T, timestamp: number }} CacheEntry
 */

/** @type {Map<string, CacheEntry<any>>} */
const cache = new Map();

/**
 * Returns cached data if still valid, otherwise `undefined`.
 * @param {string} key
 * @returns {any|undefined}
 */
function getFromCache(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  if (entry) {
    cache.delete(key);
  }
  return undefined;
}

/**
 * Stores data in cache with the current timestamp.
 * @param {string} key
 * @param {any} data
 */
function setInCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Path Helpers ────────────────────────────────────────────────────────────

/**
 * Resolves a path relative to the datastore root.
 * @param {...string} segments - Path segments to join.
 * @returns {string} Absolute file path.
 */
function resolvePath(...segments) {
  return path.join(DATASTORE_ROOT, ...segments);
}

// ─── Normalization ───────────────────────────────────────────────────────────

/**
 * Normalizes raw blog metadata from disk into the shape the frontend expects.
 *
 * Maps `summary` → `description` and flattens the `demo` object,
 * consistent with the Firestore converter (converter.js).
 *
 * @param {object} raw - The raw JSON from metadata.json.
 * @param {string} id - The blog directory name (UUID).
 * @returns {object} Normalized blog metadata.
 */
function normalizeBlogMetadata(raw, id) {
  return {
    ...raw,
    id,
    description: raw.summary,
    preview: raw.demo?.preview ?? null,
    source: raw.demo?.repository ?? null,
  };
}

// ─── Core Data Access ────────────────────────────────────────────────────────

/**
 * Reads and returns all tags from the tags.json file.
 * Results are cached.
 *
 * @returns {Promise<Array<object>>}
 * @throws {AppError} With FILESYSTEM code on read/parse failures.
 */
export async function getAllTags() {
  const CACHE_KEY = "tags:all";
  const cached = getFromCache(CACHE_KEY);
  if (cached) {
    logger.debug("Tags loaded from cache");
    return cached;
  }

  try {
    const tagsFile = resolvePath("tags.json");
    const content = await fs.readFile(tagsFile, "utf8");
    const tags = JSON.parse(content);
    setInCache(CACHE_KEY, tags);
    logger.success(`Tags loaded from disk (${tags.length} entries)`);
    return tags;
  } catch (error) {
    throw new AppError(
      "Failed to read tags.json from the local datastore",
      ErrorCode.FILESYSTEM,
      error,
    );
  }
}

/**
 * Fetches a single tag by its ID from the local JSON store.
 *
 * @param {string} id - The tag ID.
 * @returns {Promise<object|null>} The tag object, or null if not found.
 */
export async function getTagById(id) {
  const tags = await getAllTags();
  return tags.find((t) => t.id === id) || null;
}

/**
 * Reads metadata for a specific blog ID.
 * Results are cached per-ID.
 *
 * @param {string} id - The blog UUID.
 * @returns {Promise<object|null>} Normalized metadata, or null if not found.
 * @throws {AppError} With FILESYSTEM code on read failures (not "file not found").
 */
export async function getBlogMetadataById(id) {
  if (!id) {
    logger.warn("getBlogMetadataById called with no ID");
    return null;
  }

  const CACHE_KEY = `blog:${id}`;
  const cached = getFromCache(CACHE_KEY);
  if (cached) {
    return cached;
  }

  try {
    const metadataFile = resolvePath(id, "metadata.json");
    const content = await fs.readFile(metadataFile, "utf8");
    const raw = JSON.parse(content);
    const normalized = normalizeBlogMetadata(raw, id);
    setInCache(CACHE_KEY, normalized);
    return normalized;
  } catch (error) {
    // File-not-found is expected for missing IDs — return null
    if (error.code === "ENOENT") {
      logger.warn(`Blog metadata not found for ID: ${id}`);
      return null;
    }
    throw new AppError(
      `Failed to read metadata for blog: ${id}`,
      ErrorCode.FILESYSTEM,
      error,
    );
  }
}

/**
 * Fetches all blog metadata by resolving IDs from the "all" tag.
 * Falls back to scanning the directory if the "all" tag is absent.
 *
 * @returns {Promise<Array<object>>}
 * @throws {AppError} With FILESYSTEM code on failures.
 */
export async function getAllBlogs() {
  const CACHE_KEY = "blogs:all";
  const cached = getFromCache(CACHE_KEY);
  if (cached) {
    logger.debug("All blogs loaded from cache");
    return cached;
  }

  try {
    const tags = await getAllTags();
    const allTag = tags.find((t) => t.name === "all");

    let blogIds;
    if (allTag && Array.isArray(allTag.blogs)) {
      blogIds = allTag.blogs;
    } else {
      // Fallback: scan directory for blog UUID folders
      logger.warn('No "all" tag found — falling back to directory scan');
      const entries = await fs.readdir(DATASTORE_ROOT, { withFileTypes: true });
      blogIds = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    }

    const blogs = await Promise.all(blogIds.map(getBlogMetadataById));
    const result = blogs.filter(Boolean);
    setInCache(CACHE_KEY, result);
    logger.success(`All blogs loaded (${result.length} entries)`);
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch all blogs",
      ErrorCode.FILESYSTEM,
      error,
    );
  }
}

/**
 * Fetches blogs by a specific filter.
 * Loads all blogs once (cached), then filters in memory.
 *
 * @param {string} key - The field to filter by (e.g., 'slug', 'type').
 * @param {any} value - The value (or array of values) to match.
 * @returns {Promise<Array<object>>}
 */
export async function getBlogsByFilter(key, value) {
  const allBlogs = await getAllBlogs();
  if (Array.isArray(value)) {
    return allBlogs.filter((blog) => value.includes(blog[key]));
  }
  return allBlogs.filter((blog) => blog[key] === value);
}

/**
 * Fetches blogs associated with a specific tag ID.
 *
 * @param {string} tagId - The ID of the tag.
 * @returns {Promise<Array<object>>}
 */
export async function getBlogsByTagId(tagId) {
  const tags = await getAllTags();
  const tag = tags.find((t) => t.id === tagId);

  if (!tag || !Array.isArray(tag.blogs)) {
    logger.warn(`Tag not found or has no blogs: ${tagId}`);
    return [];
  }

  const blogs = await Promise.all(
    tag.blogs.map((id) => getBlogMetadataById(id)),
  );
  return blogs.filter(Boolean);
}

/**
 * Reads blog markdown content from the local filesystem.
 * This is a server-only function — must not be called from client components.
 *
 * @param {string} id - The blog UUID.
 * @returns {Promise<string>} The raw markdown content.
 * @throws {AppError} With NOT_FOUND or FILESYSTEM code.
 */
export async function getBlogContent(id) {
  if (!id) {
    throw new AppError(
      "getBlogContent requires a blog ID",
      ErrorCode.VALIDATION,
    );
  }

  try {
    const filePath = resolvePath(id, "blog.md");
    const content = await fs.readFile(filePath, "utf8");
    logger.success(`Blog content loaded for: ${id}`);
    return content;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new AppError(
        `Blog content not found for ID: ${id}`,
        ErrorCode.NOT_FOUND,
        error,
      );
    }
    throw new AppError(
      `Failed to read blog content for ID: ${id}`,
      ErrorCode.FILESYSTEM,
      error,
    );
  }
}

// ─── Convenience Query Helpers ───────────────────────────────────────────────

/**
 * Fetches blogs filtered by type (e.g., "blog", "snippet").
 * Returns all blogs when type is undefined.
 *
 * @param {string} [type] - The blog type to filter by.
 * @returns {Promise<Array<object>>}
 */
export async function getBlogsByType(type) {
  if (!type) {
    return getAllBlogs();
  }
  return getBlogsByFilter("type", type);
}

/**
 * Fetches a single blog by its URL slug.
 *
 * @param {string} slug - The blog slug.
 * @returns {Promise<object|null>} The blog metadata, or null if not found.
 */
export async function getBlogBySlug(slug) {
  if (!slug) {
    logger.warn("getBlogBySlug called with no slug");
    return null;
  }
  const results = await getBlogsByFilter("slug", slug);
  return results[0] ?? null;
}

