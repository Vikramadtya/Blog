export async function getMetadata(id) {
  return fetch(`/api/blog/metadata?id=${id}`, {
    method: "GET",
  });
}

export async function addView(id) {
  return fetch(`/api/blog/metadata`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
      views: true,
    }),
  });
}

export async function addLike(id) {
  return fetch(`/api/blog/metadata`, {
    method: "POST",
    body: JSON.stringify({
      id: id,
      likes: true,
    }),
  });
}

export async function getAllBlogs() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/data`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getLatestBlogs() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/data`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getFeaturedBlogs() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/data`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getAllTags() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/tags`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getIdToMetadata() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/metadata`, {
    method: "GET",
  });
  const metadata = await res.json();
  const blogIdToMetadata = {};
  metadata.forEach((data) => {
    blogIdToMetadata[data.id] = data;
  });

  return blogIdToMetadata;
}

export async function getMetadataDuringBuild(id) {
  const res = await fetch(
    `https://www.neuralcook.com/api/blog/metadata?id=${id}`,
    {
      method: "GET",
    },
  );
  const data = await res.json();
  return data;
}

export async function getTagsToBlogs() {
  const res = await fetch(`https://www.neuralcook.com/api/blog/data/tags`, {
    method: "GET",
  });
  const data = await res.json();
  return data;
}

export async function getBlogBySlug(slug) {
  const res = await fetch(
    `https://www.neuralcook.com/api/blog/data?slug=${slug}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();
  return data;
}

export async function getBlogContent(id) {
  const response = await fetch(
    `https://raw.githubusercontent.com/Vikramadtya/Blog-Scratch/main/blogs/${id}/blog.mdx`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  return await response.text();
}
