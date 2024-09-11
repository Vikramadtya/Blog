import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";

export async function addViewToRemote(id) {
  console.log("increased view for blog " + id);
  const viewRef = await doc(db, "views", id);
  const update = await updateDoc(viewRef, "view", increment(1));
  const data = await getDoc(viewRef);
  return data.get("view");
}

export async function getViewsFromRemote(id) {
  const viewRef = await doc(db, "views", id);
  const data = await getDoc(viewRef);
  return data.get("view");
}
