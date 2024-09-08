import { getHighlighter } from "shiki";

export const prettyCodeOptions = {
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
