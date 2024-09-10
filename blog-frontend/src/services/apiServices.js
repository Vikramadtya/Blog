export async function getView(id) {
  return fetch(`/api/views`, {
    method: "GET",
  });
}

export async function getLikes(id) {
  return fetch(`/api/likes`, {
    method: "GET",
  });
}
