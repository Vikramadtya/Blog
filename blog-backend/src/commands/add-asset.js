import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';

export function addAsset(blogId, filePath) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);
  if (!fs.existsSync(blogDir)) {
    logger.error(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  if (!fs.existsSync(filePath)) {
    logger.error(
      chalk.red(`Error: The asset file at "${filePath}" was not found.`),
    );
    return;
  }

  const fileName = path.basename(filePath);
  const destinationPath = path.join(blogDir, fileName);

  try {
    fs.copyFileSync(filePath, destinationPath);
    logger.info(
      chalk.green(
        `Asset "${fileName}" successfully copied to blog "${blogId}".`,
      ),
    );
    logger.info(
      chalk.yellow(
        `\nTo use this asset, paste the following into your markdown file:`,
      ),
    );
    // Provide a clean, copy-pasteable markdown snippet
    console.log(chalk.cyan(`\n![alt text](./${fileName})\n`));
  } catch (error) {
    logger.error(chalk.red('Failed to copy the asset.'), error);
  }
}
