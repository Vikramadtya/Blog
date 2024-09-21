import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../../utils/firebaseConfig";
import { convertTagData } from "../services";

export async function getTag(id) {
  const tagRef = await doc(db, "tags", id);
  const tagData = await getDoc(tagRef);
  return convertTagData(tagData);
}

export async function getAllTags() {
  const tagsRef = await collection(db, "tags");
  const tagsData = await getDocs(tagsRef);
  return tagsData.docs.map((tagData) => convertTagData(tagData));
}
