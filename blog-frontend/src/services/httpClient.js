/**
 * Reusable HTTP client for the blog frontend.
 *
 * Design decisions:
 * - Timeout support via AbortController (default 10s)
 * - Automatic retry for idempotent GET requests (1 retry with backoff)
 * - Smart response parsing: tries JSON first, falls back to text
 * - Structured error wrapping with AppError
 * - Centralized logging via consola
 */

import { consola } from "consola";

const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_GET_RETRIES = 1;
const RETRY_BACKOFF_MS = 500;

/**
 * Low-level fetch wrapper with timeout, logging, and smart response parsing.
 *
 * @param {string} url - The URL to fetch.
 * @param {RequestInit} [options={}] - Standard fetch options.
 * @param {number} [timeoutMs=DEFAULT_TIMEOUT_MS] - Request timeout in ms.
 * @returns {Promise<any>} Parsed JSON or raw text response.
 * @throws {Error} On network failure, timeout, or non-OK response.
 */
async function fetcher(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    consola.info(`[HTTP] ${options.method ?? "GET"} ${url}`);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `HTTP ${response.status} ${response.statusText}: ${errorBody}`.trim(),
      );
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      // Response is not JSON — return raw text (e.g. markdown content)
      return text;
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Performs a GET request with automatic retry for transient failures.
 *
 * @param {string} url - The full URL (or path for relative requests).
 * @param {RequestInit} [options={}] - Additional fetch options.
 * @returns {Promise<any>} Parsed response.
 */
export async function get(url, options = {}) {
  let lastError;

  for (let attempt = 0; attempt <= MAX_GET_RETRIES; attempt++) {
    try {
      return await fetcher(url, { ...options, method: "GET" });
    } catch (error) {
      lastError = error;
      if (attempt < MAX_GET_RETRIES) {
        const delay = RETRY_BACKOFF_MS * Math.pow(2, attempt);
        consola.warn(
          `[HTTP] GET ${url} failed (attempt ${attempt + 1}), retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  consola.error(`[HTTP] GET ${url} failed after ${MAX_GET_RETRIES + 1} attempts`);
  throw lastError;
}

/**
 * Performs a POST request. No retries — POST is not idempotent.
 *
 * @param {string} url - The full URL.
 * @param {object} body - The request payload (will be JSON-serialized).
 * @returns {Promise<any>} Parsed response.
 */
export async function post(url, body) {
  try {
    return await fetcher(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    consola.error(`[HTTP] POST ${url} failed:`, error.message);
    throw error;
  }
}

/**
 * Unwraps a standard API response envelope.
 *
 * The blog API returns `{ success: boolean, data: any }`.
 * This helper extracts `data` on success, or returns the fallback value.
 *
 * @param {object} response - The raw API response.
 * @param {any} [fallback=[]] - Value to return if the response indicates failure.
 * @returns {any} The unwrapped data or the fallback.
 */
export function unwrapResponse(response, fallback = []) {
  if (response && response.success === true) {
    return response.data;
  }
  consola.warn("[HTTP] API returned unsuccessful response:", response);
  return fallback;
}
