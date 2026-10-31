import Link from "next/link";
import notesData from "../../../config/notes.json";
import content from "../../../config/content.json";
import { siteMetadata } from "../../../site.config.mjs";

export async function generateMetadata() {
  return {
    title: `${content.notes.title} | ${siteMetadata.title}`,
    description: content.notes.description,
  };
}

export default function Notes() {
  return (
    <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <header className="pb-8 pt-12 text-center sm:pt-16">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {content.notes.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {content.notes.description}
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {notesData.map((book) => {
          const external = book.link.startsWith("http");
          return (
            <Link
              key={book.title}
              href={book.link}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg sm:p-7"
            >
              <span className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-primary">
                {book.category}
              </span>
              <h2 className="mt-3 font-display text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {book.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {book.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {content.shared.readLabel}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
