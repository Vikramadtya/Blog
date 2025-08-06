import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { fetchCollection } from "../../lib/commons";
import datastore from "../../lib/datastore-info";

/**
 * Fetches authors from Firestore
 * @returns {Promise<Array<object>>} - A promise resolving to an array of authors
 */
export async function getAuthors() {
  const tagCollection = collection(db, datastore.author.name);
  let context = "all tags";
  let firestoreQuery = query(tagCollection);

  return fetchCollection(
    firestoreQuery,
    context,
    datastore.author.converter,
    datastore.author.type,
  );
}
