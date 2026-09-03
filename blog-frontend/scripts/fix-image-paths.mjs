import fs from "fs";
import path from "path";

function fixImagePaths(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      fixImagePaths(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      let content = fs.readFileSync(fullPath, "utf8");
      
      const before = content;
      
      // Match anything ending with .gitbook/assets/
      content = content.replace(/([\"'\(\s])(?:\.\.\/)*\.gitbook\/assets\/([^\"'\)\s]+)/g, "$1/notes-assets/$2");
      
      if (content !== before) {
        fs.writeFileSync(fullPath, content, "utf8");
      }
    }
  }
}

const notesDir = path.join(process.cwd(), "..", "blog-datastore", "notes");
console.log(`Fixing image paths in ${notesDir}`);
fixImagePaths(notesDir);
console.log("Done!");
