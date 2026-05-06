/**
 * Shared domain constants for the blog application.
 * Unified source of truth for both server and client-side logic.
 */

export const BLOG_TYPES = Object.freeze({
  blog: {
    name: "blog",
    type: "blog",
  },
  snippet: {
    name: "snippet",
    type: "snippet",
  },
});

export const METADATA_TYPE = Object.freeze({
  likes: {
    name: "likes",
    type: "likes",
  },
  views: {
    name: "views",
    type: "views",
  },
});

/** Valid fields that can be incremented via API. */
export const VALID_INCREMENT_FIELDS = ["likes", "views"];

/** Cache TTL for local datastore. */
export const CACHE_TTL_MS = process.env.NODE_ENV === "production" 
  ? 5 * 60 * 1000 
  : 10 * 1000;
