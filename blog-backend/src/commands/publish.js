import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PATH_TO_BLOGS, METADATA_FILE_NAME } from '../config.js';
import logger from '../logger.js';
import { processBlogs } from './process.js';
import { uploadBlog } from './upload.js';

export async function publishBlog(blogId) {
  const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);

  if (!fs.existsSync(metadataPath)) {
    logger.error(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

  if (metadata.publish) {
    logger.info(chalk.yellow(`Blog "${metadata.title}" is already published.`));
    return;
  }

  // Set publish to true and save
  metadata.publish = true;
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4));
  logger.info(chalk.green(`Set "${metadata.title}" to published.`));

  // Process and upload the blog
  await processBlogs(blogId, {});
  await uploadBlog(blogId, {});

  logger.info(
    chalk.cyan(`Blog "${metadata.title}" has been successfully published!`),
  );
}
