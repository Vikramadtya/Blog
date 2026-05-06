import { collection, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { fetchCollection } from "../../lib/commons";
import datastore from "../../lib/datastore-info";
import { AppError, ErrorCode } from "../../lib/errors";
import { logger } from "../../lib/api-utils";

/**
 * Fetches authors from Firestore.
 *
 * @returns {Promise<Array<object>>} - A promise resolving to an array of authors.
 * @throws {AppError} With FIREBASE code on failure.
 */
export async function getAuthors() {
  try {
    const authorCollection = collection(db, datastore.author.name);
    const firestoreQuery = query(authorCollection);

    const authors = await fetchCollection(
      firestoreQuery,
      "all authors",
      datastore.author.converter,
      datastore.author.type,
    );

    return authors;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      "Failed to fetch authors from Firestore",
      ErrorCode.FIREBASE,
      error,
    );
  }
}
