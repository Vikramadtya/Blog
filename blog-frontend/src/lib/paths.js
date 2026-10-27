import path from "path";
import { ValidationError } from "../core/shared/errors.js";

// process.cwd() is the blog-frontend root
export const BLOGS_DIR = path.join(process.cwd(), "..", "blog-datastore", "blogs");
export const NOTES_DIR = path.join(process.cwd(), "..", "blog-datastore", "notes");
export const NOTES_CONFIG_PATH = path.join(process.cwd(), "config", "notes.json");

const SAFE_BLOG_FILENAME = /^[A-Za-z0-9][A-Za-z0-9._-]*\.md$/;

/** Resolve a blog filename inside BLOGS_DIR, rejecting anything that isn't a plain *.md name. */
export function resolveBlogFile(filename) {
  if (typeof filename !== "string" || !SAFE_BLOG_FILENAME.test(filename) || filename.includes("..")) {
    throw new ValidationError("Invalid filename");
  }
  return path.join(BLOGS_DIR, filename);
}

/** Resolve a relative path inside `root`, rejecting traversal (including sibling-prefix tricks). */
export function resolveInside(root, relativePath) {
  if (typeof relativePath !== "string" || relativePath.includes("\0")) {
    throw new ValidationError("Invalid path");
  }
  const absolute = path.resolve(root, relativePath);
  const rootResolved = path.resolve(root);
  if (absolute !== rootResolved && !absolute.startsWith(rootResolved + path.sep)) {
    throw new ValidationError("Invalid path traversal");
  }
  return absolute;
}
