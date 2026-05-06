import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOGS_DIR = "./blog-datastore/blogs";

async function migrate() {
  const entries = fs.readdirSync(BLOGS_DIR, { withFileTypes: true });
  
  for (const entry of entries) {
    if (entry.isDirectory() && !entry.name.startsWith(".")) {
      const dirPath = path.join(BLOGS_DIR, entry.name);
      const metadataPath = path.join(dirPath, "metadata.json");
      const blogPath = path.join(dirPath, "blog.md");

      if (fs.existsSync(metadataPath) && fs.existsSync(blogPath)) {
        console.log(`Migrating ${entry.name}...`);
        
        const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
        const content = fs.readFileSync(blogPath, "utf8");
        
        const slug = metadata.slug || entry.name;
        const newFilePath = path.join(BLOGS_DIR, `${slug}.md`);

        // Create frontmatter
        const fileContent = matter.stringify(content, metadata);
        
        fs.writeFileSync(newFilePath, fileContent);
        console.log(`Created ${newFilePath}`);
        
        // Optional: rename or remove old directory
        // For safety, I'll just rename it for now, and let the user delete it later
        // fs.renameSync(dirPath, path.join(BLOGS_DIR, `_old_${entry.name}`));
      }
    }
  }
}

migrate().catch(console.error);
