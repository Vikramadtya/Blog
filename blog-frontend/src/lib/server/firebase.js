import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, getDoc } from "firebase/firestore";
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
  if (!global._firebaseApp) {
    global._firebaseApp = initializeApp(firebaseConfig);
    global._firebaseDb = initializeFirestore(global._firebaseApp, {
      experimentalForceLongPolling: true,
    });
  }
  app = global._firebaseApp;
  db = global._firebaseDb;
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
    likes: data.get("likes") || 0,
    views: data.get("views") || 0,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fetches a single document by its document ID from Firestore using the REST API.
 * This is much more stable in Node.js/Serverless environments than the gRPC-based SDK.
 */
export async function getDocumentById(id, converter, collectionName, itemType) {
  if (!id || !firebaseConfig.projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}/${id}?key=${firebaseConfig.apiKey}`;

  try {
    const response = await fetch(url);
    
    if (response.status === 404) {
      logger.warn(`${itemType} with ID ${id} not found (REST).`);
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Firestore REST error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Firestore REST API returns fields in a specific format (e.g. { fields: { likes: { integerValue: "10" } } })
    // We need a helper to normalize this or just pass the raw fields if they are simple.
    // However, our converter expects a DocumentSnapshot-like object with .get().
    
    const mockSnap = {
      get: (field) => {
        const parts = field.split(".");
        let current = data.fields;
        for (const part of parts) {
          if (!current || !current[part]) return undefined;
          current = current[part];
        }
        // Unwrap Firestore REST types
        if (current.integerValue) return parseInt(current.integerValue);
        if (current.doubleValue) return parseFloat(current.doubleValue);
        if (current.stringValue) return current.stringValue;
        if (current.booleanValue) return current.booleanValue;
        if (current.timestampValue) return current.timestampValue;
        if (current.mapValue) return current.mapValue.fields; // Caution: nested fields might need recursive unwrapping
        if (current.arrayValue) return current.arrayValue.values?.map(v => {
          if (v.stringValue) return v.stringValue;
          if (v.integerValue) return parseInt(v.integerValue);
          return v;
        });
        return current;
      }
    };

    return converter(mockSnap);
  } catch (err) {
    logger.error(`Error fetching ${itemType} ${id} (REST):`, err);
    return null;
  }
}

/**
 * Increments a numeric field in a Firestore document using the REST API.
 */
export async function incrementFieldREST(id, field, collectionName) {
  if (!id || !firebaseConfig.projectId) return null;

  const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:commit?key=${firebaseConfig.apiKey}`;

  const body = {
    writes: [
      {
        transform: {
          document: `projects/${firebaseConfig.projectId}/databases/(default)/documents/${collectionName}/${id}`,
          fieldTransforms: [
            {
              fieldPath: field,
              increment: { integerValue: 1 }
            }
          ]
        }
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Firestore REST Increment error: ${errorData.error?.message || response.statusText}`);
    }

    return true;
  } catch (err) {
    logger.error(`Error incrementing ${field} for ${id} (REST):`, err);
    throw err;
  }
}
