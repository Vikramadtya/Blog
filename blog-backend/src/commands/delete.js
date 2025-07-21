import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';

/**
 * Deletes a blog post directory from the local filesystem.
 * This command no longer needs to update a central registry, simplifying its function.
 * @param {string} blogId The ID of the blog post to delete.
 */
export async function deleteBlog(blogId) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  // 1. Verify the blog directory exists.
  if (!fs.existsSync(blogDir)) {
    logger.error(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  // 2. Get user confirmation before performing a destructive action.
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to permanently delete the blog post with ID "${blogId}"?`,
      default: false,
    },
  ]);

  if (confirm) {
    // 3. Delete the entire blog directory.
    fs.rmSync(blogDir, { recursive: true, force: true });
    logger.info(chalk.green(`Deleted blog directory: ${blogDir}`));
    // Note: The central registry.json is no longer used, so there's no file to update here.
    // The next run of `migrate` or `upload` will automatically detect the deletion.
  } else {
    logger.info('Delete operation cancelled.');
  }
}
