import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { PATH_TO_BLOGS, METADATA_FILE_NAME } from '../config.js';
import logger from '../logger.js';
import { validate as isValidUuid } from 'uuid';
import { getRandomColor } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';

const TAGS_FILE_NAME = 'tags.json';

/**
 * Scans all local blog metadata files and updates the central `tags.json` file.
 * This ensures that new tags are added and existing tags have correct blog associations.
 */
function syncTagsWithFilesystem() {
  const spinner = ora('Syncing local tags.json from filesystem...').start();
  const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);

  let centralTags = [];
  if (fs.existsSync(tagsFilePath)) {
    try {
      centralTags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
    } catch {
      spinner.warn(
        chalk.yellow('Could not parse tags.json. Rebuilding from scratch.'),
      );
    }
  }

  const tagMap = new Map(centralTags.map((tag) => [tag.name, tag]));

  const blogDirs = fs
    .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .map((dirent) => dirent.name);

  const tagsInUse = new Map();
  for (const blogId of blogDirs) {
    const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      if (metadata.tags && Array.isArray(metadata.tags)) {
        metadata.tags.forEach((tagName) => {
          if (!tagsInUse.has(tagName)) {
            tagsInUse.set(tagName, []);
          }
          tagsInUse.get(tagName).push(blogId);
        });
      }
    }
  }

  // Add any new tags discovered in the metadata files.
  for (const [tagName, blogs] of tagsInUse.entries()) {
    if (!tagMap.has(tagName)) {
      tagMap.set(tagName, {
        id: uuidv4(),
        name: tagName,
        color: getRandomColor(),
        blogs: [],
        count: 0,
      });
    }
    // Always update the blog list and count to reflect the current state.
    const tag = tagMap.get(tagName);
    tag.blogs = blogs;
    tag.count = blogs.length;
  }

  // Filter out any tags that are no longer used in any blog post.
  const finalTags = Array.from(tagMap.values()).filter((tag) =>
    tagsInUse.has(tag.name),
  );

  fs.writeFileSync(tagsFilePath, JSON.stringify(finalTags, null, 4));
  spinner.succeed(
    'Local tags.json has been synchronized with your blog files.',
  );
}

/**
 * The main local sync command.
 * This is a lightweight operation that only affects local helper files.
 */
export function syncAll() {
  logger.info(chalk.cyan('Starting local filesystem synchronization...'));
  // Note: The registry sync has been removed as this is now handled by Firestore.
  syncTagsWithFilesystem();
  logger.info(chalk.green('\nLocal synchronization complete!'));
}
