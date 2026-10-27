import { MDXRemote } from "next-mdx-remote/rsc";
import { rehypePrettyCode } from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { getMDXComponents } from "@/presentation/ui/MdxComponents";
import { prettyCodeOptions } from "@/lib/markdownConstants";

const autolinkByVariant = {
  blog: {
    properties: { className: ["anchor"], ariaLabel: "Link to section" },
  },
  note: {
    behavior: "prepend",
    properties: { className: ["anchor-link"] },
    content: {
      type: "element",
      tagName: "span",
      properties: { className: ["anchor-icon"] },
      children: [{ type: "text", value: "# " }],
    },
  },
};

/**
 * The one markdown pipeline for blogs and notes.
 * Blog posts are MDX; notes are plain markdown, so `{`, `<` and `&` stay literal.
 */
export default function Markdown({ source, variant = "blog" }) {
  return (
    <MDXRemote
      source={source}
      components={getMDXComponents()}
      options={{
        mdxOptions: {
          format: variant === "note" ? "md" : "mdx",
          remarkPlugins: [remarkGfm, remarkMath],
          rehypePlugins: [
            rehypeKatex,
            rehypeSlug,
            [rehypeAutolinkHeadings, autolinkByVariant[variant]],
            [rehypePrettyCode, prettyCodeOptions],
          ],
        },
      }}
    />
  );
}
