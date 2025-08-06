import { siteMetadata as siteConfig } from "../../site.config";
import { logger } from "../app/api/lib/api-utils";

const API_BASE_URL = siteConfig.apiBaseUrl;

const GITHUB_RAW_ENDPOINT = siteConfig.githubRawEndpoint;

export const BLOG_TYPES = {
  blog: {
    name: "blog",
    type: "blog",
  },
  snippet: {
    name: "snippet",
    type: "snippet",
  },
};

export const METADATA_TYPE = {
  likes: {
    name: "likes",
    type: "likes",
  },
  views: {
    name: "views",
    type: "views",
  },
};

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
    console.error(
      `API service error: ${url} option : ${JSON.stringify(options)}`,
      error,
    );
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
 * Submits a user's email for notification.
 * @param {FormData} formData - The form data containing the user's email.
 * @returns {Promise<any>}
 */
export function notify(formData) {
  return postRequest(`/api/notify`, { email: formData.get("email") });
}

/**
 * Fetches the content of a blog post from GitHub.
 * @param {string} id - The ID of the blog post.
 * @returns {Promise<string>} - The content of the blog post.
 */
export function getBlogContent(id) {
  return fetcher(`${GITHUB_RAW_ENDPOINT}/${id}/blog.md`);
}

export async function getAllTags() {
  const response = await fetcher(`${API_BASE_URL}/api/blog/tags`);
  logger.info(
    `- [SERVER SIDE FETCH] for getAllTags got response: \n ${JSON.stringify(response)}`,
  );
  return response.success === true ? response.data : [];
}

export async function getBlogMetadataWithTagId(tagId) {
  const response = await fetcher(`${API_BASE_URL}/api/blog/data?tag=${tagId}`);
  logger.info(
    `- [SERVER SIDE FETCH] for getBlogsWithTag(${tagId}) got response: \n ${JSON.stringify(response)}`,
  );
  return response.success === true ? response.data : [];
}

export async function getBlogMetadataById(blogId) {
  const response = await fetcher(`${API_BASE_URL}/api/blog/data?id=${blogId}`);
  logger.info(
    `- [SERVER SIDE FETCH] for getMetadata(${blogId}) got response: \n ${JSON.stringify(response)}`,
  );
  return response.success === true ? response.data[0] : {};
}

export async function getBlogMetadataByType(value) {
  const url = `${API_BASE_URL}/api/blog/data${value === undefined ? "" : "?type=" + value.type}`;
  const response = await fetcher(url);
  logger.info(
    `- [SERVER SIDE FETCH] for getBlogMetadataByType(${value === undefined ? "" : value.name}) got response: \n ${JSON.stringify(response)}`,
  );
  return response.success === true ? response.data : [];
}

export async function getBlogMetadataBySlug(slug) {
  const response = await fetcher(`${API_BASE_URL}/api/blog/data?slug=${slug}`);
  logger.info(
    `- [SERVER SIDE FETCH] for getBlogBySlug(${slug}) got response: \n ${JSON.stringify(response)}`,
  );
  return response.success === true ? response.data[0] : {};
}

export async function incrementBlogLikesOrViewsById(id, metadata) {
  return await postRequest(`${API_BASE_URL}/api/blog/data`, {
    id: id,
    field: metadata.type,
  });
}
