#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import { createBlog } from './commands/create.js';
import { processBlogs } from './commands/process.js';
import { uploadBlog } from './commands/upload.js';
import { previewBlog } from './commands/preview.js';
import { syncAll } from './commands/sync.js';
import { listBlogs } from './commands/list.js';
import { deleteBlog } from './commands/delete.js';
import { publishBlog } from './commands/publish.js';
import { showStats } from './commands/stats.js';
import { migrate } from './commands/migrate.js';
import { configure } from 'winston';

// --- Display Banner ---
console.log(
  chalk.cyan(
    figlet.textSync('Blog CLI', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    }),
  ),
);
console.log(chalk.blueBright('A powerful CLI to manage your blog posts ✍️'));
console.log('\n');
// --- End Banner ---

const program = new Command();

program
  .name('blog-cli')
  .description('A CLI tool to manage your blog posts')
  .version('2.0.0');

// --- Setup ---
program
  .command('config')
  .description(
    'checks and interactively sets up the required .env configuration',
  )
  .action(configure);

// --- Core Commands ---
program
  .command('create')
  .alias('c')
  .description('create a new blog post')
  .action(createBlog);

program
  .command('list')
  .alias('ls')
  .description('list all local blog posts')
  .action(listBlogs);

program
  .command('delete')
  .alias('rm')
  .description('delete a blog post')
  .argument('<string>', 'The ID of the blog post to delete')
  .action(deleteBlog);

program
  .command('publish')
  .description(
    'publish a blog post (sets publish:true, processes, and uploads)',
  )
  .argument('<string>', 'The ID of the blog post to publish')
  .action(publishBlog);

// --- Processing and Deployment ---
program
  .command('process')
  .alias('p')
  .description('process blog posts (updates image paths and hashes)')
  .option('--all', 'process all blog posts')
  .option('--upload-images', 'upload local images to firebase storage') // New option
  .argument('[string]', 'The ID of the blog post to process')
  .action((blogId, options) => processBlogs(blogId, options));

program
  .command('upload')
  .alias('up')
  .description('upload blog posts to Firestore')
  .option('--all', 'Upload all blog posts')
  .option('--dry-run', 'Simulate the upload without making changes')
  .argument('[string]', 'The ID of the blog post to upload')
  .action((blogId, options) => uploadBlog(blogId, options));

// --- Utility Commands ---
program
  .command('preview')
  .description('preview a blog post in the browser')
  .argument('<string>', 'The ID of the blog post to preview')
  .action(previewBlog);

program
  .command('stats')
  .description('show view and like counts from Firestore')
  .action(showStats);

program
  .command('sync')
  .description(
    'scans all blogs and updates the central tags.json & sync the registry.json file with the filesystem',
  )
  .action(syncAll);

program
  .command('migrate')
  .description('syncs local authors.json and tags.json files to Firestore')
  .action(migrate);

program.parse(process.argv);
