import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';

const AUTHORS_FILE_NAME = 'authors.json';

export async function addAuthor() {
  logger.info(chalk.blue('Adding a new author...'));

  const authorsFilePath = path.join(PATH_TO_BLOGS, AUTHORS_FILE_NAME);
  let authors = [];

  if (fs.existsSync(authorsFilePath)) {
    try {
      authors = JSON.parse(fs.readFileSync(authorsFilePath, 'utf-8'));
    } catch (error) {
      logger.error(
        chalk.red('Error parsing authors.json. Starting with an empty list.'),
        error,
      );
    }
  }

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

    authors.push(newAuthor);

    fs.writeFileSync(authorsFilePath, JSON.stringify(authors, null, 4));

    logger.info(chalk.green(`\nSuccessfully added author: ${newAuthor.name}`));
    logger.info(chalk.yellow(`Author ID: ${newAuthor.id}`));
  } catch (error) {
    logger.error(chalk.red('Failed to add author.'), error);
  }
}
