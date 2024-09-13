import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
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
  return {
    id: id,
    likes: data.get("likes"),
    views: data.get("views"),
  };
}
