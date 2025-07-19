import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import logger from './logger.js';
import chalk from 'chalk';

const PATH_TO_BLOGS = process.env.PATH_TO_BLOGS;

// 1. Check if the PATH_TO_BLOGS environment variable is set.
if (!PATH_TO_BLOGS) {
  logger.error(
    chalk.red(
      'FATAL ERROR: The PATH_TO_BLOGS environment variable is not set in your .env file.',
    ),
  );
  logger.error(
    chalk.yellow(
      'Please set it to the full path where you want to store your blog posts.',
    ),
  );
  process.exit(1); // Exit the application with an error code
}

// 2. Check if the directory exists. If not, try to create it.
try {
  if (!fs.existsSync(PATH_TO_BLOGS)) {
    logger.info(
      chalk.blue(
        `The directory ${PATH_TO_BLOGS} does not exist. Creating it...`,
      ),
    );
    fs.mkdirSync(PATH_TO_BLOGS, { recursive: true });
  }
} catch (error) {
  logger.error(
    chalk.red(
      `FATAL ERROR: Could not create the directory at ${PATH_TO_BLOGS}.`,
    ),
  );
  logger.error(
    chalk.yellow(
      'Please check your permissions and the path in your .env file.',
    ),
  );
  logger.error('Error details:', error);
  process.exit(1);
}

export { PATH_TO_BLOGS };
export const METADATA_FILE_NAME = 'metadata.json';
export const BLOG_FILE_NAME = 'blog.md';

export const FIREBASE_AUTH = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
  universe_domain: 'googleapis.com',
};
