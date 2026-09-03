import path from "path";
import { siteMetadata } from "../../site.config.mjs";
import { MarkdownBlogRepository } from "./blog/infrastructure/MarkdownBlogRepository.js";
import { BlogService } from "./blog/application/BlogService.js";
import { MarkdownNoteRepository } from "./note/infrastructure/MarkdownNoteRepository.js";
import { NoteService } from "./note/application/NoteService.js";

// Note: process.cwd() resolves to the root of blog-frontend
const blogDatastorePath = path.join(process.cwd(), siteMetadata.localBlogDatastorePath);
const notesDatastorePath = path.join(process.cwd(), "..", "blog-datastore", "notes");
const notesConfigPath = path.join(process.cwd(), "config", "notes.json");

// Initialize Repositories
const blogRepository = new MarkdownBlogRepository(blogDatastorePath);
const noteRepository = new MarkdownNoteRepository(notesDatastorePath);

// Initialize Application Services
export const blogService = new BlogService(blogRepository);
export const noteService = new NoteService(noteRepository, notesConfigPath);
