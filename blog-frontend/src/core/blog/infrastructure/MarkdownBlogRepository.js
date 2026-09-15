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
    // slug may be:
    //   - a plain slug:     "github-spec-kit"
    //   - a full permalink: "spec-driven-development/github-spec-kit"
    // We always resolve to the leaf slug for file lookup.
    const leafSlug = slug.includes("/") ? slug.split("/").pop() : slug;

    // Fast path: try direct filename match on the leaf slug
    try {
      const directPost = await this._readFile(`${leafSlug}.md`);
      if (directPost.slug === leafSlug || directPost.slug === slug) return directPost;
    } catch (err) {
      // Not found directly by filename, fallback to scanning
    }

    // Fallback: scan all posts matching by slug or by permalink (series/slug)
    const allPosts = await this.findAll();
    const post = allPosts.find(p =>
      p.slug === leafSlug ||
      p.slug === slug ||
      (p.series ? `${p.series}/${p.slug}` : p.slug) === slug
    );
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
