// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React _component you want, including inline styles,
// components from other libraries, and more.
import rehypeSlug from "rehype-slug";

export function useMDXComponents(components) {
  return {
    h1: ({ id, children }) => (
      <h1
        className="mt-12 scroll-m-20 pb-10  pt-20  text-4xl font-bold tracking-tight first:mt-0 dark:text-gray-50 md:text-6xl lg:text-8xl"
        id={id}
      >
        {children}
      </h1>
    ),
    h2: ({ id, children }) => (
      <h2
        className="mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 dark:text-gray-50"
        id={id}
      >
        {children}
      </h2>
    ),
    li: ({ children }) => (
      <li className="mt-2 leading-7 text-primary/90 md:text-lg">{children}</li>
    ),
    ul: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2 ps-5 text-sm text-gray-600 marker:text-blue-600 dark:text-gray-100">
        {children}
      </ul>
    ),
    p: ({ children }) => (
      <p className="leading-7 text-primary/90 md:text-lg [&:not(:first-child)]:mt-6">
        {" "}
        {children}
      </p>
    ),
    ...components,
  };
}
