import fs from "fs/promises";
import path from "path";
import { CACHE_TTL_MS } from "../../../lib/constants.js";
import { InfrastructureError } from "../../shared/errors.js";

/**
 * Application Service for Notes.
 */
export class NoteService {
  constructor(noteRepository, configPath) {
    this.repository = noteRepository;
    this.configPath = configPath;
    this.cache = new Map();
  }

  _getCached(key) {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL_MS) return entry.data;
    return null;
  }

  _setCache(key, data) {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  async getNoteTree(bookSlug) {
    const cacheKey = `note_tree_${bookSlug}`;
    let tree = this._getCached(cacheKey);
    
    if (!tree) {
      tree = await this.repository.getTree(bookSlug);
      this._setCache(cacheKey, tree);
    }
    
    return tree;
  }

  async getNote(bookSlug, slugArray) {
    return await this.repository.getNoteBySlug(bookSlug, slugArray);
  }

  async getAdminRawTree() {
    return await this.repository.getRawTree();
  }

  async getNoteRaw(relativePath) {
    return await this.repository.getNoteByRawPath(relativePath);
  }

  async saveNoteRaw(relativePath, content) {
    await this.repository.saveNoteRawPath(relativePath, content);
    this.cache.clear();
  }

  async deleteRaw(relativePath) {
    await this.repository.deleteRawPath(relativePath);
    this.cache.clear();
  }

  async createCategory(relativePath) {
    await this.repository.createDirectory(relativePath);
    this.cache.clear();
  }

  async createBook(bookName) {
    // 1. Create the directory
    await this.repository.createDirectory(bookName);
    
    // 2. Update notes.json config so it appears in the sidebar
    try {
      const configData = await fs.readFile(this.configPath, "utf-8");
      const config = JSON.parse(configData);
      
      const bookSlug = this.repository._toSlug(bookName);
      const exists = config.books.some(b => b.slug === bookSlug);
      
      if (!exists) {
        config.books.push({
          title: bookName,
          slug: bookSlug
        });
        await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), "utf-8");
      }
    } catch (err) {
      throw new InfrastructureError("Failed to update notes.json config", err);
    }
    
    this.cache.clear();
  }

  flattenTree(nodes, flattened = []) {
    for (const node of nodes) {
      if (node.type === "file") flattened.push(node);
      if (node.children) this.flattenTree(node.children, flattened);
    }
    return flattened;
  }
}
