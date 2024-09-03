import path from "path";
import fs from "fs";
import { metadata } from "../app/layout";

const Blog_Markdown_Content_Path = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "_markdown_content",
  "blogs",
);

const Blog_MetaData_Path = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "_markdown_content",
  "blogMeta.json",
);

export function getBlogsMetaData() {
  const blogsMetaData = JSON.parse(
    fs.readFileSync(Blog_MetaData_Path, "utf-8"),
  );
  return blogsMetaData
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

export function getBlogMetaDataFromSlug(slug) {
  const blogsMetaData = getBlogsMetaData();
  return blogsMetaData.find((metadata) => metadata.slug === slug);
}

export function getBlogMetaData(id) {
  const blogsMetaData = getBlogsMetaData();
  return blogsMetaData.find((metadata) => metadata.id === id);
}

export function getBlogContent(id) {
  const markdownFile = fs.readFileSync(
    path.join(Blog_Markdown_Content_Path, id + ".mdx"),
    "utf-8",
  );

  return markdownFile;
}
