import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';

export async function deleteBlog(blogId) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  if (!fs.existsSync(blogDir)) {
    logger.error(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Are you sure you want to permanently delete the blog post with ID "${blogId}"?`,
      default: false,
    },
  ]);

  if (confirm) {
    // Delete the directory
    fs.rmSync(blogDir, { recursive: true, force: true });
    logger.info(chalk.green(`Deleted blog directory: ${blogDir}`));

    // Update the registry
    const centralRegistryPath = path.join(PATH_TO_BLOGS, 'registry.json');
    if (fs.existsSync(centralRegistryPath)) {
      const registry = JSON.parse(
        fs.readFileSync(centralRegistryPath, 'utf-8'),
      );
      if (registry.blogs[blogId]) {
        delete registry.blogs[blogId];
        fs.writeFileSync(
          centralRegistryPath,
          JSON.stringify(registry, null, 4),
        );
        logger.info(chalk.green(`Removed blog "${blogId}" from the registry.`));
      }
    }
  } else {
    logger.info('Delete operation cancelled.');
  }
}
