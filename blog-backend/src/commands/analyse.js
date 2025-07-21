import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import Table from 'cli-table3';
import { PATH_TO_BLOGS, BLOG_FILE_NAME } from '../config.js';
import logger from '../logger.js';
import ora from 'ora';
import {
  extractKeywords,
  getReadabilityScores,
  analyzeKeywordDensity,
} from '../utils/helpers.js';

export async function analyseBlog(blogId) {
  const spinner = ora(`Analyzing blog: ${blogId}`).start();
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  if (!fs.existsSync(blogDir)) {
    spinner.fail(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  const blogContent = fs.readFileSync(
    path.join(blogDir, BLOG_FILE_NAME),
    'utf-8',
  );

  // To analyze text, we need to strip HTML/Markdown for accurate results
  const dom = new JSDOM(blogContent);
  const plainText = dom.window.document.body.textContent || '';

  // --- Perform Analysis ---
  const readability = getReadabilityScores(plainText);
  const keywords = extractKeywords(plainText);
  const density = analyzeKeywordDensity(plainText, keywords);

  spinner.succeed('Analysis complete!');

  // --- Display Results ---
  console.log(chalk.cyan.bold('\n📝 Content Analysis Report'));
  console.log(chalk.gray('------------------------'));

  // Readability Table
  console.log(chalk.white.bold('\n📊 Readability Scores'));
  const readabilityTable = new Table();
  readabilityTable.push(
    { 'Flesch Reading Ease': readability.fleschReadingEase.toFixed(2) },
    { 'Grade Level': readability.fleschKincaidGrade.toFixed(2) },
    { 'Recommended Grade': readability.textStandard },
  );
  console.log(readabilityTable.toString());

  // SEO Table
  console.log(chalk.white.bold('\n🔍 SEO Analysis (Top Keywords)'));
  const seoTable = new Table({
    head: [
      chalk.cyan('Keyword'),
      chalk.cyan('Frequency'),
      chalk.cyan('Density'),
    ],
  });
  density.forEach((item) => {
    seoTable.push([item.keyword, item.frequency, item.density]);
  });
  console.log(seoTable.toString());
}
