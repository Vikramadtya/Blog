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
  const res = await fetch(`https://www.neuralcook.com/api/blog/metadata/`, {
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

export async function getBlogContent(id) {
  const response = await fetch(
    `https://raw.githubusercontent.com/Vikramadtya/Blog-Scratch/main/_markdown_content/blogs/${id}.mdx`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  return await response.text();
}
