import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { resolveInside } from "../../../lib/paths.js";
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

  // First finite numeric value among the supported ordering keys, else null (avoids "NaN. Title")
  _frontmatterSno(data) {
    for (const key of ["s.no", "sno", "order", "id"]) {
      if (data[key] !== undefined && data[key] !== "") {
        const n = Number(data[key]);
        if (Number.isFinite(n)) return n;
      }
    }
    return null;
  }

  _toTitleCase(str) {
    return str
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, c => c.toUpperCase());
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

      const nodes = [];
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const slug = this._toSlug(entry.name);
        const nodePath = [...currentPath, slug];

        if (entry.isDirectory()) {
          const children = await walk(fullPath, nodePath);
          if (children.length > 0) {
            // For directories, we can try to extract `sno` from the directory name if it has a prefix like `1. ` or `01-`
            const match = entry.name.match(/^([0-9]+)[\.\-]/);
            const sno = match ? parseInt(match[1], 10) : 999999;

            nodes.push({
              type: "directory",
              title: entry.name.replace(/^[0-9.-]+\s*/, ""), 
              slug,
              path: nodePath,
              children,
              sno,
              originalName: entry.name
            });
          }
        } else {
          let sno = 999999;
          const match = entry.name.match(/^([0-9]+)(?:[\.\-\s]|$)/);
          if (match) sno = parseInt(match[1], 10);

          let title = "";
          try {
             const content = await fs.readFile(fullPath, 'utf-8');
             const parsed = matter(content);
             
             // Extract title or name from frontmatter
             if (parsed.data.title) title = String(parsed.data.title).trim();
             else if (parsed.data.name) title = String(parsed.data.name).trim();
             
             // Check various possible frontmatter keys for sorting
             const fmSno = this._frontmatterSno(parsed.data);
             if (fmSno !== null) sno = fmSno;

             // If no frontmatter title, extract the first H1 in markdown content
             if (!title) {
               const headingMatch = parsed.content.match(/^#\s+(.*)/m);
               if (headingMatch) {
                 title = headingMatch[1].trim();
               }
             }
          } catch (e) {
             // Fallback below
          }

          const rawBase = entry.name.replace(/\.md$/, "");
          if (!title) {
            if (rawBase.toLowerCase() === "index") {
              title = "About";
            } else {
              const cleanName = rawBase.replace(/^[0-9]+[\.\-\s]*/, "");
              title = cleanName ? this._toTitleCase(cleanName) : rawBase;
            }
          } else if (rawBase.toLowerCase() === "about") {
            title = "About";
          }

          // Prepend problem number / sno from filename if not present in title
          if (sno !== 999999 && !title.match(new RegExp(`^${sno}(?:[.\\s-]|$)`))) {
            title = `${sno}. ${title}`;
          }

          nodes.push({
            type: "file",
            title,
            slug,
            path: nodePath,
            sno,
            originalName: entry.name
          });
        }
      }

      // Sort nodes based on type first (files before directories), then sno, then alphabetically by original name
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "file" ? -1 : 1;
        }
        if (a.sno !== b.sno) {
          return a.sno - b.sno;
        }
        return a.originalName.localeCompare(b.originalName, undefined, { numeric: true });
      });

      // Cleanup internal fields
      return nodes.map(({ originalName, ...rest }) => rest);
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

      // Sort nodes: files before directories, then alphabetically
      nodes.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === "file" ? -1 : 1;
        }
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });

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
    
    let title = data.title || data.name;
    let finalContent = markdownContent;

    if (!title) {
      const match = markdownContent.match(/^#\s+(.*)/m);
      if (match) {
        title = match[1].trim();
      } else {
        const rawBase = path.basename(resolvedFilePath, ".md");
        if (rawBase.toLowerCase() === "index") {
          title = "About";
        } else {
          const cleanName = rawBase.replace(/^[0-9]+[\.\-\s]*/, "");
          title = cleanName ? this._toTitleCase(cleanName) : rawBase;
        }
      }
    }

    const baseFileName = path.basename(resolvedFilePath);
    if (baseFileName.replace(/\.md$/, "").toLowerCase() === "about") {
      title = "About";
    }

    // Check if filename or frontmatter has problem number prefix
    const numMatch = baseFileName.match(/^([0-9]+)(?:[\.\-\s]|$)/);
    let problemNum = numMatch ? parseInt(numMatch[1], 10) : null;
    if (!problemNum) problemNum = this._frontmatterSno(data);

    if (problemNum && !title.match(new RegExp(`^${problemNum}(?:[.\\s-]|$)`))) {
      title = `${problemNum}. ${title}`;
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
    const absolutePath = resolveInside(this.rootPath, relativePath);
    const normalizedPath = path.relative(this.rootPath, absolutePath);

    try {
      const content = await fs.readFile(absolutePath, "utf-8");
      return { path: normalizedPath, content };
    } catch (err) {
      if (err.code === "ENOENT") throw new NotFoundError("Note", normalizedPath);
      throw new InfrastructureError("Failed to read note file", err);
    }
  }

  async saveNoteRawPath(relativePath, content) {
    const absolutePath = resolveInside(this.rootPath, relativePath);
    const normalizedPath = path.relative(this.rootPath, absolutePath);

    try {
      await fs.writeFile(absolutePath, content, "utf-8");
    } catch (err) {
      throw new InfrastructureError("Failed to save note file", err);
    }
  }

  async deleteRawPath(relativePath) {
    const absolutePath = resolveInside(this.rootPath, relativePath);
    const normalizedPath = path.relative(this.rootPath, absolutePath);

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
    const absolutePath = resolveInside(this.rootPath, relativePath);
    const normalizedPath = path.relative(this.rootPath, absolutePath);
    
    try {
      await fs.mkdir(absolutePath, { recursive: true });
    } catch (err) {
      throw new InfrastructureError("Failed to create directory", err);
    }
  }
}
