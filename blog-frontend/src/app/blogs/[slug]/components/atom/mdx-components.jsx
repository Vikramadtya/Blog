export function useMDXComponents(components) {
  return {
    h1: ({ id, children }) => (
      <h1
        id={id}
        className="scroll-m-20 pb-6 pt-16 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl"
      >
        {children}
      </h1>
    ),
    h2: ({ id, children }) => (
      <h2
        id={id}
        className="mt-12 scroll-m-20 border-b border-gray-200 pb-2 text-2xl font-semibold tracking-tight text-gray-800 dark:border-gray-700 dark:text-white md:text-3xl"
      >
        {children}
      </h2>
    ),
    p: ({ children }) => (
      <p className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="ml-6 list-disc space-y-2 text-base text-gray-700 marker:text-blue-600 dark:text-gray-300">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="mt-4 text-base leading-7 text-gray-700 dark:text-gray-300">
        {children}
      </li>
    ),
    ...components,
  };
}
