import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import logger from '../logger.js';
import ora from 'ora';

const ENV_FILE_PATH = path.resolve(process.cwd(), '.env');

// Define all required environment variables and their descriptions
const REQUIRED_VARS = [
  {
    name: 'PATH_TO_BLOGS',
    message: 'Enter the full, absolute path to your blogs directory:',
  },
  { name: 'PROJECT_ID', message: 'Enter your Firebase Project ID:' },
  { name: 'PRIVATE_KEY_ID', message: 'Enter your Firebase Private Key ID:' },
  {
    name: 'PRIVATE_KEY',
    message: 'Enter your Firebase Private Key (will be handled securely):',
  },
  { name: 'CLIENT_EMAIL', message: 'Enter your Firebase Client Email:' },
  { name: 'CLIENT_ID', message: 'Enter your Firebase Client ID:' },
  {
    name: 'CLIENT_X509_CERT_URL',
    message: 'Enter your Firebase Client X509 Cert URL:',
  },
  {
    name: 'STORAGE_BUCKET',
    message: 'Enter your Firebase Storage Bucket name:',
  },
];

function readEnvFile() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    return {};
  }
  const fileContent = fs.readFileSync(ENV_FILE_PATH, 'utf-8');
  const envConfig = {};
  fileContent.split('\n').forEach((line) => {
    if (line.includes('=')) {
      const [key, value] = line.split(/=(.*)/s);
      envConfig[key.trim()] = value.trim();
    }
  });
  return envConfig;
}

export async function configure() {
  const spinner = ora('Checking configuration...').start();
  const currentConfig = readEnvFile();
  const missingVars = REQUIRED_VARS.filter((v) => !currentConfig[v.name]);

  if (missingVars.length === 0) {
    spinner.succeed(
      chalk.green(
        'Your configuration is complete. All required variables are set.',
      ),
    );
    return;
  }

  spinner.stop();
  logger.info(
    chalk.yellow(
      "Some required configuration variables are missing. Let's set them up!",
    ),
  );

  // Create an array of questions for inquirer
  const questions = missingVars.map((v) => ({
    type: v.name === 'PRIVATE_KEY' ? 'password' : 'input', // Use password for private key
    name: v.name,
    message: v.message,
    mask: v.name === 'PRIVATE_KEY' ? '*' : undefined,
    validate: (input) =>
      input.trim() !== '' ? true : 'This field cannot be empty.',
  }));

  const answers = await inquirer.prompt(questions);

  // Append the new variables to the .env file
  let newEnvContent = '';
  for (const [key, value] of Object.entries(answers)) {
    // For the private key, ensure it's properly quoted to handle newlines
    if (key === 'PRIVATE_KEY') {
      newEnvContent += `${key}="${value.replace(/\n/g, '\\n')}"\n`;
    } else {
      newEnvContent += `${key}=${value}\n`;
    }
  }

  fs.appendFileSync(ENV_FILE_PATH, newEnvContent);
  logger.info(
    chalk.green(
      '\nConfiguration successfully updated! Your .env file is now ready.',
    ),
  );
}
