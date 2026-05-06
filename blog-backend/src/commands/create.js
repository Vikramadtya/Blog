import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import ora from 'ora';
import {
  PATH_TO_BLOGS,
  METADATA_FILE_NAME,
  BLOG_FILE_NAME,
  db, // Import the initialized db instance from the central config
} from '../config.js';
import logger from '../logger.js';
import chalk from 'chalk';
import { blogSchema } from '../schemas/blog.schema.js';
import {
  estimateReadingTime,
  generateToc,
  getRandomColor,
} from '../utils/helpers.js';

const TAGS_FILE_NAME = 'tags.json';

/**
 * Atomically retrieves and increments the blog counter from Firestore.
 * This should only be called AFTER all local data has been validated.
 * @returns {Promise<number>} The next available blog number.
 */
async function getNextBlogNumberFromFirestore() {
  const counterRef = db.collection('counters').doc('blogs');
  try {
    const nextBlogNumber = await db.runTransaction(async (transaction) => {
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists) {
        transaction.set(counterRef, { nextBlogNumber: 2 });
        return 1;
      }
      const newBlogNumber = counterDoc.data().nextBlogNumber;
      transaction.update(counterRef, { nextBlogNumber: newBlogNumber + 1 });
      return newBlogNumber;
    });
    return nextBlogNumber;
  } catch (error) {
    logger.error(
      chalk.red('Error retrieving blog number from Firestore:'),
      error,
    );
    throw new Error('Could not assign a blog number from the server.');
  }
}

export async function createBlog() {
  logger.info('Creating a new blog post...');
  const spinner = ora('Fetching latest authors and tags...').start();
  // Define blogDir in the outer scope to make it accessible in the catch block for cleanup.
  let blogDir;

  try {
    // --- 1. Load All Necessary Local Data ---
    const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
    let authors = [];
    let tags = [];

    // --- 1. Fetch Authors from Firestore ---
    const authorsSnapshot = await db.collection('authors').get();
    authorsSnapshot.forEach((doc) => authors.push(doc.data()));

    if (authors.length === 0) {
      spinner.fail(
        chalk.red(
          `No authors found in Firestore. Please add an author first using 'blog-cli add-author'.`,
        ),
      );
      return;
    }

    if (fs.existsSync(tagsFilePath)) {
      tags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
    }
    spinner.succeed('Latest authors and tags fetched.');

    // --- 2. Gather All User Input ---
    const authorChoices = authors.map((author) => ({
      name: `${author.name} <${author.email}>`,
      value: author.id,
    }));
    const tagChoices = tags.map((tag) => tag.name);
    const answers = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Blog Title:' },
      {
        type: 'list',
        name: 'authorId',
        message: 'Author:',
        choices: authorchoices,
      },
      {
        type: 'checkbox',
        name: 'tags',
        message: 'Select existing tags:',
        choices: tagChoices,
      },
      {
        type: 'input',
        name: 'newTags',
        message: 'Add new tags (comma-separated):',
      },
      { type: 'input', name: 'summary', message: 'Summary:' },
      { type: 'input', name: 'slug', message: 'Slug:' },
      {
        type: 'list',
        name: 'type',
        message: 'Type:',
        choices: ['blog', 'snippet'],
      },
    ]);

    // --- 3. Prepare and Validate a DRAFT Metadata Object ---
    const blogId = uuidv4();
    const now = new Date().toISOString();
    const allTags = [...answers.tags];
    if (answers.newTags) {
      const newTags = answers.newTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      newTags.forEach((t) => allTags.push(t));
    }

    const draftMetadata = {
      id: blogId,
      publish: false,
      blogNumber: 9999, // Use a placeholder for validation before consuming a real number.
      title: answers.title,
      tags: allTags,
      previewImageSrc: '',
      author: answers.authorId,
      summary: answers.summary,
      slug: answers.slug,
      type: answers.type,
      demo: { live: false, preview: null, repository: null },
      readingTime: estimateReadingTime('# Placeholder'),
      toc: generateToc('# Placeholder'),
      createdAt: now,
      updatedAt: now,
    };

    const { error } = blogSchema.validate(draftMetadata);
    if (error) {
      spinner.fail(chalk.red.bold('Metadata validation failed!'));
      logger.error(chalk.red(`  Reason: ${error.details[0].message}`));
      logger.error(chalk.red(`  Field:  ${error.details[0].path.join('.')}`));
      return; // Stop immediately. No cleanup needed as no files were created.
    }

    // --- 4. Validation Passed. Proceed with Irreversible Actions. ---
    spinner.start('Assigning a unique blog number from the server...');
    const nextBlogNumber = await getNextBlogNumberFromFirestore();
    spinner.succeed(`Assigned unique blog number: ${nextBlogNumber}`);

    draftMetadata.blogNumber = nextBlogNumber; // Update metadata with the real number.

    // --- 5. Write to Filesystem ---
    const folderName = answers.slug || blogId;
    blogDir = path.join(PATH_TO_BLOGS, folderName);
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const blogContent = '# Your Blog Content Here';
    fs.writeFileSync(path.join(blogDir, BLOG_FILE_NAME), blogContent);
    fs.writeFileSync(
      path.join(blogDir, METADATA_FILE_NAME),
      JSON.stringify(draftMetadata, null, 4),
    );

    if (answers.newTags) {
      const newTags = answers.newTags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      let tagsFileWasUpdated = false;
      for (const newTag of newTags) {
        if (!tags.some((t) => t.name === newTag)) {
          tags.push({
            id: uuidv4(),
            name: newTag,
            color: getRandomColor(),
            blogs: [blogId],
            count: 1,
          });
          tagsFileWasUpdated = true;
        }
      }
      if (tagsFileWasUpdated) {
        fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 4));
        logger.info(
          chalk.green(
            'New tags saved locally. They will be synced on the next migrate/upload.',
          ),
        );
      }
    }

    logger.info(
      chalk.green(`\n✅ Successfully created blog post with ID: ${blogId}`),
    );
    logger.info(
      chalk.yellow(
        `   Customize your blog post at: ${path.join(blogDir, METADATA_FILE_NAME)}`,
      ),
    );
  } catch (error) {
    spinner.fail('Failed to create blog post.');
    logger.error(
      chalk.red('An unexpected error occurred during blog creation:'),
      error.message,
    );

    // --- CRITICAL CLEANUP STEP ---
    // If the process failed after the blog directory was created, this block will execute.
    if (blogDir && fs.existsSync(blogDir)) {
      fs.rmSync(blogDir, { recursive: true, force: true });
      logger.info(
        chalk.yellow(
          `Cleaned up partially created blog directory to prevent orphaned files.`,
        ),
      );
    }
  }
}
