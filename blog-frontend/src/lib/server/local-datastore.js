/**
 * Local filesystem data-access layer.
 * 
 * Provides a clean API for reading blog content and metadata with in-memory caching.
 * Logic is designed to be "zero-maintenance" - associations are built dynamically.
 */

import fs from "fs/promises";
import path from "path";
import { siteMetadata } from "../../../site.config.mjs";
import { AppError, ErrorCode } from "@/lib/server/errors";
import { logger } from "@/lib/server/api-utils";
import { CACHE_TTL_MS } from "@/lib/constants";

// ─── Cache & State ───────────────────────────────────────────────────────────
const cache = new Map();
const slugIndex = new Map();
const tagIndex = new Map();
let isWarmed = false;

const root = path.join(process.cwd(), siteMetadata.localBlogDatastorePath);

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data;
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// ─── Normalization ───────────────────────────────────────────────────────────

function normalize(raw, id) {
  const now = new Date().toISOString();
  return {
    id,
    title: raw.title || "Untitled Post",
    summary: raw.summary || raw.description || "",
    description: raw.description || raw.summary || "",
    createdAt: raw.createdAt || now,
    updatedAt: raw.updatedAt || raw.createdAt || now,
    slug: raw.slug || id,
    type: raw.type || "blog",
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    previewImageSrc: raw.previewImageSrc || "/images/blog/placeholder.jpg",
    likes: raw.likes || 0,
    views: raw.views || 0,
    blogNumber: raw.blogNumber || 0,
    demo: {
      preview: raw.demo?.preview || null,
      repository: raw.demo?.repository || null,
    },
  };
}

const resolve = (...segments) => path.join(root, ...segments);

// ─── Public API ────────────────────────────────────────────────────────────

export async function getAllTags() {
  const key = "tags:all";
  const cached = getCached(key);
  if (cached) return cached;

  try {
    const content = await fs.readFile(resolve("tags.json"), "utf8");
    const tags = JSON.parse(content);
    setCache(key, tags);
    return tags;
  } catch (error) {
    return [];
  }
}

export async function getBlogMetadataById(id) {
  if (!id) return null;
  const key = `blog:${id}`;
  const cached = getCached(key);
  if (cached) return cached;

  try {
    const content = await fs.readFile(resolve(id, "metadata.json"), "utf8");
    const raw = JSON.parse(content);
    const data = normalize(raw, id);
    
    // Hydrate Tags
    const tagRegistry = await getAllTags();
    data.tags = data.tags.map(tagName => {
      const tag = tagRegistry.find(t => t.name.toLowerCase() === tagName.toLowerCase());
      return tag || { id: tagName, name: tagName, color: "gray" };
    });

    setCache(key, data);
    return data;
  } catch {
    return null;
  }
}

export async function getAllBlogs() {
  const key = "blogs:all";
  const cached = getCached(key);
  if (cached && isWarmed) return cached;

  try {
    const entries = await fs.readdir(root, { withFileTypes: true });
    const ids = entries
      .filter(e => e.isDirectory() && !e.name.startsWith("."))
      .map(e => e.name);

    const blogs = (await Promise.all(ids.map(id => getBlogMetadataById(id))))
      .filter(Boolean)
      // Hide drafts in production
      .filter(b => process.env.NODE_ENV === "development" || b.publish !== false)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Dynamic Indexing
    slugIndex.clear();
    tagIndex.clear();
    const tagRegistry = await getAllTags();
    const ALL_TAG_ID = "00000000-0000-0000-0000-000000000000";

    tagRegistry.forEach(t => tagIndex.set(t.id, []));
    if (!tagIndex.has(ALL_TAG_ID)) tagIndex.set(ALL_TAG_ID, []);

    blogs.forEach(blog => {
      if (blog.slug) slugIndex.set(blog.slug, blog.id);
      
      blog.tags.forEach(tag => {
        if (tagIndex.has(tag.id)) tagIndex.get(tag.id).push(blog.id);
      });
      tagIndex.get(ALL_TAG_ID).push(blog.id);
    });

    isWarmed = true;
    setCache(key, blogs);
    logger.success(`[Datastore] Synchronized ${blogs.length} posts`);
    return blogs;
  } catch (err) {
    throw new AppError("Failed to sync blog datastore", ErrorCode.FILESYSTEM, err);
  }
}

export async function getBlogBySlug(slug) {
  if (!isWarmed) await getAllBlogs();
  const id = slugIndex.get(slug);
  return id ? getBlogMetadataById(id) : null;
}

export async function getBlogsByTagId(tagId) {
  if (!isWarmed) await getAllBlogs();
  const ids = tagIndex.get(tagId) || [];
  return (await Promise.all(ids.map(id => getBlogMetadataById(id)))).filter(Boolean);
}

export async function getBlogsByType(type) {
  const all = await getAllBlogs();
  return type ? all.filter(b => b.type === type) : all;
}

export async function getBlogContent(id) {
  try {
    return await fs.readFile(resolve(id, "blog.md"), "utf8");
  } catch (err) {
    throw new AppError(`Content missing for ${id}`, ErrorCode.NOT_FOUND, err);
  }
}

export async function getTagById(id) {
  const tags = await getAllTags();
  return tags.find(t => t.id === id) || null;
}
