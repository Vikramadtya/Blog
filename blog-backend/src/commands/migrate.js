import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import ora from 'ora';
import chalk from 'chalk';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';

const TAGS_FILE_NAME = 'tags.json';
const AUTHORS_FILE_NAME = 'authors.json';

async function syncAuthors(db, spinner) {
  const authorsFilePath = path.join(PATH_TO_BLOGS, AUTHORS_FILE_NAME);
  if (!fs.existsSync(authorsFilePath)) {
    spinner.warn(chalk.yellow('authors.json not found. Skipping author sync.'));
    return 0;
  }

  const authors = JSON.parse(fs.readFileSync(authorsFilePath, 'utf-8'));
  const batch = db.batch();

  authors.forEach((author) => {
    const authorRef = db.collection('users').doc(author.name);
    batch.set(authorRef, author, { merge: true });
  });

  await batch.commit();
  return authors.length;
}

async function syncTags(db, spinner) {
  const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
  if (!fs.existsSync(tagsFilePath)) {
    spinner.warn(chalk.yellow('tags.json not found. Skipping tag sync.'));
    return 0;
  }

  const tags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
  const batch = db.batch();

  tags.forEach((tag) => {
    const tagRef = db.collection('tags').doc(tag.name);
    batch.set(tagRef, { name: tag.name, color: tag.color }, { merge: true });
  });

  await batch.commit();
  return tags.length;
}

export async function migrate() {
  const spinner = ora('Starting migration to Firestore...').start();
  const db = admin.firestore();

  try {
    spinner.text = 'Syncing authors...';
    const authorCount = await syncAuthors(db, spinner);
    if (authorCount > 0) {
      spinner.succeed(chalk.green(`Synced ${authorCount} authors.`));
    }

    spinner.start('Syncing tags...');
    const tagCount = await syncTags(db, spinner);
    if (tagCount > 0) {
      spinner.succeed(chalk.green(`Synced ${tagCount} tags.`));
    }

    logger.info(
      chalk.cyan(
        '\nMigration complete! Your helper data is now in sync with Firestore.',
      ),
    );
  } catch (error) {
    spinner.fail('Migration failed.');
    logger.error(error);
  }
}
