import React from "react";
import { cn } from "@/lib/utils";

import CopyButton from "./CopyButton";

export function getMDXComponents(components) {
  return {
    pre: ({ children, className, ...props }) => {
      return (
        <div className="group relative my-8 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm transition-all hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="absolute right-4 top-4 z-20">
            <CopyButton text={""} /> {/* We'll fix the text extraction later */}
          </div>
          <pre
            className={cn(
              "overflow-x-auto !bg-transparent p-6 text-sm leading-7 text-foreground selection:bg-indigo-500/30",
              className
            )}
            style={{ ...props.style, backgroundColor: "transparent" }}
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    h1: ({ id, className, children }) => (
      <h1
        id={id}
        className={cn(
          "scroll-m-20 pb-6 pt-16 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl",
          className
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ id, className, children }) => (
      <h2
        id={id}
        className={cn(
          "mt-12 scroll-m-20 border-b border-gray-200 pb-2 text-2xl font-semibold tracking-tight text-gray-800 dark:border-gray-700 dark:text-white md:text-3xl",
          className
        )}
      >
        {children}
      </h2>
    ),
    p: ({ className, children }) => (
      <p className={cn("mt-4 text-base leading-7 text-gray-700 dark:text-gray-300", className)}>
        {children}
      </p>
    ),
    ul: ({ className, children }) => (
      <ul className={cn("ml-6 list-disc space-y-2 text-base text-gray-700 marker:text-indigo-600 dark:text-gray-300", className)}>
        {children}
      </ul>
    ),
    li: ({ className, children }) => (
      <li className={cn("mt-4 text-base leading-7 text-gray-700 dark:text-gray-300", className)}>
        {children}
      </li>
    ),
    ...components,
  };
}

