import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";
import { convertBlogData, convertMetaData } from "../services";

export async function getMetaDataForId(id) {
  const metadataRef = await doc(db, "metadata", id);
  const metadata = await getDoc(metadataRef);
  return convertMetaData(metadata);
}

export async function getMetaData() {
  const metadataCollectionRef = await collection(db, "metadata");
  const metadata = await getDocs(metadataCollectionRef);
  return metadata.docs.map((data) => convertMetaData(data));
}

export async function incrementKey(id, key) {
  const blogMetaDataRef = await doc(db, "metadata", id);
  const update = await updateDoc(blogMetaDataRef, "key", increment(1));
  const data = await getDoc(blogMetaDataRef);
  return data;
}
