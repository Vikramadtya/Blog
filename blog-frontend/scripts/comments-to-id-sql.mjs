// One-off: comments used to be keyed by post slug, they are now keyed by post id.
// Prints SQL to run once against the production database:
//   node scripts/comments-to-id-sql.mjs | psql "$DATABASE_URL"
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const dir = path.join(process.cwd(), "..", "blog-datastore", "blogs");
const esc = (v) => String(v).replace(/'/g, "''");

console.log("BEGIN;");
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
  const { data } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
  if (!data.id) continue;
  const slugs = new Set([data.slug, data.series && data.slug ? `${data.series}/${data.slug}` : null, file.replace(/\.md$/, "")]);
  for (const slug of slugs) {
    if (slug && slug !== data.id) {
      console.log(`UPDATE comments SET blog_id = '${esc(data.id)}' WHERE blog_id = '${esc(slug)}';`);
    }
  }
}
console.log("COMMIT;");
