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

export async function getAllTagsFromRemote() {
  const tagsRef = await collection(db, "tags");
  const data = await getDocs(tagsRef);

  const tags = [];
  for (const tagData of data.docs) {
    tags.push({
      id: tagData.get("id"),
      name: tagData.get("name"),
      color: tagData.get("color"),
    });
  }

  return tags;
}

export async function getTagToMetadataMap() {
  const blogMetaDataCollectionRef = await collection(db, "blogMetaData");
  const blogMetaDatas = await getDocs(blogMetaDataCollectionRef);

  const tagToMetadataBlog = {};
  for (const blogMetaData of blogMetaDatas.docs) {
    await parseBlogMetaData(blogMetaData, tagToMetadataBlog);
  }

  return tagToMetadataBlog;
}

async function parseBlogMetaData(data, tagToMetadataBlog) {
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

  const metadata = {
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
    previewImageSrc: data.get("previewImageSrc"),
  };

  tags.forEach((tag) => {
    if (!(tag.id in tagToMetadataBlog)) {
      tagToMetadataBlog[tag.id] = [];
    }
    tagToMetadataBlog[tag.id].push(metadata);
  });
}
