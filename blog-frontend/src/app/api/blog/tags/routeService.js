import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";
import { convertTagData } from "../services";

/**
 * Fetches all tags from the Firestore collection.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of all tags.
 */
export async function getAllTags() {
  const tagsRef = collection(db, "tags");
  const tagsSnapshot = await getDocs(tagsRef);
  return tagsSnapshot.docs.map(convertTagData);
}
