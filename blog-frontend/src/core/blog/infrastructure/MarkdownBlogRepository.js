import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Post } from "../domain/Post.js";
import { InfrastructureError, NotFoundError } from "../../shared/errors.js";

export class MarkdownBlogRepository {
  constructor(datastorePath) {
    this.rootPath = datastorePath;
  }

  async _readDirectory() {
    try {
      const files = await fs.readdir(this.rootPath);
      return files.filter(f => f.endsWith(".md"));
    } catch (err) {
      if (err.code === "ENOENT") {
        return [];
      }
      throw new InfrastructureError("Failed to read blog directory", err);
    }
  }

  async _readFile(filename) {
    const fullPath = path.join(this.rootPath, filename);
    try {
      const raw = await fs.readFile(fullPath, "utf-8");
      const parsed = matter(raw);
      const id = filename.replace(/\.md$/, "");
      return new Post({
        id,
        ...parsed.data,
        content: parsed.content
      });
    } catch (err) {
      if (err.code === "ENOENT") {
        throw new NotFoundError("Post", filename);
      }
      throw new InfrastructureError(`Failed to read post file ${filename}`, err);
    }
  }

  async findAll() {
    const files = await this._readDirectory();
    const posts = [];
    
    for (const file of files) {
      try {
        const post = await this._readFile(file);
        posts.push(post);
      } catch (err) {
        console.error(`Skipping invalid post file ${file}:`, err.message);
      }
    }
    
    return posts;
  }

  async findBySlug(slug) {
    // In our markdown setup, the filename (id) is usually the slug.
    // However, the frontmatter slug might override it.
    // To be perfectly robust, we search all posts if we can't find it directly by filename.
    try {
      const directPost = await this._readFile(`${slug}.md`);
      if (directPost.slug === slug) return directPost;
    } catch (err) {
      // Not found directly by filename, fallback to scanning
    }

    const allPosts = await this.findAll();
    const post = allPosts.find(p => p.slug === slug);
    if (!post) throw new NotFoundError("Post", slug);
    return post;
  }

  async getAllTags() {
    const fullPath = path.join(this.rootPath, "tags.json");
    try {
      const content = await fs.readFile(fullPath, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw new InfrastructureError("Failed to read tags.json", err);
    }
  }

  async save(post) {
    const fullPath = path.join(this.rootPath, `${post.id}.md`);
    try {
      // Exclude ID and Content from frontmatter
      const { id, content, ...frontmatter } = post;
      
      const raw = matter.stringify(content, frontmatter);
      await fs.writeFile(fullPath, raw, "utf-8");
    } catch (err) {
      throw new InfrastructureError(`Failed to save post ${post.id}`, err);
    }
  }

  async delete(id) {
    const fullPath = path.join(this.rootPath, `${id}.md`);
    try {
      await fs.unlink(fullPath);
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new InfrastructureError(`Failed to delete post ${id}`, err);
      }
    }
  }
}
