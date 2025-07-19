import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { PATH_TO_BLOGS, METADATA_FILE_NAME, FIREBASE_AUTH } from '../config.js';
import logger from '../logger.js';
import chalk from 'chalk';
import ora from 'ora';

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_AUTH),
});

const db = admin.firestore();

export async function uploadBlog(blogId, options) {
  const spinner = ora('preparing to upload...').start();
  if (options.all) {
    const blogs = fs.readdirSync(PATH_TO_BLOGS);
    for (const blog of blogs) {
      await uploadSingleBlog(blog, options);
    }
  } else if (blogId) {
    await uploadSingleBlog(blogId, options);
  } else {
    logger.error(chalk.red('Please provide a blog ID or use the --all flag.'));
  }
}

async function uploadSingleBlog(blogId, options) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  if (!fs.existsSync(blogDir)) {
    logger.error(chalk.red(`Blog with ID ${blogId} not found.`));
    return;
  }

  logger.info(chalk.blue(`Uploading blog: ${blogId}`));

  const metadataPath = path.join(blogDir, METADATA_FILE_NAME);

  try {
    const metadata = JSON.parse(fs.readFileSync(metadataPath));

    const existingBlog = await db.collection('blogs').doc(blogId).get();

    if (
      existingBlog.exists &&
      existingBlog.data().updatedAt === metadata.updatedAt
    ) {
      logger.info(chalk.green(`Blog ${blogId} is already up to date.`));
      return;
    }

    const convertedMetadata = await convertMetadata(metadata);

    if (options.dryRun) {
      logger.info(chalk.yellow(`[DRY RUN] Would upload blog ${blogId}.`));
      return;
    }

    if (existingBlog.exists) {
      await db
        .collection('blogs')
        .doc(blogId)
        .set(convertedMetadata, { merge: true });
      logger.info(chalk.green(`Successfully updated blog ${blogId}.`));
    } else {
      await db.collection('blogs').doc(blogId).set(convertedMetadata);
      await db
        .collection('metadata')
        .doc(blogId)
        .set({ id: blogId, likes: 0, views: 0 });
      logger.info(chalk.green(`Successfully created blog ${blogId}.`));
    }
  } catch (error) {
    logger.error(chalk.red(`Error uploading blog ${blogId}:`), error);
  }
}

async function convertMetadata(metadata) {
  const resolvedTags = [];
  for (const tag of metadata.tags) {
    const tagDoc = await db.collection('tags').doc(tag).get();
    if (!tagDoc.exists) {
      await createNewTag(tag);
    }
    resolvedTags.push(await updateExistingTag(tag, metadata.id));
  }
  metadata.tags = resolvedTags;

  // Similarly handle author resolution
  // const authorDoc = await db.collection('users').doc(metadata.author).get();
  // if (authorDoc.exists) {
  //     metadata.author = authorDoc.data();
  // }

  return metadata;
}

async function createNewTag(tag) {
  const data = {
    id: tag,
    name: tag,
    color: getRandomColor(),
    blogs: [],
  };
  await db.collection('tags').doc(tag).set(data);
  logger.info(chalk.cyan(`Created new tag: ${tag}`));
}

async function updateExistingTag(tag, blogId) {
  const tagRef = db.collection('tags').doc(tag);
  await tagRef.update({
    blogs: admin.firestore.FieldValue.arrayUnion(blogId),
  });
  const tagDoc = await tagRef.get();
  return tagDoc.data();
}

function getRandomColor() {
  const colors = ['#27ae60', '#e74c3c', '#3498db'];
  return colors[Math.floor(Math.random() * colors.length)];
}
