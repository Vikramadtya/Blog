export async function getView(id) {
  return fetch(`/api/view`, {
    method: "GET",
  });
}

export async function getLikes(id) {
  return fetch(`/api/like`, {
    method: "GET",
  });
}
