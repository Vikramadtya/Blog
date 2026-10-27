import React from "react";
import { cn } from "@/lib/utils";
import CopyButton from '@/presentation/ui/CopyButton';
import Mermaid from '@/presentation/components/LazyMermaid';

export function getMDXComponents(components) {
  return {
    pre: ({ children, className, ...props }) => {
      const isMermaid = 
        props["data-language"] === "mermaid" || 
        children?.props?.["data-language"] === "mermaid" ||
        className?.includes("language-mermaid");

      const extractText = (node) => {
        if (typeof node === "string" || typeof node === "number") return String(node);
        if (!node) return "";
        if (Array.isArray(node)) return node.map(extractText).join("");
        
        let text = "";
        if (node.props && node.props.children) {
          text = extractText(node.props.children);
        }
        
        // rehype-pretty-code wraps each line in a span with data-line
        if (node.props && "data-line" in node.props) {
          text += "\n";
        }
        return text;
      };

      let rawText = "";
      try {
        rawText = extractText(children);
      } catch (e) {
        console.warn("Failed to extract text for CopyButton");
      }

      if (isMermaid) {
        return <Mermaid chart={rawText} />;
      }

      return (
        <div className="group relative my-8 overflow-hidden rounded-2xl border border-gray-200/90 dark:border-zinc-800 bg-[#fcfcfd] dark:bg-[#121614] shadow-sm">
          <div className="absolute right-3.5 top-3.5 z-20 opacity-0 transition-opacity group-hover:opacity-100">
            <CopyButton text={rawText} />
          </div>
          <pre
            className={cn(
              "overflow-x-auto p-6 font-mono text-[13.5px] leading-relaxed selection:bg-blue-500/20",
              className
            )}
            style={{ margin: 0, border: "none", background: "transparent" }}
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
            isBlockCode && "bg-transparent font-mono text-[13.5px]",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ id, className, children }) => (
      <h1 id={id} className={cn("mt-14 scroll-m-20 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground", className)}>
        {children}
      </h1>
    ),
    h2: ({ id, className, children }) => (
      <h2 id={id} className={cn("group mt-12 scroll-m-20 text-2xl sm:text-3xl font-bold tracking-tight text-foreground transition-colors flex items-center", className)}>
        {children}
      </h2>
    ),
    h3: ({ id, className, children }) => (
      <h3 id={id} className={cn("group mt-8 scroll-m-20 text-xl font-bold tracking-tight text-foreground flex items-center", className)}>
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
      <blockquote className={cn("mt-8 border-l-4 border-indigo-500 bg-indigo-500/5 py-4 pr-4 pl-6 text-muted-foreground dark:bg-indigo-500/10 [&>p]:italic [&>p:first-child]:mt-0 [&>p:last-child]:mb-0 [&_code]:not-italic [&_pre]:not-italic", className)}>
        {children}
      </blockquote>
    ),
    a: ({ className, children, href }) => {
      const isExternal = href?.startsWith("http");
      if (className?.includes("anchor-link")) {
        return (
          <a
            href={href}
            aria-label="Section anchor"
            className="no-underline text-gray-400 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition-colors select-none mr-2 font-normal"
          >
            {children}
          </a>
        );
      }
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
      <div className="my-6 w-full overflow-x-auto">
        <table className={cn("w-full border-collapse text-left text-sm", className)}>{children}</table>
      </div>
    ),
    thead: ({ className, children }) => (
      <thead className={cn("bg-gray-100/90 dark:bg-zinc-800/80 rounded-lg", className)}>
        {children}
      </thead>
    ),
    tr: ({ className, children }) => (
      <tr className={cn("border-none", className)}>{children}</tr>
    ),
    th: ({ className, children }) => (
      <th className={cn("px-6 py-2.5 text-sm font-medium text-gray-800 dark:text-gray-200 first:rounded-l-lg last:rounded-r-lg border-none", className)}>
        {children}
      </th>
    ),
    td: ({ className, children }) => (
      <td className={cn("px-6 py-3.5 text-sm text-gray-800 dark:text-gray-200 align-middle border-none [&:not(:first-child)]:border-l [&:not(:first-child)]:border-gray-200 dark:[&:not(:first-child)]:border-zinc-700", className)}>
        {children}
      </td>
    ),
    ...components,
  };
}
