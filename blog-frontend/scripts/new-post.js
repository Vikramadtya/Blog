import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const TITLE = process.argv[2];
const TYPE = process.argv[3] || "blog";

if (!TITLE) {
  console.error("Usage: node scripts/new-post.js \"Post Title\" [blog|snippet]");
  process.exit(1);
}

const slug = TITLE.toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/\s+/g, "-")
  .replace(/-+/g, "-");

const id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
const now = new Date().toISOString();

const folderPath = path.join(process.cwd(), "blog-datastore", "blogs", slug);

const metadata = {
  blogNumber: 0,
  title: TITLE,
  summary: `Summary of ${TITLE}`,
  description: `Detailed description of ${TITLE}`,
  createdAt: now,
  updatedAt: now,
  slug: slug,
  type: TYPE,
  tags: [],
  previewImageSrc: "/images/blog/placeholder.jpg",
  demo: {
    preview: "",
    repository: ""
  },
  likes: 0,
  views: 0
};

const blogContent = `# ${TITLE}

Start writing your post here...
`;

async function scaffold() {
  try {
    await fs.mkdir(folderPath, { recursive: true });
    await fs.writeFile(path.join(folderPath, "metadata.json"), JSON.stringify(metadata, null, 2));
    await fs.writeFile(path.join(folderPath, "blog.md"), blogContent);

    console.log(`\x1b[32mSUCCESS:\x1b[0m Created new ${TYPE} at \x1b[34m${folderPath}\x1b[0m`);
    console.log(`\x1b[33mNEXT STEPS:\x1b[0m
1. Edit ${path.join(folderPath, "metadata.json")} to add tags.
2. Write your content in ${path.join(folderPath, "blog.md")}.
3. Re-run dev server or build.`);
  } catch (err) {
    console.error(`\x1b[31mERROR:\x1b[0m ${err.message}`);
  }
}

scaffold();
