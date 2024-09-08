export async function getBlogsMetaDataFromRemote() {
  const response = await fetch(
    `https://raw.githubusercontent.com/Vikramadtya/Blog-Scratch/main/_markdown_content/blogMeta.json`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    },
  );
  const data = await response.json();

  return data
    .filter((metadata) => metadata.publish === true)
    .map((metadata) => {
      let data = {};
      data.id = metadata.id;
      data.title = metadata.name;
      data.description = metadata.summary;
      data.tags = metadata.tags;
      data.preview = metadata.demo.preview;
      data.source = metadata.demo.source;
      data.slug = metadata.slug;
      data.createdAt = metadata.createdAt;
      return data;
    });
}

export async function getBlogMetaDataFromSlug(slug) {
  const blogsMetaData = await getBlogsMetaDataFromRemote();
  return blogsMetaData.find((metadata) => metadata.slug === slug);
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
