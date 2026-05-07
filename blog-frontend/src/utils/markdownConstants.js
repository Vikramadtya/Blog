export const prettyCodeOptions = {
  // Ultra-reliable standard themes
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  
  // Keep background true for full metadata generation
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
  // In rehype-pretty-code 0.13.0+, shiki is handled internally.
  // We can pass shiki options directly.
};
