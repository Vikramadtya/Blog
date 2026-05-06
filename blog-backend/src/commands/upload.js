import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { PATH_TO_BLOGS, METADATA_FILE_NAME, db } from '../config.js';
import logger from '../logger.js';
import chalk from 'chalk';
import ora from 'ora';
import { migrate } from './migrate.js'; // Import the new migrate function

const TAGS_FILE_NAME = 'tags.json';

/**
 * Uploads one or all blog posts to Firestore after ensuring data is migrated.
 * @param {string} blogId - The ID of the blog to upload, or null for all.
 * @param {object} options - Command options from Commander.js.
 */
export async function uploadBlog(blogId, options) {
  const spinner = ora('Preparing to upload...').start();

  // 1. Run migrate first. This is the crucial step for data integrity.
  // It handles its own logging, including for dry runs.
  spinner.text = 'Running migration check...';
  await migrate(options);
  spinner.succeed('Migration check complete.');

  // --- Fetch authors directly from Firestore ---
  const authorsSnapshot = await db.collection('authors').get();

  const authorMap = new Map();
  authorsSnapshot.forEach((doc) => {
    const authorData = doc.data();
    authorMap.set(authorData.id, authorData);
  });
  spinner.succeed('Authors fetched.');

  // Load the now-synced local files into memory for efficient lookups.
  const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
  const tags = fs.existsSync(tagsFilePath)
    ? JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'))
    : [];

  // Create maps for fast O(1) lookups instead of repeated array searches.
  const tagMap = new Map(tags.map((tag) => [tag.name, tag]));

  if (options.dryRun) {
    logger.info(chalk.yellow('\n[DRY RUN] Blog Upload Plan:'));
  }

  // 3. Proceed with the upload logic.
  spinner.start('Processing blog uploads...');
  if (options.all) {
    const blogs = fs.readdirSync(PATH_TO_BLOGS);
    for (const blog of blogs) {
      const blogPath = path.join(PATH_TO_BLOGS, blog);
      if (isDirectory(blogPath) && !blog.startsWith('.')) {
        await uploadSingleBlog(blog, options, authorMap, tagMap);
      }
    }
  } else if (blogId) {
    await uploadSingleBlog(blogId, options, authorMap, tagMap);
  } else {
    logger.error(chalk.red('Please provide a blog ID or use the --all flag.'));
  }
  spinner.stopAndPersist({ text: 'Upload process finished', symbol: '✅' });
}

/**
 * Handles the logic for uploading a single blog post's metadata.
 * @param {string} blogId - The ID of the blog to upload.
 * @param {object} options - Command options.
 * @param {Map} authorMap - In-memory map of authors.
 * @param {Map} tagMap - In-memory map of tags.
 */
async function uploadSingleBlog(blogId, options, authorMap, tagMap) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);
  const metadataPath = path.join(blogDir, METADATA_FILE_NAME);

  if (!fs.existsSync(metadataPath)) return;

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

    // In a live run, check if the blog is already up-to-date.
    if (!options.dryRun) {
      const existingBlog = await db
        .collection('blogs-metadata')
        .doc(blogId)
        .get();
      if (
        !options.forceUpdateMetadata &&
        existingBlog.exists &&
        existingBlog.data().updatedAt === metadata.updatedAt
      ) {
        logger.info(chalk.gray(`Skipping unchanged blog: ${metadata.title}`));
        return;
      }
    }

    // Convert local references (author ID, tag names) to full objects.
    const convertedMetadata = convertMetadata(metadata, authorMap, tagMap);

    if (options.dryRun) {
      logger.info(
        chalk.yellow(`\n[DRY RUN] Would upload blog "${metadata.title}":`),
      );
      console.log(chalk.yellow(JSON.stringify(convertedMetadata, null, 2)));
      return;
    }

    // Live run: write the final metadata to Firestore.
    await db
      .collection('blogs-metadata')
      .doc(blogId)
      .set(convertedMetadata, { merge: true });
    logger.info(chalk.green(`Successfully uploaded blog: ${metadata.title}`));
  } catch (error) {
    logger.error(chalk.red(`Error uploading blog ${blogId}:`), error);
  }
}

/**
 * Converts a blog's metadata by replacing author ID and tag names
 * with their full objects from the in-memory maps.
 * @param {object} metadata - The original metadata from a blog's JSON file.
 * @param {Map} authorMap - Map of all authors.
 * @param {Map} tagMap - Map of all tags.
 * @returns {object} The hydrated metadata object ready for Firestore.
 */
function convertMetadata(metadata, authorMap, tagMap) {
  const resolvedTags = metadata.tags
    .map((tagName) => tagMap.get(tagName))
    .filter(Boolean); // Filter out any tags that might not be in the map

  // Remove the `blogs` array from each tag object before embedding.
  const sanitisedTags = resolvedTags.map((tagInfo) => {
    const { blogs, ...rest } = tagInfo;
    return rest;
  });

  metadata.tags = sanitisedTags;

  // Replace author ID with the full author object.
  if (authorMap.has(metadata.author)) {
    metadata.author = authorMap.get(metadata.author);
  }

  // Set default values for stats if they don't exist.
  if (metadata.views === undefined) metadata.views = 0;
  if (metadata.likes === undefined) metadata.likes = 0;

  return metadata;
}

function isDirectory(path) {
  try {
    return fs.lstatSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

function isUuid(str) {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(str);
}
