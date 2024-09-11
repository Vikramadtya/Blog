export async function getView(id) {
  return fetch(`/api/views?id=${id}`, {
    method: "GET",
  });
}

export async function getLikes(id) {
  return fetch(`/api/likes?id=${id}`, {
    method: "GET",
  });
}
