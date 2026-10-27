import React from "react";
import { notFound } from "next/navigation";
import { noteService } from "@/core";
import { extractHeadings } from "@/lib/headings";
import Markdown from "@/presentation/ui/Markdown";
import { internalBookSlugs } from "@/lib/books";

// Build every note page at build time (new notes still render on demand).
export async function generateStaticParams() {
  const perBook = await Promise.all(
    internalBookSlugs.map(async (bookSlug) =>
      noteService
        .flattenTree(await noteService.getNoteTree(bookSlug))
        .map((node) => ({ bookSlug, slug: node.path })),
    ),
  );
  return perBook.flat();
}

export async function generateMetadata({ params }) {
  const { bookSlug, slug } = params;
  const noteData = await noteService.getNote(bookSlug, slug);
  if (!noteData) return {};

  return {
    title: noteData.title,
    description: noteData.title,
  };
}

import Link from "next/link";
import NotesToc from "@/presentation/note/NotesToc";
import notesConfig from "../../../../../config/notes.json";

export default async function NotePage({ params }) {
  const { bookSlug, slug } = params;
  
  const noteData = await noteService.getNote(bookSlug, slug);
  
  if (!noteData) {
    notFound();
  }

  const bookConfig = notesConfig.find(b => b.link === `/notes/${bookSlug}`);
  const bookTitle = bookConfig ? bookConfig.title : bookSlug.replace(/-/g, " ");

  const tree = await noteService.getNoteTree(bookSlug);
  const flatTree = noteService.flattenTree(tree);
  
  const currentPathStr = slug.join("/");
  const currentIndex = flatTree.findIndex(node => node.path.join("/") === currentPathStr);
  
  const prevNode = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextNode = currentIndex !== -1 && currentIndex < flatTree.length - 1 ? flatTree[currentIndex + 1] : null;

  const headings = extractHeadings(noteData.content, { minLevel: 2, maxLevel: 3 });

  return (
    <div className="flex gap-8 xl:gap-12 justify-between">
      <div className="flex-1 min-w-0 max-w-3xl pt-2 pb-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href={`/notes/${bookSlug}`} className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors font-medium">
            {bookTitle}
          </Link>
          {slug.slice(0, -1).map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="text-gray-400 dark:text-gray-600">›</span>
              <span className="capitalize font-medium text-gray-700 dark:text-gray-300">
                {crumb.replace(/[-_]+/g, " ")}
              </span>
            </React.Fragment>
          ))}
        </nav>

        <article className="prose prose-neutral dark:prose-invert max-w-none mb-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
            {noteData.title}
          </h1>
          <Markdown source={noteData.content} variant="note" />
        </article>

        {/* Pagination */}
        <div className="mt-12 flex border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden divide-x divide-gray-200 dark:divide-zinc-800">
          {prevNode ? (
            <Link href={`/notes/${bookSlug}/${prevNode.path.join("/")}`} className="flex-1 p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col items-start text-left">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Previous</span>
              <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{prevNode.title}</span>
            </Link>
          ) : (
            <div className="flex-1 p-6" />
          )}
          
          {nextNode ? (
            <Link href={`/notes/${bookSlug}/${nextNode.path.join("/")}`} className="flex-1 p-6 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex flex-col items-end text-right">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Next</span>
              <span className="text-base font-semibold text-blue-600 dark:text-blue-400">{nextNode.title}</span>
            </Link>
          ) : (
            <div className="flex-1 p-6" />
          )}
        </div>
      </div>

      {/* On This Page TOC */}
      <NotesToc headings={headings} />
    </div>
  );
}
