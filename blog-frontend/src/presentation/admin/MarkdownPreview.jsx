"use client";

import React from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Mermaid from "@/presentation/components/LazyMermaid";
import { resolveMediaUrl } from "@/lib/media";

export default function MarkdownPreview({ content, baseDir = "" }) {
  return (
    <div className="prose prose-indigo max-w-none p-6 dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        urlTransform={(url, key) =>
          defaultUrlTransform(
            key === "src" ? resolveMediaUrl(baseDir, url) : url,
          )
        }
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (!inline && language === "mermaid") {
              return <Mermaid chart={String(children).replace(/\n$/, "")} />;
            }

            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            // For relative paths like /notes-assets/img.png it works out of the box
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              alt=""
              {...props}
              className="max-w-full rounded-lg shadow-sm"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
