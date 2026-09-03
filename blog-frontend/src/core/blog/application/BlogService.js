import { Post } from "../domain/Post.js";
import { CACHE_TTL_MS } from "../../../lib/constants.js";

/**
 * Application Service for Blogs.
 * Orchestrates use cases and handles caching to prevent constant disk IO.
 */
export class BlogService {
  constructor(blogRepository) {
    this.repository = blogRepository;
    this.cache = new Map();
  }

  _getCached(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data;
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }


  async _hydratePost(post) {
    if (!post) return null;
    if (post.tags && post.tags.length > 0 && typeof post.tags[0] === 'object') return post; // already hydrated
    
    const allTags = await this.getAllTags();
    const hydratedTags = post.tags.map(tagStr => {
      if (typeof tagStr === 'object') return tagStr;
      const found = allTags.find(t => t.id === tagStr);
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
    let posts = this._getCached("all_posts");
    
    if (!posts) {
      const rawPosts = await this.repository.findAll();
      posts = await Promise.all(rawPosts.map(p => this._hydratePost(p)));
      
      // Sort by creation date descending
      posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      this._setCache("all_posts", posts);
    }

    if (!includeUnpublished) {
      posts = posts.filter(p => p.isPublished());
    }

    return posts;
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
    const cacheKey = `post_slug_${slug}`;
    let post = this._getCached(cacheKey);

    if (!post) {
      const rawPost = await this.repository.findBySlug(slug);
      post = await this._hydratePost(rawPost);
      this._setCache(cacheKey, post);
    }

    if (!includeUnpublished && !post.isPublished()) {
      return null;
    }

    return post;
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
