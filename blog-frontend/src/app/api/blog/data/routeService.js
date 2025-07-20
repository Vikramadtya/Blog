import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { convertBlogData } from "../services";

/**
 * A generic function to fetch blog data from Firestore.
 * @param {Query} query - The Firestore query to execute.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of blog data.
 */
async function fetchBlogs(query) {
  const querySnapshot = await getDocs(query);
  return querySnapshot.docs.map(convertBlogData);
}

/**
 * Fetches a single blog by its document ID.
 * @param {string} id - The document ID of the blog.
 * @returns {Promise<object>} - A promise that resolves to the blog data.
 */
export async function getBlogById(id) {
  const blogRef = doc(db, "blogs", id);
  const blogSnap = await getDoc(blogRef);
  if (!blogSnap.exists()) {
    throw new Error(`Blog with ID ${id} not found.`);
  }
  return convertBlogData(blogSnap);
}

/**
 * Fetches all blogs.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of all blogs.
 */
export function getAllBlogs() {
  const blogsCollection = collection(db, "blogs");
  return fetchBlogs(blogsCollection);
}

/**
 * Fetches blogs by their slug.
 * @param {string} slug - The slug of the blog.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of matching blogs.
 */
export function getBlogBySlug(slug) {
  const blogsCollection = collection(db, "blogs");
  const q = query(blogsCollection, where("slug", "==", slug));
  return fetchBlogs(q);
}

/**
 * Fetches all blogs of a specific type.
 * @param {string} type - The type of the blogs to fetch.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of matching blogs.
 */
export function getBlogsByType(type) {
  const blogsCollection = collection(db, "blogs");
  const q = query(blogsCollection, where("type", "==", type));
  return fetchBlogs(q);
}

/**
 * Fetches a map of tags to their associated blog metadata.
 * @returns {Promise<object>} - A promise that resolves to a map of tags to blogs.
 */
export async function getTagToMetadataMap() {
  const blogs = await getAllBlogs();
  const tagToMetadataBlog = {};

  blogs.forEach((blog) => {
    blog.tags.forEach((tag) => {
      if (!tagToMetadataBlog[tag.id]) {
        tagToMetadataBlog[tag.id] = [];
      }
      tagToMetadataBlog[tag.id].push(blog);
    });
  });

  return tagToMetadataBlog;
}
