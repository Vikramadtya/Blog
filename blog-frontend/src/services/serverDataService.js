/**
 * Server-side data service facade.
 *
 * This module is the single import point for server components (pages)
 * that need blog data at build time. It re-exports functions from
 * localDatastore (filesystem reads) and domain constants.
 *
 * Client components should NOT import this module — they should use
 * apiServices.js for dynamic data (likes/views) via API routes.
 */

// ─── Data access (filesystem) ────────────────────────────────────────────────
export {
  getAllTags,
  getAllBlogs,
  getBlogsByType,
  getBlogBySlug,
  getBlogsByTagId,
  getBlogContent,
  getBlogMetadataById,
} from "../app/api/lib/localDatastore";

// ─── Domain constants ────────────────────────────────────────────────────────
export { BLOG_TYPES, METADATA_TYPE } from "./constants";
