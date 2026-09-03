import fs from "fs";
import path from "path";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

const docsDir = "/Users/vikramadityasingh/Repository/study-saathi/docs";
const destNotesDir = path.join(process.cwd(), "..", "blog-datastore", "notes");
const destAssetsDir = path.join(process.cwd(), "public", "notes-assets");

fs.mkdirSync(destNotesDir, { recursive: true });
fs.mkdirSync(destAssetsDir, { recursive: true });

function migrateDir(currentDir, relativePath = "") {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    // Skip internal/hidden folders
    if (entry.name.startsWith(".") || entry.name === "assets" || entry.name === "javascripts") {
      continue;
    }

    const fullPath = path.join(currentDir, entry.name);
    
    if (entry.isDirectory()) {
      const slugifiedDir = slugify(entry.name);
      const newRelativePath = path.join(relativePath, slugifiedDir);
      const newDestDir = path.join(destNotesDir, newRelativePath);
      
      fs.mkdirSync(newDestDir, { recursive: true });
      migrateDir(fullPath, newRelativePath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const destFilePath = path.join(destNotesDir, relativePath, entry.name);
      let content = fs.readFileSync(fullPath, "utf8");

      // Replace image paths. 
      // GitBook style: ../.gitbook/assets/img.png
      // MkDocs style: ../assets/images/System%20Design/img.png
      
      // Match markdown images: ![alt](path)
      content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imagePath) => {
        const decodedPath = decodeURIComponent(imagePath);
        const imageName = path.basename(decodedPath);
        
        // Find the image in the original docs directory to copy it
        const possibleAssetPath = path.resolve(currentDir, decodedPath);
        if (fs.existsSync(possibleAssetPath)) {
          fs.copyFileSync(possibleAssetPath, path.join(destAssetsDir, imageName));
        }
        
        return `![${alt}](/notes-assets/${encodeURIComponent(imageName)})`;
      });
      
      // Match HTML images: <img src="path" />
      content = content.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/g, (match, before, imagePath, after) => {
        const decodedPath = decodeURIComponent(imagePath);
        const imageName = path.basename(decodedPath);
        
        const possibleAssetPath = path.resolve(currentDir, decodedPath);
        if (fs.existsSync(possibleAssetPath)) {
          fs.copyFileSync(possibleAssetPath, path.join(destAssetsDir, imageName));
        }
        
        return `<img${before}src="/notes-assets/${encodeURIComponent(imageName)}"${after}>`;
      });

      fs.writeFileSync(destFilePath, content, "utf8");
    }
  }
}

console.log("Starting migration...");
migrateDir(docsDir);
console.log("Migration complete!");
