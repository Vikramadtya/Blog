import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";

export async function addLikeToRemote(id) {
  console.log("increased likes for blog " + id);
  const likeRef = await doc(db, "likes", id);
  const update = await updateDoc(likeRef, "like", increment(1));
  const data = await getDoc(likeRef);
  return data.get("like");
}

export async function getLikesFromRemote(id) {
  const likeRef = await doc(db, "likes", id);
  const data = await getDoc(likeRef);
  return data.get("like");
}
