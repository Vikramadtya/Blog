import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

import { fetchCollection } from "../../lib/commons";
import datastore from "../../lib/datastore-info";
import { logger } from "../../lib/api-utils";

/**
 * Fetches tags from Firestore. Can fetch all tags or filter by a key-value pair.
 * @param {object} [filter] - Optional filter object.
 * @param {string} filter.key - The document field to filter by (e.g., "slug", "type").
 * @param {any} filter.value - The value the field must match.
 * @returns {Promise<Array<object>>} - A promise resolving to an array of tags.
 */
export async function getTags(filter) {
  const tagCollection = collection(db, datastore.tag.name);
  let firestoreQuery;
  let context;

  if (filter && filter.key && filter.value !== undefined) {
    // A filter is provided, create a 'where' query
    context = `tags where ${filter.key} == "${filter.value}"`;
    firestoreQuery = query(
      tagCollection,
      where(filter.key, "==", filter.value),
    );
  } else {
    // No filter or an invalid filter was provided, fetch all tags
    context = "all tags";
    firestoreQuery = query(tagCollection);
    if (filter) {
      logger.warn(
        "getTags called with an incomplete filter. Fetching all tags instead.",
        filter,
      );
    }
  }

  return fetchCollection(
    firestoreQuery,
    context,
    datastore.tag.converter,
    datastore.tag.type,
  );
}
