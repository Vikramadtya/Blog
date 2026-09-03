import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { InfrastructureError, NotFoundError, ValidationError } from "../../shared/errors.js";

export class MarkdownNoteRepository {
  constructor(notesDatastorePath) {
    this.rootPath = notesDatastorePath;
  }

  // Helper to convert filename or folder name to URL-friendly slug
  _toSlug(name) {
    return name
      .toLowerCase()
      .replace(/\.md$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async getTree(bookSlug) {
    const bookDir = path.join(this.rootPath, bookSlug);

    const walk = async (dir, currentPath = []) => {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch (err) {
        if (err.code === "ENOENT") return [];
        throw new InfrastructureError(`Failed to read directory ${dir}`, err);
      }

      entries = entries.filter((entry) => {
        if (entry.name.startsWith(".")) return false;
        if (entry.isFile() && !entry.name.endsWith(".md")) return false;
        return true;
      });

      entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      const tree = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const slug = this._toSlug(entry.name);
        const nodePath = [...currentPath, slug];

        if (entry.isDirectory()) {
          const children = await walk(fullPath, nodePath);
          if (children.length > 0) {
            tree.push({
              type: "directory",
              title: entry.name.replace(/^[0-9.-]+\s*/, ""), 
              slug,
              path: nodePath,
              children,
            });
          }
        } else {
          tree.push({
            type: "file",
            title: entry.name.replace(/\.md$/, "").replace(/^[0-9.-]+\s*/, ""),
            slug,
            path: nodePath,
          });
        }
      }
      return tree;
    };

    return walk(bookDir);
  }

  async getRawTree() {
    const walkRaw = async (dir, parentPath = "") => {
      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch (err) {
        if (err.code === "ENOENT") return [];
        throw new InfrastructureError(`Failed to read directory ${dir}`, err);
      }

      entries = entries.filter((entry) => !entry.name.startsWith("."));
      entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

      const nodes = [];
      for (const entry of entries) {
        const relativePath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          const children = await walkRaw(fullPath, relativePath);
          nodes.push({
            name: entry.name,
            path: relativePath,
            type: "directory",
            children,
          });
        } else if (entry.name.endsWith(".md")) {
          nodes.push({
            name: entry.name,
            path: relativePath,
            type: "file",
          });
        }
      }
      return nodes;
    };

    return walkRaw(this.rootPath);
  }

  async resolveSlugPath(bookSlug, slugArray) {
    const bookDir = path.join(this.rootPath, bookSlug);

    const resolve = async (dir, remainingSlugs) => {
      if (remainingSlugs.length === 0) return null;
      
      const targetSlug = remainingSlugs[0];
      const isLast = remainingSlugs.length === 1;

      let entries;
      try {
        entries = await fs.readdir(dir, { withFileTypes: true });
      } catch (err) {
        return null;
      }

      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;
        
        const entrySlug = this._toSlug(entry.name);
        if (entrySlug === targetSlug || entry.name === targetSlug || entry.name.replace(/\.md$/, "") === targetSlug) {
          if (isLast && entry.isFile() && entry.name.endsWith(".md")) {
            return path.join(dir, entry.name);
          } else if (!isLast && entry.isDirectory()) {
            return resolve(path.join(dir, entry.name), remainingSlugs.slice(1));
          }
        }
      }
      return null;
    };

    return resolve(bookDir, slugArray);
  }

  async getNoteBySlug(bookSlug, slugArray) {
    const resolvedFilePath = await this.resolveSlugPath(bookSlug, slugArray);
    if (!resolvedFilePath) throw new NotFoundError("Note", slugArray.join("/"));

    const content = await fs.readFile(resolvedFilePath, "utf-8");
    const { data, content: markdownContent } = matter(content);
    
    let title = data.title;
    let finalContent = markdownContent;

    if (!title) {
      const match = markdownContent.match(/^#\s+(.*)/m);
      title = match ? match[1].trim() : path.basename(resolvedFilePath, ".md").replace(/^[0-9.-]+\s*/, "");
    }

    // Strip the first H1 tag
    finalContent = markdownContent.replace(/^#\s+.*(\r?\n)?/m, "");

    return {
      title,
      content: finalContent,
      slug: slugArray.join("/"),
      bookSlug
    };
  }

  async getNoteByRawPath(relativePath) {
    const absolutePath = path.join(this.rootPath, relativePath);
    if (!absolutePath.startsWith(this.rootPath)) {
      throw new ValidationError("Invalid path traversal");
    }

    try {
      const content = await fs.readFile(absolutePath, "utf-8");
      return { path: relativePath, content };
    } catch (err) {
      if (err.code === "ENOENT") throw new NotFoundError("Note", relativePath);
      throw new InfrastructureError("Failed to read note file", err);
    }
  }

  async saveNoteRawPath(relativePath, content) {
    const absolutePath = path.join(this.rootPath, relativePath);
    if (!absolutePath.startsWith(this.rootPath)) {
      throw new ValidationError("Invalid path traversal");
    }

    try {
      await fs.writeFile(absolutePath, content, "utf-8");
    } catch (err) {
      throw new InfrastructureError("Failed to save note file", err);
    }
  }

  async deleteRawPath(relativePath) {
    const absolutePath = path.join(this.rootPath, relativePath);
    if (!absolutePath.startsWith(this.rootPath)) {
      throw new ValidationError("Invalid path traversal");
    }

    try {
      const stat = await fs.stat(absolutePath);
      if (stat.isDirectory()) {
        await fs.rm(absolutePath, { recursive: true, force: true });
      } else {
        await fs.unlink(absolutePath);
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new InfrastructureError("Failed to delete note/directory", err);
      }
    }
  }

  async createDirectory(relativePath) {
    const absolutePath = path.join(this.rootPath, relativePath);
    if (!absolutePath.startsWith(this.rootPath)) {
      throw new ValidationError("Invalid path traversal");
    }
    
    try {
      await fs.mkdir(absolutePath, { recursive: true });
    } catch (err) {
      throw new InfrastructureError("Failed to create directory", err);
    }
  }
}
