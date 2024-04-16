import fs from "fs";
import path from "path";
import matter from "gray-matter";

import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getHighlighter } from "shiki";
import rehypeSlug from "rehype-slug";

import { Separator } from "../../../components/atom/separator";
import BlogHero from "../../../components/molecules/blogHero";

const prettyCodeOptions = {
  // theme: 'github-dark',
  theme: "catppuccin-latte",
  keepBackground: true, // to use our own background color
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = { type: "text", value: " " };
    }
  },
  getHighlighter: (options) => {
    return getHighlighter({
      ...options,
      langs: [
        "svelte",
        "typescript",
        "html",
        "css",
        "javascript",
        "bash",
        "shell",
        "python",
        "java",
        "md",
        "go",
        "rust",
        "c",
        "cpp",
        "csharp",
        "php",
        "json",
        "yaml",
        "swift",
      ],
    });
  },
};

const projects = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "..",
  "..",
  "..",
  "_markdown_content",
  "blogs",
);
export async function generateStaticParams() {
  const files = fs.readdirSync(projects);

  const paths = files.map((fileName) => ({
    slug: fileName.replace(".mdx", ""),
  }));

  return paths;
}

function getPost({ slug }) {
  const markdownFile = fs.readFileSync(
    path.join(projects, slug + ".mdx"),
    "utf-8",
  );

  const { data: frontMatter, content } = matter(markdownFile);

  const contentMetadata = {
    frontMatter: frontMatter,
  };

  return {
    contentMetadata,
    slug,
    content,
  };
}

export async function generateMetadata({ params }) {
  const props = getPost(params);

  return {
    title: props.contentMetadata.frontMatter.title,
    description: props.contentMetadata.frontMatter.description,
  };
}

export default function Post({ params }) {
  const props = getPost(params);

  return (
    <article className="prose prose-sm mx-auto  pb-20 pt-20 md:prose-base lg:prose-lg ">
      <BlogHero
        title={props.contentMetadata.frontMatter.title}
        tags={props.contentMetadata.frontMatter.tags}
      />
      <Separator className="mb-20 mt-20" />

      <MDXRemote
        source={props.content}
        options={{
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
          },
        }}
      />
    </article>
  );
}
