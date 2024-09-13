export async function getView(id) {
  return fetch(`/api/views?id=${id}`, {
    method: "GET",
  });
}

export async function addView(id) {
  return fetch(`/api/views`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
  });
}

export async function getLikes(id) {
  return fetch(`/api/likes?id=${id}`, {
    method: "GET",
  });
}

export async function addLike(id) {
  return fetch(`/api/likes`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
    }),
  });
}

export async function getMetaData(id) {
  return fetch(`/api/blog/metadata?id=${id}`, {
    method: "GET",
  });
}
