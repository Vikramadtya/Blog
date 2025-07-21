import admin from 'firebase-admin';
import Table from 'cli-table3';
import chalk from 'chalk';
import logger from '../logger.js';
import ora from 'ora';
import { db } from '../config.js';

export async function showStats() {
  const spinner = ora('Fetching blog stats from Firestore...').start();
  try {
    const blogsSnapshot = await db.collection('blogs').get();
    const metadataSnapshot = await db.collection('metadata').get();

    const blogTitles = {};
    blogsSnapshot.forEach((doc) => {
      blogTitles[doc.id] = doc.data().title;
    });

    const table = new Table({
      head: [
        chalk.cyan('Blog Title'),
        chalk.cyan('Views'),
        chalk.cyan('Likes'),
      ],
      colWidths: [60, 10, 10],
    });

    metadataSnapshot.forEach((doc) => {
      const data = doc.data();
      const title = blogTitles[data.id] || data.id;
      table.push([title, data.views || 0, data.likes || 0]);
    });

    spinner.succeed('Stats fetched successfully!');
    console.log(table.toString());
  } catch (error) {
    spinner.fail('Failed to fetch stats.');
    logger.error(error);
  }
}
