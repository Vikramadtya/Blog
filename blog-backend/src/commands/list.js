import fs from 'fs';
import path from 'path';
import Table from 'cli-table3';
import chalk from 'chalk';
import { PATH_TO_BLOGS, METADATA_FILE_NAME } from '../config.js';
import { validate as isValidUuid } from 'uuid';

export function listBlogs() {
  const table = new Table({
    head: [
      chalk.cyan('Title'),
      chalk.cyan('Status'),
      chalk.cyan('Last Updated'),
      chalk.cyan('Blog ID'),
    ],
    colWidths: [40, 15, 25, 40],
  });

  const blogDirs = fs
    .readdirSync(PATH_TO_BLOGS, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory() && isValidUuid(dirent.name))
    .map((dirent) => dirent.name);

  for (const blogId of blogDirs) {
    const metadataPath = path.join(PATH_TO_BLOGS, blogId, METADATA_FILE_NAME);
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
      const status = metadata.publish
        ? chalk.green('Published')
        : chalk.yellow('Draft');
      const updatedAt = metadata.updatedAt
        ? new Date(metadata.updatedAt).toLocaleString()
        : 'N/A';
      table.push([metadata.title, status, updatedAt, blogId]);
    }
  }

  console.log(table.toString());
}
