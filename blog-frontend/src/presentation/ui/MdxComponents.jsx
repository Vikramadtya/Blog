import React from "react";
import { cn } from "@/lib/utils";
import CopyButton from '@/presentation/ui/CopyButton';

export function getMDXComponents(components) {
  return {
    pre: ({ children, className, ...props }) => {
      const extractText = (node) => {
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (!node) return "";
        if (Array.isArray(node)) return node.map(extractText).join("");
        if (node.props && node.props.children) return extractText(node.props.children);
        return "";
      };

      let rawText = "";
      try {
        rawText = extractText(children);
      } catch (e) {
        console.warn("Failed to extract text for CopyButton");
      }

      return (
        <div className="group relative my-8 overflow-hidden rounded-xl border border-border shadow-sm">
          <div className="absolute right-3 top-3 z-20 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton text={rawText} />
          </div>
          <pre
            className={cn(
              "overflow-x-auto p-4 text-[13px] leading-relaxed selection:bg-indigo-500/30",
              className
            )}
            {...props}
          >
            {children}
          </pre>
        </div>
      );
    },
    code: ({ className, children, ...props }) => {
      // rehype-pretty-code adds a 'data-language' prop to block code.
      // If it doesn't exist, it's an inline `code` snippet.
      const isBlockCode = props["data-language"] !== undefined || props["data-theme"] !== undefined;
      return (
        <code
          className={cn(
            !isBlockCode && "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-[13px] font-semibold text-foreground",
            isBlockCode && "bg-transparent font-mono text-[13px]",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ id, className, children }) => (
      <h1 id={id} className={cn("mt-14 scroll-m-20 pb-4 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl", className)}>
        {children}
      </h1>
    ),
    h2: ({ id, className, children }) => (
      <h2 id={id} className={cn("mt-16 scroll-m-20 border-b border-border pb-3 text-3xl font-semibold tracking-tight text-foreground transition-colors", className)}>
        {children}
      </h2>
    ),
    h3: ({ id, className, children }) => (
      <h3 id={id} className={cn("mt-10 scroll-m-20 text-2xl font-semibold tracking-tight text-foreground", className)}>
        {children}
      </h3>
    ),
    p: ({ className, children }) => (
      <p className={cn("mt-6 text-base leading-7 text-muted-foreground", className)}>
        {children}
      </p>
    ),
    ul: ({ className, children }) => (
      <ul className={cn("my-6 ml-6 list-disc space-y-2 text-muted-foreground marker:text-indigo-500", className)}>
        {children}
      </ul>
    ),
    ol: ({ className, children }) => (
      <ol className={cn("my-6 ml-6 list-decimal space-y-2 text-muted-foreground", className)}>
        {children}
      </ol>
    ),
    li: ({ className, children }) => (
      <li className={cn("mt-2 text-base leading-7", className)}>
        {children}
      </li>
    ),
    blockquote: ({ className, children }) => (
      <blockquote className={cn("mt-8 border-l-4 border-indigo-500 bg-indigo-500/5 py-1 pr-4 pl-6 italic text-muted-foreground dark:bg-indigo-500/10", className)}>
        {children}
      </blockquote>
    ),
    a: ({ className, children, href }) => {
      const isExternal = href?.startsWith("http");
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className={cn("font-medium text-indigo-600 underline underline-offset-4 transition-colors hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300", className)}
        >
          {children}
        </a>
      );
    },
    hr: ({ className }) => (
      <hr className={cn("my-12 border-t border-border", className)} />
    ),
    table: ({ className, children }) => (
      <div className="my-8 w-full overflow-y-auto rounded-lg border border-border">
        <table className={cn("w-full text-left text-sm", className)}>{children}</table>
      </div>
    ),
    th: ({ className, children }) => (
      <th className={cn("border-b border-border bg-muted px-4 py-3 font-semibold text-foreground", className)}>
        {children}
      </th>
    ),
    td: ({ className, children }) => (
      <td className={cn("border-b border-border px-4 py-3 text-muted-foreground", className)}>
        {children}
      </td>
    ),
    ...components,
  };
}
