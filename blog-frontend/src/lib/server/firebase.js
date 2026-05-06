import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { logger } from "@/lib/server/api-utils";

// ─── Configuration ───────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: process.env.FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_CONFIG_DATABASE_URL,
  projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_CONFIG_APP_ID,
};

let app;
let db;

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  logger.warn("Firebase configuration missing. Firebase features will be disabled.");
}

export { db };

export const COLLECTIONS = {
  BLOG_METADATA: "blogs-metadata",
  SUBSCRIPTIONS: "subscriptions",
};

// ─── Converters ──────────────────────────────────────────────────────────────

/**
 * Normalizes Firestore blog metadata.
 * @param {DocumentSnapshot} data
 * @returns {object}
 */
export function convertBlogData(data) {
  return {
    id: data.get("id"),
    title: data.get("title"),
    description: data.get("summary"),
    preview: data.get("demo.preview"),
    source: data.get("demo.source"),
    createdAt: data.get("createdAt"),
    updatedAt: data.get("updatedAt"),
    slug: data.get("slug"),
    tags: data.get("tags"),
    author: data.get("author"),
    blogNumber: data.get("blogNumber"),
    previewImageSrc: data.get("previewImageSrc"),
    type: data.get("type"),
    likes: data.get("likes"),
    views: data.get("views"),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetches a single document by its document ID from Firestore.
 */
export async function getDocumentById(id, converter, collectionName, itemType) {
  if (!id || !db) return null;

  const docRef = doc(db, collectionName, id);

  try {
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      logger.warn(`${itemType} with ID ${id} not found.`);
      return null;
    }
    return converter(docSnap);
  } catch (err) {
    logger.error(`Error fetching ${itemType} ${id}:`, err);
    throw new Error(`Failed to fetch ${itemType} by ID.`);
  }
}
