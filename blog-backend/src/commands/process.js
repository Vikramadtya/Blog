import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import admin from 'firebase-admin';
import ora from 'ora';
import chalk from 'chalk';
import { JSDOM } from 'jsdom';
import {
  PATH_TO_BLOGS,
  METADATA_FILE_NAME,
  BLOG_FILE_NAME,
} from '../config.js';
import logger from '../logger.js';

async function uploadImage(blogId, imagePath) {
  const bucket = admin.storage().bucket();
  const destination = `blogs/${blogId}/${path.basename(imagePath)}`;

  await bucket.upload(imagePath, {
    destination: destination,
    public: true, // Make the file publicly accessible
  });

  // Return the public URL
  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
}

async function processHtmlContent(html, blogId, options) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const images = document.querySelectorAll('img');
  let imageUploads = [];

  for (const img of images) {
    const src = img.getAttribute('src');
    if (src && src.startsWith('./')) {
      if (options.uploadImages) {
        const imagePath = path.join(PATH_TO_BLOGS, blogId, src);
        if (fs.existsSync(imagePath)) {
          // Collect promises for concurrent uploads
          const uploadPromise = uploadImage(blogId, imagePath).then(
            (publicUrl) => {
              img.setAttribute('src', publicUrl);
            },
          );
          imageUploads.push(uploadPromise);
        }
      } else {
        // The original behavior if not uploading images
        img.setAttribute(
          'src',
          `https://github.com/Vikramadtya/Blog-Datastore/blob/main/blogs/${blogId}/${src.substring(2)}`,
        );
      }
    }
  }

  // Wait for all image uploads to complete
  if (imageUploads.length > 0) {
    await Promise.all(imageUploads);
  }

  return dom.serialize();
}

export async function processBlogs(blogId, options) {
  if (options.all) {
    const blogDirs = fs
      .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    for (const dir of blogDirs) {
      await processSingleBlog(dir, options);
    }
  } else if (blogId) {
    await processSingleBlog(blogId, options);
  } else {
    logger.error(chalk.red('Please provide a blog ID or use the --all flag.'));
  }
}

async function processSingleBlog(blogId, options) {
  const spinner = ora(`Processing blog: ${blogId}`).start();
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  try {
    const metadataPath = path.join(blogDir, METADATA_FILE_NAME);
    const blogContentPath = path.join(blogDir, BLOG_FILE_NAME);

    if (!fs.existsSync(metadataPath)) {
      spinner.warn(`Skipping ${blogId}: metadata.json not found.`);
      return;
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    const blogContent = fs.readFileSync(blogContentPath, 'utf-8');

    // Process HTML, including optional image upload
    const processedContent = await processHtmlContent(
      blogContent,
      blogId,
      options,
    );

    const blogHash = crypto
      .createHash('sha256')
      .update(processedContent)
      .digest('hex');

    if (metadata.hash === blogHash) {
      spinner.succeed(`No changes detected for blog ${blogId}.`);
    } else {
      metadata.hash = blogHash;
      metadata.version = (metadata.version || 1) + 1;
      metadata.updatedAt = new Date().toISOString();

      fs.writeFileSync(blogContentPath, processedContent);
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 4));
      spinner.succeed(
        chalk.green(`Successfully processed and updated blog ${blogId}.`),
      );
    }
  } catch (error) {
    spinner.fail(`Failed to process blog ${blogId}.`);
    logger.error(error);
  }
}
