/**
 * Local filesystem data-access layer (Repository Pattern).
 *
 * Reads blog metadata and tags from the local `blog-datastore` directory
 * and exposes a clean API surface with in-memory caching and indexing.
 */

import fs from "fs/promises";
import path from "path";
import { siteMetadata } from "../../../site.config.mjs";
import { AppError, ErrorCode } from "@/lib/server/errors";
import { logger } from "@/lib/server/api-utils";
import { CACHE_TTL_MS } from "@/lib/constants";

// ─── Configuration ───────────────────────────────────────────────────────────

const DATASTORE_ROOT = path.join(
  process.cwd(),
  siteMetadata.localBlogDatastorePath,
);

// Initial check for datastore root
(async () => {
  try {
    await fs.access(DATASTORE_ROOT);
  } catch {
    logger.error(`Datastore root not found: ${DATASTORE_ROOT}`);
  }
})();

// ─── In-Memory Cache & Indices ───────────────────────────────────────────────

const cache = new Map();
const slugIndex = new Map();
const tagIndex = new Map();
let isIndexWarmed = false;

/**
 * Returns cached data if still valid.
 * @param {string} key
 * @returns {any|undefined}
 */
function getFromCache(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
    return entry.data;
  }
  return undefined;
}

/**
 * Stores data in cache.
 * @param {string} key
 * @param {any} data
 */
function setInCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Rebuilds memory indices for O(1) lookups.
 * @param {BlogMetadata[]} blogs
 */
async function warmIndices(blogs) {
  slugIndex.clear();
  tagIndex.clear();

  const tags = await getAllTags();

  blogs.forEach((blog) => {
    if (blog.slug) slugIndex.set(blog.slug, blog.id);
  });

  tags.forEach((tag) => {
    if (tag.id && Array.isArray(tag.blogs)) {
      tagIndex.set(tag.id, tag.blogs);
    }
  });

  isIndexWarmed = true;
  logger.debug(`Indices warmed: ${slugIndex.size} slugs, ${tagIndex.size} tags`);
}

// ─── Path Helpers ────────────────────────────────────────────────────────────

function resolvePath(...segments) {
  return path.join(DATASTORE_ROOT, ...segments);
}

// ─── Normalization ───────────────────────────────────────────────────────────

/**
 * @param {object} raw
 * @param {string} id
 * @returns {BlogMetadata}
 */
function normalizeBlogMetadata(raw, id) {
  return {
    ...raw,
    id,
    description: raw.summary || "",
    preview: raw.demo?.preview ?? null,
    source: raw.demo?.repository ?? null,
  };
}

// ─── Core Data Access ────────────────────────────────────────────────────────

/**
 * @returns {Promise<Tag[]>}
 */
export async function getAllTags() {
  const CACHE_KEY = "tags:all";
  const cached = getFromCache(CACHE_KEY);
  if (cached) return cached;

  try {
    const tagsFile = resolvePath("tags.json");
    const content = await fs.readFile(tagsFile, "utf8");
    const tags = JSON.parse(content);
    setInCache(CACHE_KEY, tags);
    return tags;
  } catch (error) {
    logger.warn(`Could not read tags.json: ${error.message}`);
    return []; // Return empty array instead of throwing to be more generic
  }
}

/**
 * @param {string} id
 * @returns {Promise<BlogMetadata|null>}
 */
export async function getBlogMetadataById(id) {
  if (!id) return null;

  const CACHE_KEY = `blog:${id}`;
  const cached = getFromCache(CACHE_KEY);
  if (cached) return cached;

  try {
    const metadataFile = resolvePath(id, "metadata.json");
    const content = await fs.readFile(metadataFile, "utf8");
    const raw = JSON.parse(content);
    const normalized = normalizeBlogMetadata(raw, id);
    setInCache(CACHE_KEY, normalized);
    return normalized;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw new AppError(`Read error for blog ${id}`, ErrorCode.FILESYSTEM, error);
  }
}

/**
 * @returns {Promise<BlogMetadata[]>}
 */
export async function getAllBlogs() {
  const CACHE_KEY = "blogs:all";
  const cached = getFromCache(CACHE_KEY);
  if (cached && isIndexWarmed) return cached;

  try {
    const entries = await fs.readdir(DATASTORE_ROOT, { withFileTypes: true });
    const blogIds = entries.filter((e) => e.isDirectory()).map((e) => e.name);

    const blogs = await Promise.all(blogIds.map(getBlogMetadataById));
    const result = blogs.filter(Boolean);

    await warmIndices(result);
    setInCache(CACHE_KEY, result);

    logger.success(`Datastore indexed (${result.length} posts)`);
    return result;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to fetch all blogs", ErrorCode.FILESYSTEM, error);
  }
}

// ─── Indexed Query Helpers ───────────────────────────────────────────────────

/**
 * @param {string} slug
 * @returns {Promise<BlogMetadata|null>}
 */
export async function getBlogBySlug(slug) {
  if (!slug) return null;

  if (!isIndexWarmed) await getAllBlogs();
  const id = slugIndex.get(slug);
  return id ? getBlogMetadataById(id) : null;
}

/**
 * @param {string} tagId
 * @returns {Promise<BlogMetadata[]>}
 */
export async function getBlogsByTagId(tagId) {
  if (!tagId) return [];

  if (!isIndexWarmed) await getAllBlogs();
  const blogIds = tagIndex.get(tagId);
  if (!blogIds) return [];

  const blogs = await Promise.all(blogIds.map(getBlogMetadataById));
  return blogs.filter(Boolean);
}

/**
 * @param {string} [type]
 * @returns {Promise<BlogMetadata[]>}
 */
export async function getBlogsByType(type) {
  const allBlogs = await getAllBlogs();
  return type ? allBlogs.filter((b) => b.type === type) : allBlogs;
}

/**
 * @param {string} id
 * @returns {Promise<string>}
 */
export async function getBlogContent(id) {
  try {
    const filePath = resolvePath(id, "blog.md");
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    const code = error.code === "ENOENT" ? ErrorCode.NOT_FOUND : ErrorCode.FILESYSTEM;
    throw new AppError(`Content read error for ${id}`, code, error);
  }
}

export async function getTagById(id) {
  const tags = await getAllTags();
  return tags.find((t) => t.id === id) || null;
}
