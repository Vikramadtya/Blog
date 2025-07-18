import { getHighlighter } from "shiki";

export const prettyCodeOptions = {
  // Use a light, clean theme inspired by Material Design
  theme: "catppuccin-latte",

  // Let the theme define its own background
  keepBackground: true,

  // Default language fallback
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },

  // Ensure blank lines render properly
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },

  // Define syntax highlighting with preferred languages
  getHighlighter: (options) =>
    getHighlighter({
      ...options,
      langs: [
        "bash",
        "c",
        "cpp",
        "csharp",
        "css",
        "go",
        "html",
        "java",
        "javascript",
        "json",
        "md",
        "php",
        "python",
        "rust",
        "shell",
        "svelte",
        "swift",
        "typescript",
        "yaml",
      ],
    }),
};
