import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BLOGS_DIR } from "./paths.js";

const ALL_TAG_ID = "00000000-0000-0000-0000-000000000000";

// Deterministic colour from a string; always a valid 6-digit hex.
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return `#${(hash & 0xffffff).toString(16).padStart(6, "0")}`;
};

/** Rebuild blog-datastore/blogs/tags.json from post frontmatter, preserving existing ids/colours. */
export async function syncTags() {
  const tagsFile = path.join(BLOGS_DIR, "tags.json");

  let existing = [];
  try {
    existing = JSON.parse(await fs.readFile(tagsFile, "utf8"));
  } catch {
    // first run
  }
  const existingByName = new Map(existing.map((t) => [t.name.toLowerCase(), t]));

  const files = (await fs.readdir(BLOGS_DIR)).filter((f) => f.endsWith(".md"));
  const tagMap = new Map([
    [ALL_TAG_ID, { id: ALL_TAG_ID, name: "all", color: "#3498db", count: 0, blogs: [] }],
  ]);

  for (const file of files) {
    const { data } = matter(await fs.readFile(path.join(BLOGS_DIR, file), "utf8"));
    const blogId = data.id || file.replace(/\.md$/, "");

    const all = tagMap.get(ALL_TAG_ID);
    all.count++;
    all.blogs.push(blogId);

    for (const tagName of Array.isArray(data.tags) ? data.tags : []) {
      const key = String(tagName).toLowerCase();
      if (!tagMap.has(key)) {
        const prev = existingByName.get(key);
        tagMap.set(key, {
          id: prev?.id ?? crypto.randomUUID(),
          name: String(tagName),
          color: prev?.color ?? stringToColor(key),
          count: 0,
          blogs: [],
        });
      }
      const tag = tagMap.get(key);
      if (!tag.blogs.includes(blogId)) {
        tag.blogs.push(blogId);
        tag.count++;
      }
    }
  }

  const tags = [...tagMap.values()];
  await fs.writeFile(tagsFile, JSON.stringify(tags, null, 4));
  return tags;
}
