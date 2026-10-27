import notesConfig from "../../config/notes.json";

/** Slugs of note books that live in this site (external links such as GitBook are skipped). */
export const internalBookSlugs = notesConfig
  .filter((b) => b.link?.startsWith("/notes/"))
  .map((b) => b.link.split("/").pop());
