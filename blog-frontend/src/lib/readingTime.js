/**
 * Calculates the estimated reading time for a given text.
 * @param {string} text - The content to analyze.
 * @param {number} wordsPerMinute - Average reading speed (default 225).
 * @returns {string} - Formatted reading time (e.g., "5 min read").
 */
export function calculateReadingTime(text, wordsPerMinute = 225) {
  if (!text) return "0 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}
