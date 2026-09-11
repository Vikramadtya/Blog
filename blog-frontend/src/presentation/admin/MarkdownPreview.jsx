"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import Mermaid from "@/presentation/components/Mermaid";

export default function MarkdownPreview({ content }) {
  return (
    <div className="prose prose-indigo dark:prose-invert max-w-none p-6">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
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
          img: ({node, ...props}) => (
            // For relative paths like /notes-assets/img.png it works out of the box
            /* eslint-disable-next-line @next/next/no-img-element */
            <img {...props} className="rounded-lg shadow-sm max-w-full" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
