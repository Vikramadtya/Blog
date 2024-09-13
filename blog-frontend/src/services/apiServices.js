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

export async function getAllBlogsMetaData() {
  const res = await fetch(`http://localhost:3000//api/blog/metadata`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getBlogMetaDataBySlug(slug) {
  return fetch(`/api/blog/metadata?slug=${slug}`, {
    method: "GET",
  });
}
