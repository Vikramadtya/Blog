import { createConsola } from "consola";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { v4 as uuidv4 } from "uuid";

const consola = createConsola();
const BLOGS_DIR = "./blog-datastore/blogs";
const TAGS_FILE = path.join(BLOGS_DIR, "tags.json");

if (!fs.existsSync(BLOGS_DIR)) {
  fs.mkdirSync(BLOGS_DIR, { recursive: true });
}

function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

async function syncTags() {
  consola.start("Syncing tags...");
  const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
  const tagMap = new Map();
  const allTagId = "00000000-0000-0000-0000-000000000000";

  tagMap.set(allTagId, { id: allTagId, name: "all", color: "#3498db", count: 0, blogs: [] });

  for (const file of files) {
    const { data, content } = matter(fs.readFileSync(path.join(BLOGS_DIR, file), "utf8"));
    const blogId = data.id || uuidv4();
    
    // Update "all" tag
    const allTag = tagMap.get(allTagId);
    allTag.count++;
    allTag.blogs.push(blogId);

    const tags = data.tags || [];
    tags.forEach(tagName => {
      const name = tagName.toLowerCase();
      if (!tagMap.has(name)) {
        tagMap.set(name, { 
          id: uuidv4(), 
          name: tagName, 
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`, 
          count: 0, 
          blogs: [] 
        });
      }
      const tag = tagMap.get(name);
      tag.count++;
      if (!tag.blogs.includes(blogId)) tag.blogs.push(blogId);
    });
  }

  const tagsArray = Array.from(tagMap.values());
  fs.writeFileSync(TAGS_FILE, JSON.stringify(tagsArray, null, 4));
  consola.success(`Synced ${tagsArray.length} tags to tags.json`);
}

async function main() {
  const action = await consola.prompt("What would you like to do?", {
    type: "select",
    options: ["Create Post", "List Posts", "Publish Post", "Sync Tags", "Delete Post", "Exit"],
  });

  if (action === "Create Post") {
    const title = await consola.prompt("Blog Title:");
    const slug = await consola.prompt("Slug:", {
      default: title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
    });
    const tagsInput = await consola.prompt("Tags (comma separated):", {
        default: "blog"
    });

    const filePath = path.join(BLOGS_DIR, `${slug}.md`);
    if (fs.existsSync(filePath)) {
      consola.error(`A blog with slug "${slug}" already exists!`);
      return;
    }

    const metadata = {
      id: uuidv4(),
      title,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      publish: false,
      type: "blog",
      readingTime: "1 min read",
      blogNumber: fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md")).length + 1,
    };

    const content = `# ${title}\n\nStart writing your amazing content here...`;
    const fileContent = matter.stringify(content, metadata);

    fs.writeFileSync(filePath, fileContent);
    consola.success(`Blog post created: ${filePath}`);
    await syncTags(); // Automatically sync tags after creation

  } else if (action === "List Posts") {
    const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
    if (files.length === 0) {
      consola.info("No blog posts found.");
    } else {
      console.log("\n--- Blog Posts ---");
      files.forEach(f => {
        const { data } = matter(fs.readFileSync(path.join(BLOGS_DIR, f), "utf8"));
        console.log(`${data.publish ? "✅" : "📝"} ${data.title.padEnd(30)} | ${data.slug}`);
      });
      console.log("------------------\n");
    }
  } else if (action === "Publish Post") {
    const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
    if (files.length === 0) return consola.info("No blog posts found.");

    const toPublish = await consola.prompt("Select post to publish:", {
      type: "select",
      options: files
    });

    const filePath = path.join(BLOGS_DIR, toPublish);
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));

    data.publish = true;
    data.updatedAt = new Date().toISOString();
    data.readingTime = calculateReadingTime(content);

    fs.writeFileSync(filePath, matter.stringify(content, data));
    consola.success(`Published ${toPublish} (Reading time: ${data.readingTime})`);

  } else if (action === "Sync Tags") {
    await syncTags();
  } else if (action === "Delete Post") {
      const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".md"));
      if (files.length === 0) return consola.info("No blog posts to delete.");

      const toDelete = await consola.prompt("Select post to delete:", {
          type: "select",
          options: files
      });

      const confirmed = await consola.prompt(`Are you sure you want to delete ${toDelete}?`, {
          type: "confirm"
      });

      if (confirmed) {
          fs.unlinkSync(path.join(BLOGS_DIR, toDelete));
          consola.success(`Deleted ${toDelete}`);
      }
  }
}

main().catch(consola.error);
