import liveServer from 'live-server';
import path from 'path';
import { PATH_TO_BLOGS } from '../config.js';
import logger from '../logger.js';
import chalk from 'chalk';

export function previewBlog(blogId) {
  const blogDir = path.join(PATH_TO_BLOGS, blogId);

  const params = {
    port: 8181,
    host: '0.0.0.0',
    root: blogDir,
    open: true,
    file: 'blog.md',
    wait: 1000,
    logLevel: 2,
  };

  logger.info(chalk.blue(`Starting preview server for blog: ${blogId}`));
  liveServer.start(params);
}
