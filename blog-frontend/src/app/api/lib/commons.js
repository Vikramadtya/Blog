import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { logger } from "./api-utils";

/**
 * A generic function to fetch and process multiple documents from a Firestore query.
 * This is an internal helper to keep our code DRY (Don't Repeat Yourself).
 * @param {Query} firestoreQuery - The Firestore query to execute.
 * @param {string} context - A descriptive string for logging.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of blog data.
 */
export async function fetchCollection(
  firestoreQuery,
  context,
  converter,
  itemType,
) {
  logger.info(`Fetching collection for: ${context}`);
  try {
    const querySnapshot = await getDocs(firestoreQuery);
    const items = querySnapshot.docs.map(converter);
    logger.success(
      `Successfully fetched ${items.length} ${itemType} for: ${context}`,
    );
    return items;
  } catch (err) {
    logger.error(`Failed to fetch collection for: ${context}`, err);
    throw new Error(`An error occurred while fetching ${itemType} data.`);
  }
}

/**
 * Fetches a single document by its document ID.
 * @param {string} id - The document ID of the blog to fetch.
 * @returns {Promise<object|null>} - A promise resolving to the blog data or null if not found.
 */
export async function getDocumentById(id, converter, documentType, itemType) {
  if (!id) {
    logger.warn("getDocumentById called with no ID.");
    return null;
  }
  const context = `${itemType} by ID: ${id}`;
  logger.info(`Fetching ${context}`);
  const docRef = doc(db, documentType, id);

  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      logger.warn(`${itemType} with ID ${id} not found.`);
      return null; // Return null for a predictable result
    }
    logger.success(`Successfully fetched ${context}`);
    return converter(docSnap);
  } catch (err) {
    logger.error(`An error occurred while fetching ${context}`, err);
    throw new Error(`An error occurred while fetching ${itemType} by ID.`);
  }
}
