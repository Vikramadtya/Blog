import { JSDOM } from 'jsdom';
import rs from 'text-readability';

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

export function getRandomColor() {
  const colors = ['#27ae60', '#e74c3c', '#3498db', '#f1c40f', '#8e44ad'];
  return colors[Math.floor(Math.random() * colors.length)];
}

export function countWords(text) {
  return text.split(/\s+/).length;
}

export function extractLinks(html) {
  const internal = [];
  const external = [];
  const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const link = match[1];
    if (link.startsWith('http') || link.startsWith('//')) {
      external.push(link);
    } else {
      internal.push(link);
    }
  }
  return { internal, external };
}

export function extractCodeInfo(text) {
  const codeBlocks = text.match(/```(\w+)?\n([\s\S]*?)\n```/g) || [];
  const languages = (text.match(/```(\w+)/g) || []).map((lang) =>
    lang.substring(3),
  );
  return {
    count: codeBlocks.length,
    languages: [...new Set(languages)], // Store unique languages
  };
}

export function generateExcerpt(html, maxLength = 160) {
  const dom = new JSDOM(html);
  const firstParagraph = dom.window.document.querySelector('p');
  if (!firstParagraph) {
    return '';
  }
  let text = firstParagraph.textContent.trim();
  if (text.length > maxLength) {
    text = text.substring(0, maxLength - 3) + '...';
  }
  return text;
}

/**
 * Extracts the most common words from text to be used as keywords.
 * @param {string} text The plain text content.
 * @param {number} count The number of keywords to return.
 * @returns {string[]} An array of keywords.
 */
export function extractKeywords(text, count = 5) {
  const stopWords = new Set([
    'a',
    'an',
    'the',
    'in',
    'on',
    'of',
    'for',
    'to',
    'with',
    'is',
    'it',
    'and',
    'or',
    'but',
    // Add more common words as needed
  ]);

  const wordCounts = {};
  const words = text.toLowerCase().match(/\b(\w+)\b/g) || [];

  words.forEach((word) => {
    if (!stopWords.has(word) && isNaN(word)) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }
  });

  return Object.entries(wordCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, count)
    .map(([word]) => word);
}

export function getReadabilityScores(text) {
  return {
    fleschReadingEase: rs.fleschReadingEase(text),
    fleschKincaidGrade: rs.fleschKincaidGrade(text),
    gunningFog: rs.gunningFog(text),
    colemanLiauIndex: rs.colemanLiauIndex(text),
    smogIndex: rs.smogIndex(text),
    automatedReadabilityIndex: rs.automatedReadabilityIndex(text),
    daleChallReadabilityScore: rs.daleChallReadabilityScore(text),
    linsearWriteFormula: rs.linsearWriteFormula(text),
    textStandard: rs.textStandard(text),
  };
}

export function analyzeKeywordDensity(text, keywords) {
  const totalWords = countWords(text);
  if (totalWords === 0) return [];
  return keywords.map((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const frequency = (text.match(regex) || []).length;
    const density = ((frequency / totalWords) * 100).toFixed(2) + '%';
    return { keyword, frequency, density };
  });
}
