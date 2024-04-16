import remarkGfm from "remark-gfm";
import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";

import { getHighlighter } from "shiki";

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

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,

  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
