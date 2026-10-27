import { BLOGS_DIR, NOTES_DIR, NOTES_CONFIG_PATH } from "../lib/paths.js";
import { MarkdownBlogRepository } from "./blog/infrastructure/MarkdownBlogRepository.js";
import { BlogService } from "./blog/application/BlogService.js";
import { MarkdownNoteRepository } from "./note/infrastructure/MarkdownNoteRepository.js";
import { NoteService } from "./note/application/NoteService.js";


// Initialize Repositories
const blogRepository = new MarkdownBlogRepository(BLOGS_DIR);
const noteRepository = new MarkdownNoteRepository(NOTES_DIR);

// Initialize Application Services
export const blogService = new BlogService(blogRepository);
export const noteService = new NoteService(noteRepository, NOTES_CONFIG_PATH);
