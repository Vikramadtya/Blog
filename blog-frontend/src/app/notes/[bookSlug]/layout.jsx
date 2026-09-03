import React from "react";
import { getNotesTree } from "@/core";
import NotesSidebar from "@/presentation/note/NotesSidebar";
import notesConfig from "../../../../config/notes.json";

export default async function NotesLayout({ children, params }) {
  const { bookSlug } = params;
  
  // Find the book title from config
  const bookConfig = notesConfig.find(b => {
    const linkSlug = b.link.split('/').pop().replace(/-$/, '');
    return linkSlug === bookSlug || b.title.toLowerCase().replace(/\s+/g, '-') === bookSlug;
  });
  
  const bookTitle = bookConfig ? bookConfig.title : bookSlug;
  const tree = await noteService.getNoteTree(bookSlug);

  // Extract all books for the dropdown
  const allBooks = notesConfig
    .filter(b => b.category === "BOOK" && b.link.startsWith("/notes/"))
    .map(b => ({
      title: b.title,
      slug: b.link.split("/").pop()
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <NotesSidebar tree={tree} bookSlug={bookSlug} allBooks={allBooks} />
        <main className="flex-1 py-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
