import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import {
  PATH_TO_BLOGS,
  METADATA_FILE_NAME,
  BLOG_FILE_NAME,
} from '../config.js';
import logger from '../logger.js';
import chalk from 'chalk';
import { blogSchema } from '../schemas/blog.schema.js';
import {
  estimateReadingTime,
  generateToc,
  getRandomColor,
} from '../utils/helpers.js';

const AUTHORS_FILE_NAME = 'authors.json';
const TAGS_FILE_NAME = 'tags.json';
const NEW_AUTHOR_OPTION = '++ Create New Author ++';

export async function createBlog() {
  logger.info('Creating a new blog post...');

  // --- Load Authors and Tags ---
  const authorsFilePath = path.join(PATH_TO_BLOGS, AUTHORS_FILE_NAME);
  const tagsFilePath = path.join(PATH_TO_BLOGS, TAGS_FILE_NAME);
  let authors = [];
  let tags = [];

  if (fs.existsSync(authorsFilePath)) {
    authors = JSON.parse(fs.readFileSync(authorsFilePath, 'utf-8'));
  }
  if (fs.existsSync(tagsFilePath)) {
    tags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf-8'));
  }

  const authorChoices = [
    ...authors.map((author) => author.name),
    new inquirer.Separator(),
    NEW_AUTHOR_OPTION,
  ];
  const tagChoices = tags.map((tag) => tag.name);
  // --- End Loading ---

  let answers;
  try {
    answers = await inquirer.prompt([
      { type: 'input', name: 'title', message: 'Blog Title:' },
      {
        type: 'list',
        name: 'authorName',
        message: 'Author:',
        choices: authorChoices,
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
  } catch (error) {
    logger.error(chalk.red('Failed to get user input via prompt.'), error);
    return;
  }

  // --- Handle New Author Creation ---
  let selectedAuthor;
  if (answers.authorName === NEW_AUTHOR_OPTION) {
    const newAuthorAnswers = await inquirer.prompt([
      { type: 'input', name: 'name', message: "New Author's Name:" },
      {
        type: 'input',
        name: 'email',
        message: "New Author's Email (optional):",
      },
      {
        type: 'input',
        name: 'avatar',
        message: "New Author's Avatar Path (optional):",
      },
    ]);
    selectedAuthor = newAuthorAnswers;
    authors.push(selectedAuthor);
    fs.writeFileSync(authorsFilePath, JSON.stringify(authors, null, 4));
    logger.info(
      chalk.green(`New author "${selectedAuthor.name}" created and saved.`),
    );
  } else {
    selectedAuthor = authors.find(
      (author) => author.name === answers.authorName,
    );
  }
  // --- End New Author Creation ---

  // --- Handle New Tag Creation ---
  const allTags = [...answers.tags];
  if (answers.newTags) {
    const newTags = answers.newTags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
    let tagsFileWasUpdated = false;
    for (const newTag of newTags) {
      if (!tags.some((t) => t.name === newTag)) {
        tags.push({ name: newTag, color: getRandomColor() });
        allTags.push(newTag);
        tagsFileWasUpdated = true;
      }
    }
    if (tagsFileWasUpdated) {
      fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 4));
      logger.info(chalk.green('New tags have been saved to tags.json.'));
    }
  }
  // --- End New Tag Creation ---

  const blogId = uuidv4();
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  try {
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const blogContent = '# Your Blog Content Here';
    fs.writeFileSync(path.join(blogDir, BLOG_FILE_NAME), blogContent);

    const nextBlogNumber = await getNextBlogNumber(blogId);

    const metadata = {
      id: blogId,
      publish: false,
      blogNumber: nextBlogNumber,
      title: answers.title,
      tags: allTags,
      previewImageSrc: '',
      author: selectedAuthor,
      summary: answers.summary,
      slug: answers.slug,
      type: answers.type,
      demo: {
        live: false,
        preview: null,
        repository: null,
      },
      readingTime: estimateReadingTime(blogContent),
      toc: generateToc(blogContent),
    };

    const { error } = blogSchema.validate(metadata);
    if (error) {
      fs.rmSync(blogDir, { recursive: true, force: true });
      logger.error(chalk.red('Invalid metadata:'), error.details[0].message);
      return;
    }

    const metadataFilePath = path.join(blogDir, METADATA_FILE_NAME);
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 4));

    logger.info(
      chalk.green(`Successfully created blog post with ID: ${blogId}`),
    );
    logger.info(
      chalk.yellow(`Customize your blog post at: ${metadataFilePath}`),
    );
  } catch (error) {
    logger.error(chalk.red('Error creating blog files:'), error);
    if (fs.existsSync(blogDir)) {
      fs.rmSync(blogDir, { recursive: true, force: true });
    }
  }
}

async function getNextBlogNumber(newBlogId) {
  const centralRegistryPath = path.join(PATH_TO_BLOGS, 'registry.json');
  let registryData;

  const defaultRegistry = {
    blogs: {},
    nextBlogNumber: 1,
  };

  try {
    if (fs.existsSync(centralRegistryPath)) {
      const fileContent = fs.readFileSync(centralRegistryPath, 'utf-8');
      registryData = fileContent ? JSON.parse(fileContent) : defaultRegistry;
      if (Array.isArray(registryData.blogs)) {
        registryData.blogs = {};
      }
    } else {
      registryData = defaultRegistry;
    }
  } catch (e) {
    logger.warn(
      chalk.yellow(
        'Could not read or parse registry.json. Creating a new one.',
      ),
    );
    registryData = defaultRegistry;
  }

  const nextNumber = registryData.nextBlogNumber;
  registryData.blogs[newBlogId] = nextNumber;
  registryData.nextBlogNumber += 1;

  fs.writeFileSync(centralRegistryPath, JSON.stringify(registryData, null, 4));
  return nextNumber;
}
