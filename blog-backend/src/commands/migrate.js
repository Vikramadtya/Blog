import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import {
  PATH_TO_BLOGS,
  METADATA_FILE_NAME,
  FIREBASE_AUTH,
  db,
} from '../config.js';
import logger from '../logger.js';
import { v4 as uuidv4 } from 'uuid';
import { getRandomColor } from '../utils/helpers.js';
import { validate as isValidUuid } from 'uuid';

const TAGS_FILE_NAME = 'tags.json';

/**
 * Performs a two-way sync for tags. It fetches from Firestore, scans local blogs for usage,
 * creates new tags, and updates counts and associations for existing ones.
 * @param {object} options - Command options, including `dryRun`.
 */
async function migrateTags(options = {}) {
  const spinner = ora('Syncing tags with Firestore...').start();
  try {
    // 1. Fetch remote tags.
    const tagsSnapshot = await db.collection('tagsInfo').get();
    const remoteTags = new Map();
    tagsSnapshot.forEach((doc) => {
      const tagData = doc.data();
      remoteTags.set(tagData.name, tagData);
    });

    // 2. Scan local metadata to find all tags currently in use.
    const blogDirs = fs
      .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && isValidUuid(dirent.name))
      .map((dirent) => dirent.name);

    const localTagUsage = new Map();
    for (const blogId of blogDirs) {
      const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);
      if (fs.existsSync(metadataPath)) {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
        if (Array.isArray(metadata.tags)) {
          metadata.tags.forEach((tagName) => {
            if (!localTagUsage.has(tagName)) {
              localTagUsage.set(tagName, []);
            }
            localTagUsage.get(tagName).push(blogId);
          });
        }
      }
    }

    // 3. Merge local usage with remote data.
    const finalTags = new Map(remoteTags);
    const tagsToCreate = [];
    const tagsToUpdate = [];

    for (const [tagName, blogs] of localTagUsage.entries()) {
      if (finalTags.has(tagName)) {
        const tag = finalTags.get(tagName);
        tag.blogs = blogs;
        tag.count = blogs.length;
        tagsToUpdate.push(tagName);
      } else {
        const newTag = {
          id: uuidv4(),
          name: tagName,
          color: getRandomColor(),
          blogs,
          count: blogs.length,
        };
        finalTags.set(tagName, newTag);
        tagsToCreate.push(tagName);
      }
    }

    // --- Dry Run Logic ---
    if (options.dryRun) {
      spinner.stop();
      logger.info(chalk.yellow('\n[DRY RUN] Tag Synchronization Plan:'));
      if (tagsToCreate.length > 0) {
        logger.info(chalk.yellow('  The following new tags would be created:'));
        tagsToCreate.forEach((name) =>
          logger.info(chalk.cyan(`    - ${name}`)),
        );
      } else {
        logger.info(chalk.green('  No new tags to create.'));
      }
      if (tagsToUpdate.length > 0) {
        logger.info(
          chalk.yellow('  The following existing tags would be updated:'),
        );
        tagsToUpdate.forEach((name) =>
          logger.info(chalk.cyan(`    - ${name}`)),
        );
      } else {
        logger.info(chalk.green('  No existing tags to update.'));
      }
      logger.info(
        chalk.yellow(
          '  The local `tags.json` file would be overwritten with the full, merged list.',
        ),
      );
      return;
    }

    // --- Live Execution Logic ---
    const batch = db.batch();
    finalTags.forEach((tag) => {
      const tagRef = db.collection('tagsInfo').doc(tag.id);
      batch.set(tagRef, tag, { merge: true });
    });
    await batch.commit();

    const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
    fs.writeFileSync(
      tagsFilePath,
      JSON.stringify(Array.from(finalTags.values()), null, 4),
    );

    spinner.succeed(
      chalk.green(`Tags synced. Local tags.json is now up-to-date.`),
    );
  } catch (error) {
    spinner.fail('Failed to sync tags.');
    logger.error(error);
  }
}

/**
 * Main function to run the migration process for all helper files.
 * @param {object} options - Command options passed from Commander.js.
 */
export async function migrate(options) {
  logger.info(chalk.cyan('Starting remote-first migration...'));
  if (options.dryRun) {
    logger.info(chalk.yellow.bold('\n--- DRY RUN MODE ---'));
    logger.info(
      chalk.yellow(
        'No changes will be written to local files or the database.',
      ),
    );
  }

  await migrateTags(options);

  if (options.dryRun) {
    logger.info(chalk.yellow.bold('\n--- END DRY RUN ---'));
  } else {
    logger.info(
      chalk.green(
        '\nMigration complete! Your local helper files are synced with Firestore.',
      ),
    );
  }
}
