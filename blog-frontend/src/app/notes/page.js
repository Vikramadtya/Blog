import React from "react";
import Link from "next/link";

const items = [
  {
    category: "BOOK",
    title: "Algorithmic Pattern",
    description:
      "An easy guide on Algorithms and Data Structures, this book will walk you through the basics in a simple, friendly way.",
    link: "https://private-26.gitbook.io/notes/v/algorithmic-pattern",
  },
  {
    category: "BOOK",
    title: "Design Pattern",
    description:
      "An easy guide on Algorithms and Data Structures, this book will walk you through the basics in a simple, friendly way.",
    link: "https://private-26.gitbook.io/notes/v/design-patterns/",
  },
  {
    category: "BOOK",
    title: "System Design",
    description:
      "An easy guide on Algorithms and Data Structures, this book will walk you through the basics in a simple, friendly way.",
    link: "https://private-26.gitbook.io/notes/v/system-design",
  },
  {
    category: "BOOK",
    title: "Coding Problems",
    description:
      "An easy guide on Algorithms and Data Structures, this book will walk you through the basics in a simple, friendly way.",
    link: "https://private-26.gitbook.io/notes/v/coding",
  },
  {
    category: "BOOK",
    title: "All",
    description:
      "An easy guide on Algorithms and Data Structures, this book will walk you through the basics in a simple, friendly way.",
    link: "https://private-26.gitbook.io/notes",
  },
];

export default async function Notes() {
  return (
    <main className="flex flex-col items-center justify-between px-12 md:px-24 lg:px-32 xl:px-48">
      <div className="w-full space-y-2 pb-8 pt-6 md:space-y-5 ">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl sm:leading-10 md:text-6xl md:leading-relaxed">
          Notes
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Check out my writings
        </p>
      </div>
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="-m-4 flex flex-wrap">
            {items.map((book) => (
              <div key={book.title} className="p-4 lg:w-1/3">
                <div className="relative h-full overflow-hidden rounded-lg bg-gray-100 bg-opacity-75 px-8 pb-24 pt-16 text-center">
                  <h2 className="title-font mb-1 text-xs font-medium tracking-widest text-gray-400">
                    {book.category}
                  </h2>
                  <h1 className="title-font mb-3 text-xl font-medium text-gray-900 sm:text-2xl">
                    {book.title}
                  </h1>
                  <p className="mb-3 leading-relaxed">{book.description}</p>
                  <Link
                    className="inline-flex items-center text-indigo-500"
                    href={book.link}
                  >
                    Read
                    <svg
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </Link>
                  {/*<div*/}
                  {/*  className="absolute bottom-0 left-0 mt-2 flex w-full justify-center py-4 text-center leading-none">*/}
                  {/*<span*/}
                  {/*  className="mr-3 inline-flex items-center border-r-2 border-gray-200 py-1 pr-3 text-sm leading-none text-gray-400">*/}
                  {/*  <svg*/}
                  {/*    className="mr-1 h-4 w-4"*/}
                  {/*    stroke="currentColor"*/}
                  {/*    strokeWidth="2"*/}
                  {/*    fill="none"*/}
                  {/*    strokeLinecap="round"*/}
                  {/*    strokeLinejoin="round"*/}
                  {/*    viewBox="0 0 24 24"*/}
                  {/*  >*/}
                  {/*    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>*/}
                  {/*    <circle cx="12" cy="12" r="3"></circle>*/}
                  {/*  </svg>*/}
                  {/*  1.2K*/}
                  {/*</span>*/}
                  {/*  <span className="inline-flex items-center text-sm leading-none text-gray-400">*/}
                  {/*  <svg*/}
                  {/*    className="mr-1 h-4 w-4"*/}
                  {/*    stroke="currentColor"*/}
                  {/*    strokeWidth="2"*/}
                  {/*    fill="none"*/}
                  {/*    strokeLinecap="round"*/}
                  {/*    strokeLinejoin="round"*/}
                  {/*    viewBox="0 0 24 24"*/}
                  {/*  >*/}
                  {/*    <path*/}
                  {/*      d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>*/}
                  {/*  </svg>*/}
                  {/*  6*/}
                  {/*</span>*/}
                  {/*</div>*/}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
