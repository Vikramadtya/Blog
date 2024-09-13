import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";

export async function addLikeToRemote(id) {
  console.log("increased likes for blog " + id);
  const blogMetaDataRef = await doc(db, "blogMetaData", id);
  const update = await updateDoc(blogMetaDataRef, "likes", increment(1));
  const data = await getDoc(blogMetaDataRef);
  return data;
}

export async function addViewToRemote(id) {
  console.log("increased view for blog " + id);
  const blogMetaDataRef = await doc(db, "blogMetaData", id);
  const update = await updateDoc(blogMetaDataRef, "views", increment(1));
  const data = await getDoc(blogMetaDataRef);
  return data;
}

export async function getBlogMetadataFromRemote(id) {
  const blogMetaDataRef = await doc(db, "blogMetaData", id);
  const data = await getDoc(blogMetaDataRef);
  return await parseBlogMetaData(data);
}

export async function getBlogMetadataFromRemoteBySlug(slug) {
  const blogMetaDataCollectionRef = await collection(db, "blogMetaData");
  const q = query(blogMetaDataCollectionRef, where("slug", "==", slug));
  const queryResults = await getDocs(q);

  const blogs = [];

  for (const queryResult of queryResults.docs) {
    const blogData = await parseBlogMetaData(queryResult);
    blogs.push(blogData);
  }
  return blogs;
}

export async function getAllBlogMetadataFromRemote() {
  const blogMetaDataCollectionRef = await collection(db, "blogMetaData");
  const blogMetaDatas = await getDocs(blogMetaDataCollectionRef);

  const blogs = [];
  for (const blogMetaData of blogMetaDatas.docs) {
    const blogData = await parseBlogMetaData(blogMetaData);
    blogs.push(blogData);
  }

  return blogs;
}

async function parseBlogMetaData(data) {
  const tags = [];
  for (const tagRef of data.get("tags")) {
    const tagData = await getDoc(tagRef);
    tags.push({
      id: tagData.get("id"),
      name: tagData.get("name"),
      color: tagData.get("color"),
    });
  }

  const userData = await getDoc(data.get("author"));

  return {
    id: data.get("id"),
    uuid: data.get("uuid"),
    likes: data.get("likes"),
    views: data.get("views"),
    title: data.get("name"),
    description: data.get("summary"),
    preview: data.get("demo.preview"),
    source: data.get("demo.source"),
    createdAt: data.get("createdAt").toDate(),
    updatedAt: data.get("updatedAt").toDate(),
    slug: data.get("slug"),
    tags: tags,
    user: {
      id: userData.get("id"),
      name: userData.get("name"),
      user: userData.get("user"),
    },
  };
}
