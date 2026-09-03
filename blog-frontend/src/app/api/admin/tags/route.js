import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { v4 as uuidv4 } from "uuid";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in local development." }, { status: 403 });
  }

  const BLOGS_DIR = path.join(process.cwd(), "blog-datastore/blogs");
  const TAGS_FILE = path.join(BLOGS_DIR, "tags.json");

  try {
    const files = (await fs.readdir(BLOGS_DIR)).filter(f => f.endsWith(".md"));
    const tagMap = new Map();
    const allTagId = "00000000-0000-0000-0000-000000000000";

    tagMap.set(allTagId, {
      id: allTagId,
      name: "all",
      color: "#3498db",
      count: 0,
      blogs: [],
    });

    for (const file of files) {
      const fileContent = await fs.readFile(path.join(BLOGS_DIR, file), "utf8");
      const { data } = matter(fileContent);
      const blogId = data.id || uuidv4();

      // Update "all" tag
      const allTag = tagMap.get(allTagId);
      allTag.count++;
      allTag.blogs.push(blogId);

      const tags = data.tags || [];
      tags.forEach((tagName) => {
        const name = tagName.toLowerCase();
        if (!tagMap.has(name)) {
          tagMap.set(name, {
            id: uuidv4(),
            name: tagName,
            color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`,
            count: 0,
            blogs: [],
          });
        }
        const tag = tagMap.get(name);
        tag.count++;
        if (!tag.blogs.includes(blogId)) tag.blogs.push(blogId);
      });
    }

    const tagsArray = Array.from(tagMap.values());
    await fs.writeFile(TAGS_FILE, JSON.stringify(tagsArray, null, 4));

    return NextResponse.json({ success: true, count: tagsArray.length });
  } catch (error) {
    console.error("Failed to sync tags:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
