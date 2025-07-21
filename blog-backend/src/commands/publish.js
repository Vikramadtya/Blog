import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PATH_TO_BLOGS, METADATA_FILE_NAME } from '../config.js';
import logger from '../logger.js';
import { processBlogs } from './process.js';
import { uploadBlog } from './upload.js';
import { analyseBlog } from './analyse.js';

/**
 * Publishes a blog post.
 * This function is a workflow command that performs three key actions:
 * 1. Sets the `publish` flag to `true` in the local metadata.json file.
 * 2. Processes the blog to update its hash, version, and updatedAt timestamp.
 * 3. Calls the `uploadBlog` command to sync the changes with Firestore.
 * @param {string} blogId The ID of the blog post to publish.
 */
export async function publishBlog(blogId) {
  const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);

  // 1. Verify that the blog exists locally.
  if (!fs.existsSync(metadataPath)) {
    logger.error(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

  // 2. Check if the blog is already published to avoid redundant operations.
  if (metadata.publish) {
    logger.info(chalk.yellow(`Blog "${metadata.title}" is already published.`));
    return;
  }

  // 3. Update the local metadata file.
  // This is the first and most critical step.
  metadata.publish = true;
  metadata.updatedAt = new Date().toISOString(); // Also update the timestamp on publish
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4));
  logger.info(chalk.green(`Set "${metadata.title}" to published locally.`));

  // 4. Process the blog to finalize content, hashes, and versioning.
  // This ensures the uploaded data reflects the final state.
  await processBlogs(blogId, {});

  // 5. Trigger the upload process for this specific blog.
  // The `uploadBlog` command will handle the migration and Firestore update.
  await uploadBlog(blogId, {});

  logger.info(
    chalk.cyan(`\nBlog "${metadata.title}" has been successfully published!`),
  );

  // 6. The analysis of the published blog
  await analyseBlog(blogId, {});
}
