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
    <main className="flex flex-col items-center px-6 md:px-16 lg:px-32 xl:px-48">
      <div className="w-full pb-6 pt-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          {content.notes.title}
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          {content.notes.description}
        </p>
      </div>

      <section className="w-full py-12">
        <div className="-m-4 flex flex-wrap">
          {notesData.map((book) => (
            <div key={book.title} className="w-full p-4 sm:w-1/2 lg:w-1/3">
              <div className="h-full rounded-lg bg-gray-100 bg-opacity-80 p-8 shadow transition hover:shadow-lg dark:bg-zinc-800">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {book.category}
                </h2>
                <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">
                  {book.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                  {book.description}
                </p>
                <Link
                  href={book.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {content.shared.readLabel}
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
