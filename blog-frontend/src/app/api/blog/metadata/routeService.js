import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { convertMetaData } from "../services";

/**
 * Fetches metadata for a single blog by its ID.
 * @param {string} id - The ID of the blog.
 * @returns {Promise<object>} - The metadata for the blog.
 */
export async function getMetaDataById(id) {
  const metadataRef = doc(db, "metadata", id);
  const metadataSnap = await getDoc(metadataRef);
  if (!metadataSnap.exists()) {
    throw new Error(`Metadata for blog ID ${id} not found.`);
  }
  return convertMetaData(metadataSnap);
}

/**
 * Fetches all blog metadata.
 * @returns {Promise<Array<object>>} - A list of all metadata.
 */
export async function getMetaData() {
  const metadataCollectionRef = collection(db, "metadata");
  const metadataSnapshot = await getDocs(metadataCollectionRef);
  return metadataSnapshot.docs.map(convertMetaData);
}

/**
 * Increments a numeric field in a blog's metadata.
 * @param {string} id - The ID of the blog.
 * @param {string} field - The field to increment (e.g., "likes", "views").
 * @returns {Promise<object>} - The updated metadata.
 */
export async function incrementMetadataField(id, field) {
  const metadataRef = doc(db, "metadata", id);
  await updateDoc(metadataRef, { [field]: increment(1) });
  return getMetaDataById(id);
}
