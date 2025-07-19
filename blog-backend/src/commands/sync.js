import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { PATH_TO_BLOGS, METADATA_FILE_NAME } from '../config.js';
import logger from '../logger.js';
import { validate as isValidUuid } from 'uuid';
import { getRandomColor } from '../utils/helpers.js';

const TAGS_FILE_NAME = 'tags.json';
const REGISTRY_FILE_NAME = 'registry.json';

async function syncRegistryWithFilesystem() {
  const spinner = ora('syncing blog registry...').start();
  const centralRegistryPath = path.join(PATH_TO_BLOGS, REGISTRY_FILE_NAME);
  const defaultRegistry = { blogs: {}, nextBlogNumber: 1 };
  let registryData;

  try {
    if (fs.existsSync(centralRegistryPath)) {
      const fileContent = fs.readFileSync(centralRegistryPath, 'utf-8');
      registryData = fileContent ? JSON.parse(fileContent) : defaultRegistry;
    } else {
      registryData = defaultRegistry;
    }

    const blogDirsOnDisk = fs
      .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && isValidUuid(dirent.name))
      .map((dirent) => dirent.name);

    let changesMade = false;

    // Remove stale entries
    for (const blogId in registryData.blogs) {
      if (!blogDirsOnDisk.includes(blogId)) {
        delete registryData.blogs[blogId];
        changesMade = true;
      }
    }

    // Add missing entries
    for (const blogId of blogDirsOnDisk) {
      if (!registryData.blogs[blogId]) {
        const metadataPath = path.join(
          PATH_TO_BLOGS,
          blogId,
          METADATA_FILE_NAME,
        );
        if (fs.existsSync(metadataPath)) {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
          if (metadata.id && metadata.blogNumber) {
            registryData.blogs[metadata.id] = metadata.blogNumber;
            if (metadata.blogNumber >= registryData.nextBlogNumber) {
              registryData.nextBlogNumber = metadata.blogNumber + 1;
            }
            changesMade = true;
          }
        }
      }
    }

    if (changesMade) {
      fs.writeFileSync(
        centralRegistryPath,
        JSON.stringify(registryData, null, 4),
      );
    }
    spinner.succeed('Blog registry is synchronized.');
  } catch (error) {
    spinner.fail('Failed to sync blog registry.');
    logger.error(error);
  }
}

async function syncTagsWithMetadata() {
  const spinner = ora('Syncing tags...').start();
  const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
  let centralTags = fs.existsSync(tagsFilePath)
    ? JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'))
    : [];

  try {
    const blogDirs = fs
      .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && isValidUuid(dirent.name))
      .map((dirent) => dirent.name);

    const tagsInUse = new Set();
    for (const blogId of blogDirs) {
      const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        if (metadata.tags && Array.isArray(metadata.tags)) {
          metadata.tags.forEach((tagName) => tagsInUse.add(tagName));
        }
      }
    }

    let changesMade = false;
    const centralTagNames = new Set(centralTags.map((tag) => tag.name));
    for (const tagName of tagsInUse) {
      if (!centralTagNames.has(tagName)) {
        centralTags.push({ name: tagName, color: getRandomColor() });
        changesMade = true;
      }
    }

    const originalLength = centralTags.length;
    centralTags = centralTags.filter((tag) => tagsInUse.has(tag.name));
    if (centralTags.length !== originalLength) {
      changesMade = true;
    }

    if (changesMade) {
      fs.writeFileSync(tagsFilePath, JSON.stringify(centralTags, null, 4));
    }
    spinner.succeed('Tags are synchronized.');
  } catch (error) {
    spinner.fail('Failed to sync tags.');
    logger.error(error);
  }
}

export async function syncAll() {
  logger.info(chalk.cyan('Starting full synchronization...'));
  await syncRegistryWithFilesystem();
  await syncTagsWithMetadata();
  logger.info(chalk.green('\nSynchronization complete!'));
}
