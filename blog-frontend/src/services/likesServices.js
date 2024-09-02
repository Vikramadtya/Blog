export function addLikeToRemote(id) {
  console.log("increased likes for blog " + id);
  return 101;
}

export function getLikesFromRemote(id) {
  return 100;
}

export async function getLikes(id) {
  // return fetch(`http://localhost:3000/api/like?id=${id}`, {
  //   method: "GET",
  // });
  return "10";
}
