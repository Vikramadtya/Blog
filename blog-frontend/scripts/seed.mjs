import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "blog-datastore", "blogs");

function generateSeedSql() {
  console.log("Generating SQL seed script from local Markdown files...");
  
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const metrics = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    
    const slug = file.replace(".md", "");
    const views = data.views || 0;
    const likes = data.likes || 0;

    if (views > 0 || likes > 0) {
      metrics.push(`('${slug}', ${views}, ${likes})`);
    }
  }

  if (metrics.length === 0) {
    console.log("No existing metrics found in frontmatter. Database is ready as-is!");
    return;
  }

  const sql = `
-- Run this in your Neon/Supabase SQL Editor to migrate your old metrics!
INSERT INTO blog_metrics (id, views, likes) 
VALUES 
  ${metrics.join(",\n  ")}
ON CONFLICT (id) DO UPDATE SET 
  views = EXCLUDED.views, 
  likes = EXCLUDED.likes;
`;

  fs.writeFileSync("seed_metrics.sql", sql);
  console.log(`✅ Success! Found ${metrics.length} blogs with metrics.`);
  console.log(`✅ SQL script generated at: blog-frontend/seed_metrics.sql`);
  console.log(`\nNext Step: Open your Neon/Supabase dashboard, go to the SQL Editor, and paste the contents of seed_metrics.sql`);
}

generateSeedSql();
