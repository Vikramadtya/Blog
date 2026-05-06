/**
 * Tags route service — business logic for /api/blog/tags.
 *
 * Reads tag data from localDatastore and applies optional filtering.
 */

import { getAllTags, getTagById } from "../../lib/localDatastore";
import { logger } from "../../lib/api-utils";

/**
 * Fetches tags from the local filesystem with optional filtering.
 *
 * @param {object} [filter] - Optional filter object.
 * @param {string} filter.key - The field to filter by (e.g., "id", "slug", "name").
 * @param {any} filter.value - The value the field must match.
 * @returns {Promise<Array<object>|object|null>} - A promise resolving to tags or a single tag.
 */
export async function getTags(filter) {
  if (filter && filter.key === "id") {
    logger.info(`Fetching tag by ID: ${filter.value}`);
    return getTagById(filter.value);
  }

  const tags = await getAllTags();

  if (filter && filter.key && filter.value !== undefined) {
    const { key, value } = filter;
    logger.info(`Filtering tags where ${key} == "${value}"`);
    return tags.filter((tag) => tag[key] === value);
  }

  logger.info(`Returning all tags (${tags.length})`);
  return tags;
}
