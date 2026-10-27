import GithubSlugger from "github-slugger";

/**
 * Extract headings from markdown with the same slugs `rehype-slug` generates
 * (github-slugger, including de-duplication of repeated headings).
 * Fenced code blocks are skipped so `# comment` lines in code aren't treated as headings.
 */
export function extractHeadings(markdown, { minLevel = 1, maxLevel = 3 } = {}) {
  if (!markdown) return [];
  const slugger = new GithubSlugger();
  const headings = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{1,6})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length;
    if (level < minLevel || level > maxLevel) continue;
    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "");
    headings.push({ level, heading: text, slug: slugger.slug(text) });
  }
  return headings;
}
