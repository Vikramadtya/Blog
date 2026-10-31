import fs from "fs/promises";
import path from "path";
import { applySections } from "../domain/sections.js";
import { CACHE_TTL_MS } from "../../../lib/constants.js";
import {
  InfrastructureError,
  NotFoundError,
  ValidationError,
} from "../../shared/errors.js";

/**
 * Application Service for Notes.
 */
export class NoteService {
  constructor(noteRepository, configPath, sectionsPath = null) {
    this.repository = noteRepository;
    this.configPath = configPath;
    this.sectionsPath = sectionsPath;
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
      tree = applySections(
        await this.repository.getTree(bookSlug),
        await this._getSections(bookSlug),
      );
      this._setCache(cacheKey, tree);
    }

    return tree;
  }

  async _getSections(bookSlug) {
    if (!this.sectionsPath) return [];
    try {
      return (
        JSON.parse(await fs.readFile(this.sectionsPath, "utf-8"))[bookSlug] ??
        []
      );
    } catch (err) {
      if (err.code === "ENOENT") return [];
      throw new InfrastructureError("Failed to read note-sections.json", err);
    }
  }

  async getNote(bookSlug, slugArray) {
    try {
      return await this.repository.getNoteBySlug(bookSlug, slugArray);
    } catch (err) {
      if (err instanceof NotFoundError) return null;
      throw err;
    }
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
    // Book folders are addressed by slug everywhere (routes, sidebar), so create the folder as the slug.
    const bookSlug = this.repository._toSlug(bookName);
    if (!bookSlug) throw new ValidationError("Invalid book name");
    await this.repository.createDirectory(bookSlug);

    try {
      // notes.json is an array of { category, title, description?, link }
      const config = JSON.parse(await fs.readFile(this.configPath, "utf-8"));
      const link = `/notes/${bookSlug}`;
      if (!config.some((b) => b.link === link)) {
        config.push({ category: "BOOK", title: bookName, link });
        await fs.writeFile(
          this.configPath,
          JSON.stringify(config, null, 2) + "\n",
          "utf-8",
        );
      }
    } catch (err) {
      throw new InfrastructureError("Failed to update notes.json config", err);
    }

    this.cache.clear();
    return bookSlug;
  }

  flattenTree(nodes, flattened = []) {
    for (const node of nodes) {
      if (node.type === "file") flattened.push(node);
      if (node.children) this.flattenTree(node.children, flattened);
    }
    return flattened;
  }
}
