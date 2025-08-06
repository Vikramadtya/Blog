import {
  collection,
  doc,
  increment,
  query,
  updateDoc,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { fetchCollection, getDocumentById } from "../../lib/commons";
import datastore from "../../lib/datastore-info";
import { logger } from "../../lib/api-utils";

/**
 * Fetches blogs from Firestore with flexible filtering.
 * - No filter: Fetches all blogs.
 * - Filter with a single value: Fetches blogs where a field matches the value.
 * - Filter with an array value: Fetches blogs where a field matches any value in the array.
 *
 * @param {object} [filter] - Optional filter object.
 * @param {string} filter.key - The document field to filter by (e.g., "slug", "type", or "id" for the document ID).
 * @param {any|Array<any>} filter.value - The value or array of values the field must match.
 * @returns {Promise<Array<object>>} - A promise resolving to an array of blogs.
 */
export function getBlogs(filter) {
  const blogsCollection = collection(db, datastore.blog.name);
  let firestoreQuery;
  let context;

  if (filter && filter.key && filter.value !== undefined) {
    const { key, value } = filter;
    // Determine the field to query: use documentId() for 'id', otherwise use the provided key.
    const fieldToQuery = key === "id" ? documentId() : key;

    if (Array.isArray(value)) {
      if (value.length === 0) {
        logger.warn(
          `getBlogs called with an empty array for key: '${key}'. Returning no results.`,
        );
        return Promise.resolve([]); // Firestore 'in' queries cannot have an empty array.
      }
      // Use the 'in' operator to find documents where the field matches any value in the array.
      // NOTE: The 'in' operator is limited to 30 values per query.
      context = `blogs where '${key}' is in [${value.length} values]`;
      firestoreQuery = query(blogsCollection, where(fieldToQuery, "in", value));
    } else {
      // Use the '==' operator for a single value match.
      context = `blogs where ${key} == "${value}"`;
      firestoreQuery = query(blogsCollection, where(fieldToQuery, "==", value));
    }
  } else {
    // No filter or an invalid filter was provided, so fetch all blogs.
    context = "all blogs";
    firestoreQuery = query(blogsCollection);
    if (filter) {
      logger.warn(
        "getBlogs called with an incomplete filter. Fetching all blogs instead.",
        filter,
      );
    }
  }

  return fetchCollection(
    firestoreQuery,
    context,
    datastore.blog.converter,
    datastore.blog.type,
  );
}

/**
 * Increments a numeric field in a blog's metadata.
 * @param {string} id - The ID of the blog.
 * @param {string} field - The field to increment (e.g., "likes", "views").
 * @returns {Promise<object>} - The updated metadata.
 */
export async function incrementMetadataField(id, field) {
  const metadataRef = doc(db, datastore.blog.name, id);
  await updateDoc(metadataRef, { [field]: increment(1) });
  return getDocumentById(
    id,
    datastore.blog.converter,
    datastore.blog.name,
    datastore.blog.type,
  );
}

export async function getAllBlogWithTag(filter) {
  const { key, value } = filter;
  const context = `blogs by tag id: ${value}`;
  logger.info(`Fetching ${context}`);
  try {
    // Fetch the tag document to get the list of associated blog IDs
    const tag = await getDocumentById(
      value,
      datastore.tag.converter,
      datastore.tag.name,
      datastore.tag.type,
    );

    if (!tag || !tag.blogs || tag.blogs.length === 0) {
      logger.warn(`No blogs found for tag ID: ${value}`);
      return [];
    }

    // Now, fetch the blogs using the array of blog IDs.
    // This will be handled by the 'id' key logic below.
    return getBlogs({ key: "id", value: tag.blogs });
  } catch (error) {
    logger.error(`Error fetching blogs for tag ${value}:`, error);
    throw error;
  }
}
