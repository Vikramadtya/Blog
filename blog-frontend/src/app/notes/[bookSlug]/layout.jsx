import React from "react";
import { noteService } from "@/core";
import NotesSidebar from "@/presentation/note/NotesSidebar";
import notesConfig from "../../../../config/notes.json";

export default async function NotesLayout({ children, params }) {
  const { bookSlug } = await params;

  // Find the book title from config
  const bookConfig = notesConfig.find((b) => {
    const linkSlug = b.link.split("/").pop().replace(/-$/, "");
    return (
      linkSlug === bookSlug ||
      b.title.toLowerCase().replace(/\s+/g, "-") === bookSlug
    );
  });

  const bookTitle = bookConfig ? bookConfig.title : bookSlug;
  const tree = await noteService.getNoteTree(bookSlug);

  // Extract all books for the dropdown
  const allBooks = notesConfig
    .filter((b) => b.category === "BOOK" && b.link.startsWith("/notes/"))
    .map((b) => ({
      title: b.title,
      slug: b.link.split("/").pop(),
    }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:gap-10">
        <NotesSidebar tree={tree} bookSlug={bookSlug} allBooks={allBooks} />
        <main className="min-w-0 flex-1 py-6 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
