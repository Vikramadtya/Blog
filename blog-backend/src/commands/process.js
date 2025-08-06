import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import admin from 'firebase-admin';
import ora from 'ora';
import chalk from 'chalk';
import {JSDOM} from 'jsdom';
import {BLOG_FILE_NAME, METADATA_FILE_NAME, PATH_TO_BLOGS,} from '../config.js';
import logger from '../logger.js';
import {
  countWords,
  estimateReadingTime,
  extractCodeInfo,
  extractKeywords,
  extractLinks,
  generateExcerpt,
  generateToc,
} from '../utils/helpers.js';

async function uploadImage(blogId, imagePath) {
  const bucket = admin.storage().bucket();
  const destination = `blogs/${blogId}/${path.basename(imagePath)}`;
  await bucket.upload(imagePath, {
    destination: destination,
    public: true,
  });
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

async function processHtmlContent(html, blogId, options) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const images = document.querySelectorAll('img');
  return images.length ;
}

export async function processBlogs(blogId, options) {
  if (options.all) {
    const blogDirs = fs
      .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    for (const dir of blogDirs) {
      await processSingleBlog(dir, options);
    }
  } else if (blogId) {
    await processSingleBlog(blogId, options);
  } else {
    logger.error(chalk.red('Please provide a blog ID or use the --all flag.'));
  }
}

async function processSingleBlog(blogId, options) {
  const spinner = ora(`Processing blog: ${blogId}`).start();
  const blogDir = path.join(PATH_TO_BLOGS, blogId);
  try {
    const metadataPath = path.join(blogDir, METADATA_FILE_NAME);
    const blogContentPath = path.join(blogDir, BLOG_FILE_NAME);
    if (!fs.existsSync(metadataPath)) {
      spinner.warn(`Skipping ${blogId}: metadata.json not found.`);
      return;
    }
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const blogContent = fs.readFileSync(blogContentPath, 'utf-8');
    const imageCount  = await processHtmlContent(blogContent);

    const blogHash = crypto
      .createHash('sha256')
      .update(blogContent)
      .digest('hex');

    // --- UPDATE ALL METADATA ---
    metadata.toc = generateToc(blogContent);
    metadata.readingTime = estimateReadingTime(blogContent);
    metadata.wordCount = countWords(blogContent);
    metadata.imageCount = imageCount;
    metadata.links = extractLinks(blogContent);
    metadata.code = extractCodeInfo(blogContent);
    metadata.excerpt = generateExcerpt(blogContent);
    metadata.keywords = extractKeywords(blogContent);

    if (!options.forceUpdateMetadata && metadata.hash === blogHash) {
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4));
      spinner.succeed(`No content changes for ${blogId}. Metadata updated.`);
    } else {
      metadata.hash = blogHash;
      metadata.version = (metadata.version || 1) + 1;
      metadata.updatedAt = new Date().toISOString();
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4));
      spinner.succeed(
        chalk.green(`Successfully processed and updated blog ${blogId}.`),
      );
    }
  } catch (error) {
    spinner.fail(`Failed to process blog ${blogId}.`);
    logger.error(error);
  }
}
