/**
 * Unified client-side API library.
 * Handles dynamic runtime interactions (likes, views, subscriptions).
 */

import { siteMetadata } from "../../../site.config";
import { consola } from "consola";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_GET_RETRIES = 1;

// ─── HTTP Utilities ──────────────────────────────────────────────────────────

async function fetcher(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const text = await response.text();
    try { return JSON.parse(text); } catch { return text; }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function get(url) {
  let lastError;
  for (let i = 0; i <= MAX_GET_RETRIES; i++) {
    try { return await fetcher(url); } catch (e) { lastError = e; }
  }
  throw lastError;
}

async function post(url, body) {
  return fetcher(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function unwrap(res, fallback = []) {
  return res?.success ? res.data : fallback;
}

// ─── Domain API ──────────────────────────────────────────────────────────────

/**
 * Fetches a blog's live metadata (likes, views) from Firestore.
 */
export async function getBlogMetadataById(blogId) {
  const url = new URL("/api/blog/data", siteMetadata.apiBaseUrl);
  url.searchParams.set("id", blogId);
  return unwrap(await get(url.toString()), {});
}

/**
 * Increments likes or views for a blog.
 */
export async function incrementBlogLikesOrViewsById(id, type) {
  return post(new URL("/api/blog/data", siteMetadata.apiBaseUrl).toString(), {
    id,
    field: type,
  });
}

/**
 * Submits an email for notification subscription.
 */
export function notify(email) {
  return post(new URL("/api/blog/notify", siteMetadata.apiBaseUrl).toString(), { email });
}
