/**
 * Blog-specific business logic utilities.
 *
 * These functions transform blog data for UI consumption
 * (table of contents, tag-to-blog mappings, etc.).
 *
 * Uses serverDataService (filesystem) instead of apiServices (HTTP)
 * since these functions run at build time in server components.
 */

import { getBlogsByTagId } from "./serverDataService";

/**
 * Extracts a table of contents from markdown content.
 *
 * Parses lines that start with 1-6 `#` characters and converts them
 * into heading/slug pairs for navigation.
 *
 * @param {string} content - Raw markdown content.
 * @returns {Array<{ heading: string, slug: string }>} TOC entries.
 */
export function getBlogToc(content) {
  if (!content) return [];

  return content
    .split("\n")
    .filter((line) => /^#{1,6}\s+.+/.test(line))
    .map((heading) => ({
      heading,
      slug: heading
        .replace(/#/g, "")
        .trim()
        .toLowerCase()
        .replace(/\?/g, "")
        .replace(/\s+/g, "-"),
    }));
}

/**
 * Builds a mapping of tag IDs to their associated blog metadata.
 *
 * Reads directly from the filesystem — no HTTP round-trips.
 *
 * @param {Array<{ id: string }>} tags - Array of tag objects.
 * @returns {Promise<Record<string, Array<object>>>} Map from tag ID to blog metadata array.
 */
export async function getTagToBlogMap(tags) {
  if (!tags || tags.length === 0) return {};

  const entries = await Promise.all(
    tags.map(async (tag) => {
      const blogs = await getBlogsByTagId(tag.id);
      return [tag.id, blogs];
    }),
  );

  return Object.fromEntries(entries);
}
