import Link from "next/link";
import { notFound } from "next/navigation";
import { noteService } from "@/core";
import { internalBookSlugs } from "@/lib/books";
import notesConfig from "../../../../config/notes.json";

const PREVIEW_COUNT = 8;

export function generateStaticParams() {
  return internalBookSlugs.map((bookSlug) => ({ bookSlug }));
}

export async function generateMetadata({ params }) {
  const { bookSlug } = await params;
  const book = notesConfig.find((b) => b.link === `/notes/${bookSlug}`);
  return book
    ? { title: `${book.title} · Contents`, description: book.description }
    : {};
}

/** Turns the note tree into flat "chapters": one tile per folder/section that directly holds notes. */
function toChapters(tree) {
  const chapters = [];
  const rootFiles = tree.filter((n) => n.type === "file");
  if (rootFiles.length)
    chapters.push({ title: "Start here", notes: rootFiles });

  const walk = (nodes, trail) => {
    for (const node of nodes) {
      if (node.type === "file") continue;
      const crumb = [...trail, node.title];
      const notes = (node.children || []).filter((n) => n.type === "file");
      if (notes.length)
        chapters.push({
          title: crumb.join(" › "),
          description: node.description,
          notes,
        });
      walk(node.children || [], crumb);
    }
  };
  walk(tree, []);
  return chapters;
}

function NoteItem({ bookSlug, note }) {
  return (
    <li>
      <Link
        href={`/notes/${bookSlug}/${note.path.join("/")}`}
        className="group/item -mx-2 flex items-baseline gap-2.5 rounded-md px-2 py-1.5 text-[0.95rem] leading-snug text-foreground/85 transition-colors hover:bg-accent hover:text-primary"
      >
        <span
          aria-hidden="true"
          className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-border transition-colors group-hover/item:bg-primary"
        />
        <span>{note.title}</span>
      </Link>
    </li>
  );
}

function ChapterTile({ chapter, index, bookSlug }) {
  const preview = chapter.notes.slice(0, PREVIEW_COUNT);
  const more = chapter.notes.slice(PREVIEW_COUNT);

  return (
    <section className="flex flex-col rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md sm:p-6">
      <header className="mb-3 flex items-start gap-4">
        <span
          className="font-display text-3xl font-extrabold leading-none text-primary/30"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold leading-tight text-foreground">
            {chapter.title}
          </h2>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {chapter.notes.length}{" "}
            {chapter.notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      </header>
      {chapter.description && (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          {chapter.description}
        </p>
      )}

      <ul className="space-y-0.5">
        {preview.map((note) => (
          <NoteItem key={note.path.join("/")} bookSlug={bookSlug} note={note} />
        ))}
      </ul>
      {more.length > 0 && (
        <details className="group mt-1">
          <summary className="-mx-2 cursor-pointer list-none rounded-md px-2 py-1.5 text-sm font-semibold text-primary hover:bg-accent [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Show {more.length} more</span>
            <span className="hidden group-open:inline">Show less</span>
          </summary>
          <ul className="space-y-0.5">
            {more.map((note) => (
              <NoteItem
                key={note.path.join("/")}
                bookSlug={bookSlug}
                note={note}
              />
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}

export default async function BookIndexPage({ params }) {
  const { bookSlug } = await params;
  const book = notesConfig.find((b) => b.link === `/notes/${bookSlug}`);

  const tree = await noteService.getNoteTree(bookSlug);
  const flat = noteService.flattenTree(tree);
  if (!book && flat.length === 0) notFound();

  if (flat.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold text-foreground">
          This book is empty
        </h2>
        <p className="mt-2 text-muted-foreground">
          There are no notes found in this directory.
        </p>
      </div>
    );
  }

  const chapters = toChapters(tree);
  const first = flat[0];
  const sectionCount = chapters.filter((c) => c.title !== "Start here").length;

  return (
    <div className="pb-12">
      <header className="mb-10 border-b border-border pb-8">
        <p className="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-primary">
          {book?.category ?? "Book"}
        </p>
        <h1 className="mt-3 font-display text-[2rem] font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl">
          {book?.title ?? bookSlug.replace(/-/g, " ")}
        </h1>
        {book?.description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {book.description}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            href={`/notes/${bookSlug}/${first.path.join("/")}`}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Start reading <span aria-hidden="true">→</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            {flat.length} notes
            {sectionCount > 0 &&
              ` · ${sectionCount} ${sectionCount === 1 ? "section" : "sections"}`}
          </p>
        </div>
      </header>

      <h2 className="mb-5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        Table of contents
      </h2>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 [&>*]:self-start">
        {chapters.map((chapter, i) => (
          <ChapterTile
            key={chapter.title}
            chapter={chapter}
            index={i}
            bookSlug={bookSlug}
          />
        ))}
      </div>
    </div>
  );
}
