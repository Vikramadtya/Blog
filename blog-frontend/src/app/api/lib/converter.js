export function convertBlogData(data) {
  return {
    id: data.get("id"),
    title: data.get("title"),
    description: data.get("summary"),
    preview: data.get("demo.preview"),
    source: data.get("demo.source"),
    createdAt: data.get("createdAt"),
    updatedAt: data.get("updatedAt"),
    slug: data.get("slug"),
    tags: data.get("tags"),
    author: data.get("author"),
    blogNumber: data.get("blogNumber"),
    previewImageSrc: data.get("previewImageSrc"),
    type: data.get("type"),
    likes: data.get("likes"),
    views: data.get("views"),
  };
}

export function convertTagData(data) {
  return {
    id: data.get("id"),
    name: data.get("name"),
    color: data.get("color"),
    count: data.get("blogs").length,
    blogs: data.get("blogs"),
  };
}

export function convertAuthorData(data) {
  return {
    id: data.get("id"),
    name: data.get("name"),
    username: data.get("username"),
    email: data.get("email"),
    avatar: data.get("avatar"),
  };
}
