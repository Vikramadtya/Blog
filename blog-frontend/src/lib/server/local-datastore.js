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

class BlogService {
  constructor() {
    this.root = path.join(process.cwd(), siteMetadata.localBlogDatastorePath);
    this.cache = new Map();
    this.slugIndex = new Map();
    this.tagIndex = new Map();
    this.isWarmed = false;
  }

  // ─── Cache Management ──────────────────────────────────────────────────────

  _getCached(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data;
    }
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // ─── Normalization & Validation ────────────────────────────────────────────

  /**
   * Cleans and fills missing metadata fields with defaults.
   */
  _normalize(raw, id) {
    const now = new Date().toISOString();
    return {
      id,
      title: raw.title || "Untitled Post",
      summary: raw.summary || raw.description || "No summary available.",
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

  // ─── Path Helpers ──────────────────────────────────────────────────────────

  _resolve(...segments) {
    return path.join(this.root, ...segments);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  /**
   * Fetches the tag registry. Note: 'blogs' and 'count' fields are ignored 
   * in favor of dynamic indexing.
   */
  async getAllTags() {
    const key = "tags:all";
    const cached = this._getCached(key);
    if (cached) return cached;

    try {
      const content = await fs.readFile(this._resolve("tags.json"), "utf8");
      const tags = JSON.parse(content);
      this._setCache(key, tags);
      return tags;
    } catch (error) {
      logger.warn(`Tags registry not found at ${this.root}/tags.json`);
      return [];
    }
  }

  async getBlogMetadataById(id) {
    if (!id) return null;
    const key = `blog:${id}`;
    const cached = this._getCached(key);
    if (cached) return cached;

    try {
      const content = await fs.readFile(this._resolve(id, "metadata.json"), "utf8");
      const normalized = this._normalize(JSON.parse(content), id);
      this._setCache(key, normalized);
      return normalized;
    } catch (err) {
      if (err.code === "ENOENT") return null;
      logger.error(`Error reading metadata for blog [${id}]:`, err);
      return null;
    }
  }

  /**
   * Core engine: Scans filesystem, builds indices, and handles tag associations.
   */
  async getAllBlogs() {
    const key = "blogs:all";
    const cached = this._getCached(key);
    if (cached && this.isWarmed) return cached;

    try {
      const entries = await fs.readdir(this.root, { withFileTypes: true });
      const ids = entries
        .filter(e => e.isDirectory() && !e.name.startsWith("."))
        .map(e => e.name);

      const blogs = (await Promise.all(ids.map(id => this.getBlogMetadataById(id))))
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Build Dynamic Indices
      this.slugIndex.clear();
      this.tagIndex.clear();
      const tagRegistry = await this.getAllTags();

      // Initialize tag index for all registry tags
      tagRegistry.forEach(t => this.tagIndex.set(t.id, []));
      
      // Ensure "All" tag exists in index
      const ALL_TAG_ID = "00000000-0000-0000-0000-000000000000";
      if (!this.tagIndex.has(ALL_TAG_ID)) this.tagIndex.set(ALL_TAG_ID, []);

      blogs.forEach(blog => {
        // Slug index
        if (blog.slug) this.slugIndex.set(blog.slug, blog.id);

        // Dynamic Tag Mapping: Map tag names in metadata to registry IDs
        blog.tags.forEach(tagName => {
          const registeredTag = tagRegistry.find(t => t.name.toLowerCase() === tagName.toLowerCase());
          if (registeredTag) {
            this.tagIndex.get(registeredTag.id).push(blog.id);
          }
        });

        // Always add to "All" tag
        this.tagIndex.get(ALL_TAG_ID).push(blog.id);
      });

      this.isWarmed = true;
      this._setCache(key, blogs);
      logger.success(`[API BACKEND SUCCESS] Indexed ${blogs.length} blogs and ${tagRegistry.length} tags`);
      return blogs;
    } catch (err) {
      throw new AppError("Failed to list blog datastore", ErrorCode.FILESYSTEM, err);
    }
  }

  async getBlogBySlug(slug) {
    if (!this.isWarmed) await this.getAllBlogs();
    const id = this.slugIndex.get(slug);
    return id ? this.getBlogMetadataById(id) : null;
  }

  async getBlogsByTagId(tagId) {
    if (!this.isWarmed) await this.getAllBlogs();
    const ids = this.tagIndex.get(tagId) || [];
    return (await Promise.all(ids.map(id => this.getBlogMetadataById(id)))).filter(Boolean);
  }

  async getBlogsByType(type) {
    const all = await this.getAllBlogs();
    return type ? all.filter(b => b.type === type) : all;
  }

  async getBlogContent(id) {
    try {
      return await fs.readFile(this._resolve(id, "blog.md"), "utf8");
    } catch (err) {
      throw new AppError(`Content missing for ${id}`, ErrorCode.NOT_FOUND, err);
    }
  }

  async getTagById(id) {
    const tags = await this.getAllTags();
    return tags.find(t => t.id === id) || null;
  }
}

// Export singleton instance
const service = new BlogService();

export const getAllTags = () => service.getAllTags();
export const getAllBlogs = () => service.getAllBlogs();
export const getBlogMetadataById = (id) => service.getBlogMetadataById(id);
export const getBlogBySlug = (slug) => service.getBlogBySlug(slug);
export const getBlogsByTagId = (tagId) => service.getBlogsByTagId(tagId);
export const getBlogsByType = (type) => service.getBlogsByType(type);
export const getBlogContent = (id) => service.getBlogContent(id);
export const getTagById = (id) => service.getTagById(id);
