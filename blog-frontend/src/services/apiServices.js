/**
 * Client-side API service layer.
 *
 * This module is ONLY for client components that need dynamic data
 * at runtime (likes, views, subscriptions). All static blog data
 * is resolved at build time via serverDataService.js.
 *
 * Server components should NEVER import this module — use
 * serverDataService.js instead.
 */

import { get, post, unwrapResponse } from "./httpClient";
import { siteMetadata as siteConfig } from "../../site.config";

// ─── Re-exports for backward compat with client components ──────────────────
export { BLOG_TYPES, METADATA_TYPE } from "./constants";

// ─── Configuration ───────────────────────────────────────────────────────────

const API_BASE_URL = siteConfig.apiBaseUrl;

/**
 * Builds a full API URL with optional query parameters.
 *
 * @param {string} path - The API path (e.g., "/api/blog/data").
 * @param {Record<string, string>} [params={}] - Query parameters.
 * @returns {string} The complete URL.
 */
function buildApiUrl(path, params = {}) {
  const url = new URL(path, API_BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

// ─── Dynamic Data (Runtime Only) ─────────────────────────────────────────────

/**
 * Fetches a blog's live metadata from Firebase (likes, views).
 * Used by client components to get real-time counts.
 *
 * @param {string} blogId - The blog ID.
 * @returns {Promise<object>} A single blog metadata object with live counts.
 */
export async function getBlogMetadataById(blogId) {
  const response = await get(buildApiUrl("/api/blog/data", { id: blogId }));
  const data = unwrapResponse(response, []);
  return Array.isArray(data) ? data[0] ?? {} : data ?? {};
}

/**
 * Increments a blog's likes or views count via Firebase.
 *
 * @param {string} id - The blog ID.
 * @param {object} metadata - A METADATA_TYPE value ({ type: "likes" | "views" }).
 * @returns {Promise<object>} The updated metadata.
 */
export async function incrementBlogLikesOrViewsById(id, metadata) {
  return post(buildApiUrl("/api/blog/data"), {
    id,
    field: metadata.type,
  });
}

// ─── Notification Service ────────────────────────────────────────────────────

/**
 * Submits a user's email for notification subscription.
 * @param {FormData} formData - The form data containing the user's email.
 * @returns {Promise<any>}
 */
export function notify(formData) {
  return post(`/api/notify`, { email: formData.get("email") });
}
