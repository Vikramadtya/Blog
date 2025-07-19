export function estimateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function generateToc(text) {
  const toc = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.startsWith('#')) {
      const level = line.indexOf(' ');
      const title = line.substring(level + 1);
      toc.push({ level, title });
    }
  }
  return toc;
}

// Add this function to utils/helpers.js
export function getRandomColor() {
  const colors = ['#27ae60', '#e74c3c', '#3498db', '#f1c40f', '#8e44ad'];
  return colors[Math.floor(Math.random() * colors.length)];
}
