/**
 * Local filesystem data-access layer.
 * 
 * Provides a clean API for reading blog content and metadata with in-memory caching.
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

  // ─── Validation & Normalization ────────────────────────────────────────────

  _validateMetadata(raw, id) {
    const required = ["title", "createdAt", "slug", "type"];
    const missing = required.filter(f => !raw[f]);
    if (missing.length > 0) {
      logger.warn(`Blog [${id}] is missing required fields: ${missing.join(", ")}`);
    }
  }

  _normalize(raw, id) {
    this._validateMetadata(raw, id);
    return {
      ...raw,
      id,
      description: raw.summary || raw.description || "",
      preview: raw.demo?.preview ?? null,
      source: raw.demo?.repository ?? null,
    };
  }

  // ─── Path Helpers ──────────────────────────────────────────────────────────

  _resolve(...segments) {
    return path.join(this.root, ...segments);
  }

  // ─── Public API ────────────────────────────────────────────────────────────

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
      throw new AppError(`Failed to read metadata for ${id}`, ErrorCode.FILESYSTEM, err);
    }
  }

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

      // Rebuild Indices
      this.slugIndex.clear();
      this.tagIndex.clear();
      const tags = await this.getAllTags();

      blogs.forEach(b => {
        if (b.slug) this.slugIndex.set(b.slug, b.id);
      });
      tags.forEach(t => {
        if (t.id && Array.isArray(t.blogs)) this.tagIndex.set(t.id, t.blogs);
      });

      this.isWarmed = true;
      this._setCache(key, blogs);
      logger.success(`Indexed ${blogs.length} blogs and ${tags.length} tags`);
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
