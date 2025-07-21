import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import {
  PATH_TO_BLOGS,
  BLOG_FILE_NAME,
  METADATA_FILE_NAME,
} from '../config.js';
import logger from '../logger.js';
import ora from 'ora';

export async function cleanupAssets(blogId) {
  const spinner = ora(`Scanning assets for blog: ${blogId}`).start();
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  if (!fs.existsSync(blogDir)) {
    spinner.fail(chalk.red(`Error: Blog with ID "${blogId}" not found.`));
    return;
  }

  const blogContent = fs.readFileSync(
    path.join(blogDir, BLOG_FILE_NAME),
    'utf-8',
  );
  const allFiles = fs.readdirSync(blogDir);
  const referencedAssets = new Set();

  const markdownLinks = [...blogContent.matchAll(/!\[.*\]\((.*)\)/g)];
  markdownLinks.forEach((match) => {
    referencedAssets.add(path.basename(match[1]));
  });

  const unusedAssets = allFiles.filter((file) => {
    if (file === BLOG_FILE_NAME || file === METADATA_FILE_NAME) {
      return false;
    }
    return !referencedAssets.has(file);
  });

  if (unusedAssets.length === 0) {
    spinner.succeed('No unused assets found. Your blog directory is clean!');
    return;
  }

  spinner.stop();
  logger.info(chalk.yellow(`Found ${unusedAssets.length} unused assets:`));
  unusedAssets.forEach((asset) => console.log(chalk.cyan(`  - ${asset}`)));

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Do you want to permanently delete these files?',
      default: false,
    },
  ]);

  if (confirm) {
    unusedAssets.forEach((asset) => {
      fs.unlinkSync(path.join(blogDir, asset));
    });
    logger.info(chalk.green('Successfully deleted unused assets.'));
  } else {
    logger.info('Cleanup operation cancelled.');
  }
}
