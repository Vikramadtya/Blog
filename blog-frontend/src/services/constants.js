/**
 * Shared domain constants for the blog application.
 * Extracted from apiServices.js so consumers can import just the
 * constants they need without pulling in the entire API module.
 */

/**
 * Blog content type identifiers.
 * Used to filter blog metadata by category.
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

/**
 * Dynamic metadata field identifiers.
 * Used when incrementing likes/views via the POST endpoint.
 */
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
