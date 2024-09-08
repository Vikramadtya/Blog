export async function getView(id) {
  return fetch(`/api/view?id=${id}`, {
    method: "GET",
  });
}

export async function getLikes(id) {
  return fetch(`/api/like?id=${id}`, {
    method: "GET",
  });
}
