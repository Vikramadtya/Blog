/**
 * Unified client-side API library.
 * Handles dynamic runtime interactions (likes, views, subscriptions).
 */

import { siteMetadata } from "../../../site.config.mjs";
import { consola } from "consola";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_GET_RETRIES = 1;

// ─── HTTP Utilities ──────────────────────────────────────────────────────────

async function fetcher(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.error) errorMessage = errorBody.error;
      } catch {}
      throw new Error(errorMessage);
    }
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

async function get(url) {
  let lastError;
  for (let i = 0; i <= MAX_GET_RETRIES; i++) {
    try {
      return await fetcher(url);
    } catch (e) {
      lastError = e;
    }
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

const MICROSERVICE_URL =
  process.env.NEXT_PUBLIC_MICROSERVICE_URL || "http://localhost:8787";

// ─── Domain API ──────────────────────────────────────────────────────────────

/**
 * Fetches a blog's live metadata (likes, views) from the microservice.
 */
export async function getBlogMetadataById(blogId) {
  const url = `${MICROSERVICE_URL}/metrics/${blogId}`;
  return (await get(url)) || {};
}

/**
 * Increments likes or views for a blog via the microservice.
 */
export async function incrementBlogLikesOrViewsById(id, type) {
  const url = `${MICROSERVICE_URL}/metrics/${id}/${type}`;
  const data = await post(url, {});
  return { success: true, data }; // Wrap for backwards compatibility with the hook
}

/**
 * Submits an email for notification subscription via the microservice.
 */
export async function notify(email) {
  const url = `${MICROSERVICE_URL}/subscribe`;
  return await post(url, { email });
}

/**
 * Submits a contact/support request via the microservice.
 */
export async function contactSupport(email, message) {
  const url = `${MICROSERVICE_URL}/contact`;
  return await post(url, { email, message });
}

export async function fetchSubscribers() {
  const url = `${MICROSERVICE_URL}/subscribe`;
  const res = await get(url);
  return unwrap(res, []);
}

export async function fetchContacts() {
  const url = `${MICROSERVICE_URL}/contact`;
  const res = await get(url);
  return unwrap(res, []);
}

export async function fetchAnalytics() {
  const url = `${MICROSERVICE_URL}/analytics`;
  return await get(url);
}

export async function fetchComments(blogId) {
  const url = `${MICROSERVICE_URL}/comments/${blogId}`;
  const res = await get(url);
  return res.comments || [];
}

export async function postComment(blogId, data) {
  const url = `${MICROSERVICE_URL}/comments/${blogId}`;
  return await post(url, data);
}

export async function deleteComment(id) {
  const url = `${MICROSERVICE_URL}/comments/${id}`;
  return fetcher(url, { method: "DELETE" });
}
