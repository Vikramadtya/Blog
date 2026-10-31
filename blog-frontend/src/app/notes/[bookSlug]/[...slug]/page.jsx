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
  const { bookSlug, slug } = await params;
  const noteData = await noteService.getNote(bookSlug, slug);
  if (!noteData) return {};

  return {
    title: noteData.title,
    description: noteData.title,
  };
}

import Link from "next/link";
import NotesToc, { MobileToc } from "@/presentation/note/NotesToc";
import { calculateReadingTime } from "@/lib/readingTime";
import notesConfig from "../../../../../config/notes.json";

const prettify = (segment) =>
  segment.replace(/^[0-9]+[.\-\s]*/, "").replace(/[-_]+/g, " ");

function PagerCard({ href, label, title, align }) {
  const isNext = align === "right";
  return (
    <Link
      href={href}
      className={`group flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md sm:p-5 ${
        isNext ? "items-end text-right" : "items-start text-left"
      }`}
    >
      <span className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {!isNext && (
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            ←
          </span>
        )}
        {label}
        {isNext && (
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-0.5"
          >
            →
          </span>
        )}
      </span>
      <span className="font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
        {title}
      </span>
    </Link>
  );
}

export default async function NotePage({ params }) {
  const { bookSlug, slug } = await params;

  const noteData = await noteService.getNote(bookSlug, slug);
  if (!noteData) notFound();

  const bookConfig = notesConfig.find((b) => b.link === `/notes/${bookSlug}`);
  const bookTitle = bookConfig ? bookConfig.title : bookSlug.replace(/-/g, " ");

  const tree = await noteService.getNoteTree(bookSlug);
  const flatTree = noteService.flattenTree(tree);

  const currentPathStr = slug.join("/");
  const currentIndex = flatTree.findIndex(
    (node) => node.path.join("/") === currentPathStr,
  );
  const prevNode = currentIndex > 0 ? flatTree[currentIndex - 1] : null;
  const nextNode =
    currentIndex !== -1 && currentIndex < flatTree.length - 1
      ? flatTree[currentIndex + 1]
      : null;

  const headings = extractHeadings(noteData.content, {
    minLevel: 2,
    maxLevel: 3,
  });
  const folders = slug.slice(0, -1);

  return (
    <div className="flex justify-between gap-10 xl:gap-14">
      <div className="min-w-0 max-w-3xl flex-1 pb-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground"
        >
          <Link
            href={`/notes/${bookSlug}`}
            className="text-primary transition-colors hover:text-primary/80"
          >
            {bookTitle}
          </Link>
          {folders.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span>{prettify(crumb)}</span>
            </React.Fragment>
          ))}
        </nav>

        <header className="mb-8 border-b border-border pb-7">
          <h1 className="font-display text-[2rem] font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
            {noteData.title}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            {calculateReadingTime(noteData.content)}
          </p>
        </header>

        <MobileToc headings={headings} />

        <article className="note-article max-w-none">
          <Markdown source={noteData.content} variant="note" />
        </article>

        <nav
          aria-label="Previous and next note"
          className="mt-16 grid gap-3 sm:grid-cols-2"
        >
          {prevNode ? (
            <PagerCard
              href={`/notes/${bookSlug}/${prevNode.path.join("/")}`}
              label="Previous"
              title={prevNode.title}
              align="left"
            />
          ) : (
            <div className="hidden sm:block" />
          )}
          {nextNode && (
            <PagerCard
              href={`/notes/${bookSlug}/${nextNode.path.join("/")}`}
              label="Next"
              title={nextNode.title}
              align="right"
            />
          )}
        </nav>
      </div>

      <NotesToc headings={headings} />
    </div>
  );
}
