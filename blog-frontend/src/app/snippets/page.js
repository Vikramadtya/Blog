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
          Snippets
        </h1>
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
          Check out my code snippets
        </p>
      </div>
      <section className="body-font text-gray-600">
        <div className="container mx-auto px-5 py-24">
          <div className="-m-4 flex flex-wrap">
            {items.map((book) => (
              <div key={book.title} className="p-4 lg:w-1/3">
                <a
                  href="#"
                  className="block max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Noteworthy technology acquisitions 2021
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Here are the biggest enterprise technology acquisitions of
                    2021 so far, in reverse chronological order.
                  </p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
