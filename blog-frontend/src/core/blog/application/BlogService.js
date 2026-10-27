import { Post } from "../domain/Post.js";
import { NotFoundError } from "../../shared/errors.js";

/**
 * Application Service for Blogs.
 * Orchestrates use cases and memoises disk reads in production.
 */
export class BlogService {
  constructor(blogRepository) {
    this.repository = blogRepository;
    this.cache = new Map();
    this.useCache = process.env.NODE_ENV !== "development";
  }

  // Content only changes via edits on disk. In dev always re-read; in production
  // (build / long-lived server) memoise, since the content is immutable per deploy.
  _getCached(key) {
    return this.useCache ? this.cache.get(key) ?? null : null;
  }

  _setCache(key, data) {
    if (this.useCache) this.cache.set(key, data);
  }

  async _hydratePost(post) {
    if (!post) return null;
    if (post.tags && post.tags.length > 0 && typeof post.tags[0] === 'object') return post; // already hydrated
    
    const allTags = await this.getAllTags();
    const hydratedTags = post.tags.map(tagStr => {
      if (typeof tagStr === 'object') return tagStr;
      const needle = String(tagStr).toLowerCase();
      const found = allTags.find(t => t.id === tagStr || t.name?.toLowerCase() === needle);
      return found ? found : { id: tagStr, name: tagStr, color: "gray" };
    });
    
    const hydratedPost = new Post({...post.toJSON()});
    hydratedPost.tags = hydratedTags;
    return hydratedPost;
  }

  _clearCache() {
    this.cache.clear();
  }

  async getAllPosts({ includeUnpublished = false } = {}) {
    const isDev = process.env.NODE_ENV === "development";
    const wantsAll = includeUnpublished || isDev;
    const cacheKey = wantsAll ? "all_posts_admin" : "all_posts_public";
    
    let posts = this._getCached(cacheKey);
    
    if (!posts) {
      const rawPosts = await this.repository.findAll();
      let hydrated = await Promise.all(rawPosts.map(p => this._hydratePost(p)));
      
      hydrated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      if (!wantsAll) {
        hydrated = hydrated.filter(p => p.isPublished());
      }
      
      posts = hydrated;
      this._setCache(cacheKey, posts);
    }

    return [...posts]; // fresh array so callers can sort/filter freely
  }

  async getPublishedBlogs() {
    const posts = await this.getAllPosts({ includeUnpublished: false });
    return posts.filter(p => p.isBlog());
  }

  async getPublishedSnippets() {
    const posts = await this.getAllPosts({ includeUnpublished: false });
    return posts.filter(p => p.isSnippet());
  }

  async getPostBySlug(slug, { includeUnpublished = false } = {}) {
    const isDev = process.env.NODE_ENV === "development";
    const wantsAll = includeUnpublished || isDev;
    const cacheKey = `post_slug_${slug}_${wantsAll ? 'admin' : 'public'}`;
    
    let post = this._getCached(cacheKey);

    if (!post) {
      let rawPost;
      try {
        rawPost = await this.repository.findBySlug(slug);
      } catch (err) {
        if (err instanceof NotFoundError) return null;
        throw err;
      }
      post = await this._hydratePost(rawPost);

      if (!post || (!wantsAll && !post.isPublished())) {
        return null;
      }

      this._setCache(cacheKey, post);
    }

    return post ?? null;
  }

  async getAllTags() {
    const tagsCacheKey = "all_tags";
    let tags = this._getCached(tagsCacheKey);
    
    if (!tags) {
      tags = await this.repository.getAllTags();
      this._setCache(tagsCacheKey, tags);
    }
    
    return tags;
  }

  async createOrUpdatePost(postData) {
    // This expects postData to be an object matching the Post entity constructor
    const post = new Post(postData);
    
    // Update timestamps if necessary
    if (!postData.createdAt) {
      post.createdAt = new Date().toISOString();
    }
    post.updatedAt = new Date().toISOString();

    await this.repository.save(post);
    this._clearCache();
    
    return post;
  }

  async deletePost(id) {
    await this.repository.delete(id);
    this._clearCache();
  }
}
