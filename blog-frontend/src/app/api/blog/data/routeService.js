import {
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";
import { convertBlogData } from "../services";

export async function getBlogDataForId(id) {
  const blogDataRef = await doc(db, "blogs", id);
  const blogData = await getDoc(blogDataRef);
  return convertBlogData(blogData);
}

export async function getBlogDataForSlug(slug) {
  const blogDataCollectionRef = await collection(db, "blogs");
  const queryResults = await getDocs(
    query(blogDataCollectionRef, where("slug", "==", slug)),
  );
  return queryResults.docs.map((queryResult) => convertBlogData(queryResult));
}

export async function getAllBlogForType(type) {
  const blogDataCollectionRef = await collection(db, "blogs");
  const queryResults = await getDocs(
    query(blogDataCollectionRef, where("type", "==", type)),
  );
  return queryResults.docs.map((queryResult) => convertBlogData(queryResult));
}

export async function getAllBlogData() {
  const blogDataCollectionRef = await collection(db, "blogs");
  const blogData = await getDocs(blogDataCollectionRef);
  return blogData.docs.map((blogData) => convertBlogData(blogData));
}

export async function getTagToMetadataMap() {
  const blogDataCollectionRef = await collection(db, "blogs");
  const blogData = await getDocs(blogDataCollectionRef);

  const tagIdToBlogData = {};
  blogData.docs.forEach((blogData) =>
    convertBlogDataAndPutIntoMap(blogData, tagIdToBlogData),
  );
  return tagIdToBlogData;
}

function convertBlogDataAndPutIntoMap(blogData, tagToMetadataBlog) {
  const tags = blogData.get("tags");
  const metadata = convertBlogData(blogData);

  tags.forEach((tag) => {
    if (!(tag.id in tagToMetadataBlog)) {
      tagToMetadataBlog[tag.id] = [];
    }
    tagToMetadataBlog[tag.id].push(metadata);
  });
}
