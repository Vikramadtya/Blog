import { siteMetadata as siteConfig } from "../../site.config";

const API_BASE_URL = siteConfig.apiBaseUrl;

const GITHUB_RAW_ENDPOINT = siteConfig.githubRawEndpoint;

/**
 * A robust utility function to handle API requests.
 * It attempts to parse the response as JSON, falling back to text if parsing fails.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The options for the fetch request.
 * @returns {Promise<any>} - The response from the API.
 * @throws {Error} - Throws an error if the network request fails.
 */
async function fetcher(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Network request failed: ${response.statusText}`);
    }
    const text = await response.text();
    try {
      // Try parsing as JSON, as APIs might not set the content-type header correctly.
      return JSON.parse(text);
    } catch (error) {
      // If it's not JSON, return the raw text.
      return text;
    }
  } catch (error) {
    console.error("API service error:", error);
    throw error;
  }
}

/**
 * A generic function for making POST requests.
 * @param {string} endpoint - The API endpoint.
 * @param {object} body - The request body.
 * @returns {Promise<any>}
 */
function postRequest(endpoint, body) {
  return fetcher(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/**
 * Fetches metadata for a given blog ID.
 * @param {string} id - The ID of the blog.
 * @returns {Promise<any>} - The metadata for the blog.
 */
export function getMetadata(id) {
  return fetcher(`${API_BASE_URL}/metadata?id=${id}`);
}

/**
 * Increments the view count for a given blog ID.
 * @param {string} id - The ID of the blog.
 * @returns {Promise<any>}
 */
export function addView(id) {
  return postRequest(`${API_BASE_URL}/metadata`, { id, views: true });
}

/**
 * Increments the like count for a given blog ID.
 * @param {string} id - The ID of the blog.
 * @returns {Promise<any>}
 */
export function addLike(id) {
  return postRequest(`${API_BASE_URL}/metadata`, { id, likes: true });
}

/**
 * Submits a user's email for notification.
 * @param {FormData} formData - The form data containing the user's email.
 * @returns {Promise<any>}
 */
export function notify(formData) {
  return postRequest(`/api/notify`, { email: formData.get("email") });
}

/**
 * Fetches blogs, optionally filtering by type.
 * @param {string} [type] - The type of blog to fetch (e.g., "blog", "snippet").
 * @returns {Promise<any>} - A list of blogs.
 */
function getBlogs(type) {
  const url = type
    ? `${API_BASE_URL}/data?type=${type}`
    : `${API_BASE_URL}/data`;
  return fetcher(url);
}

export const getAllBlogs = () => getBlogs("blog");
export const getLatestBlogs = () => getBlogs();
export const getFeaturedSnippets = () => getBlogs("snippet");
export const getFeaturedBlogs = () => getBlogs("blog");

/**
 * Fetches all tags.
 * @returns {Promise<any>} - A list of all tags.
 */
export function getAllTags() {
  return fetcher(`${API_BASE_URL}/tags`);
}

/**
 * Fetches all blog metadata and returns it as a map.
 * @returns {Promise<object>} - A map of blog IDs to their metadata.
 */
export async function getIdToMetadata() {
  const metadata = await fetcher(`${API_BASE_URL}/metadata`);
  return metadata.reduce((acc, data) => {
    acc[data.id] = data;
    return acc;
  }, {});
}

/**
 * Fetches a map of tags to blogs.
 * @returns {Promise<any>} - A map of tags to blogs.
 */
export function getTagsToBlogs() {
  return fetcher(`${API_BASE_URL}/data/tags`);
}

/**
 * Fetches a blog by its slug.
 * @param {string} slug - The slug of the blog to fetch.
 * @returns {Promise<any>} - The blog data.
 */
export function getBlogBySlug(slug) {
  return fetcher(`${API_BASE_URL}/data?slug=${slug}`);
}

/**
 * Fetches the content of a blog post from GitHub.
 * @param {string} id - The ID of the blog post.
 * @returns {Promise<string>} - The content of the blog post.
 */
export function getBlogContent(id) {
  return fetcher(`${GITHUB_RAW_ENDPOINT}/${id}/blog.md`);
}
