import { v4 as uuidv4 } from 'uuid';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { db } from '../config.js'; // Import the Firestore instance
import logger from '../logger.js';

export async function addAuthor() {
  logger.info(chalk.blue('Adding a new author directly to Firestore...'));

  try {
    const authorDetails = await inquirer.prompt([
      { type: 'input', name: 'name', message: "Author's Name:" },
      { type: 'input', name: 'email', message: "Author's Email:" },
      { type: 'input', name: 'username', message: "Author's Username:" },
      {
        type: 'input',
        name: 'avatar',
        message: "Author's Avatar URL (optional):",
      },
    ]);

    const newAuthor = {
      id: uuidv4(),
      ...authorDetails,
    };

    const spinner = ora('Saving author to Firestore...').start();
    // Use the author's ID as the document ID for easy lookups
    await db.collection('authors').doc(newAuthor.id).set(newAuthor);
    spinner.succeed();

    logger.info(chalk.green(`\nSuccessfully added author: ${newAuthor.name}`));
    logger.info(chalk.yellow(`Author ID: ${newAuthor.id}`));
  } catch (error) {
    logger.error(chalk.red('Failed to add author.'), error);
  }
}
