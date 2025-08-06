# Blog
Welcome to a powerful, professional-grade CLI to manage your blog posts and a sleek, modern frontend to display them.

---

## Features

- **Interactive Blog Creation**: Quickly scaffold new blog posts with an interactive command-line prompt.
- **Centralized Author & Tag Management**: Store all authors and tags in central JSON files for consistency and easy syncing.
- **Automated Content Generation**: Automatically calculates **reading time** and generates a **Table of Contents**.
- **Robust Schema Validation**: Enforces a consistent metadata structure for all blog posts using **Joi**.
- **Advanced Processing**: Intelligently updates image paths and tracks file changes using SHA-256 hashes.
- **Cloud Image Uploads**: Uploads local images to **Firebase Storage** and automatically replaces paths in your markdown.
- **Professional UX**: Includes a stylish banner, spinners for long tasks, and formatted tables for lists.
- **Comprehensive Syncing**: A single `sync` command keeps your local registry and tags perfectly aligned with your filesystem.
- **Full Deployment Workflow**: Dedicated commands to `migrate` helper data and `upload` blog posts to Firebase.
- **Developer Friendly**: Includes support for code linting with **ESLint** and formatting with **Prettier**.

---

## Project Structure

```
.
├── .env
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── README.md
├── package.json
├── logger.js
├── config.js
├── index.js
├── commands
│   ├── add-asset.js
│   ├── create.js
│   ├── delete.js
│   ├── list.js
│   ├── migrate.js
│   ├── process.js
│   ├── publish.js
│   ├── stats.js
│   └── sync.js
├── utils
│   └── helpers.js
└── schemas
└── blog.schema.js
```

---

## Setup and Installation

### One-Time Setup

1.  **Install Node.js**: Make sure you have Node.js (**version 16.x or higher**) installed.
2.  **Clone the Repository**:
    ```bash
    git clone <your-repo-url>
    cd blog-cli
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Set Up Environment Variables**: Create a `.env` file in the project's root directory. You must provide the full, absolute path to the folder where your blogs will be stored, along with your Firebase credentials.

    ```env
    # Path to your local blog files (MUST be a valid, full path)
    PATH_TO_BLOGS="/Users/your_username/Documents/MyBlogs"

    # Firebase Service Account Credentials
    PROJECT_ID="your-firebase-project-id"
    PRIVATE_KEY_ID="your-firebase-private-key-id"
    PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    CLIENT_EMAIL="firebase-adminsdk-....@your-project-id.iam.gserviceaccount.com"
    CLIENT_ID="your-client-id"
    CLIENT_X509_CERT_URL="your-cert-url"

    # Firebase Storage Bucket Name
    STORAGE_BUCKET="your-project-id.appspot.com"
    ```
5.  **Make the CLI Globally Executable** (Recommended):
    ```bash
    npm link
    ```

---

## Usage Guide

### Core Commands

* **`blog-cli create`** (alias: `c`): Starts an interactive prompt to create a new blog post.
* **`blog-cli list`** (alias: `ls`): Displays a formatted table of all your local blog posts.
* **`blog-cli delete <blog-id>`** (alias: `rm`): Safely deletes a blog post.
* **`blog-cli add-asset <blog-id> <path-to-file>`**: Copies an asset into the specified blog's directory and prints the markdown snippet.

### Deployment & Processing

* **`blog-cli process [blog-id] [options]`** (alias: `p`): Prepares a blog post for publication.
    * `--all`: Process all blog posts.
    * `--upload-images`: Uploads local images to Firebase Storage.
* **`blog-cli publish <blog-id>`**: Sets `"publish": true` and runs `process` and `upload`.
* **`blog-cli migrate`**: Syncs your central helper files with Firestore.
* **`blog-cli upload [blog-id] [options]`** (alias: `up`): Uploads metadata to Firestore.
    * `--all`: Upload all changed blog posts.
    * `--dry-run`: Shows which posts would be uploaded without making changes.

### Utility & Sync Commands

* **`blog-cli sync`**: A two-way synchronization command for your local files and central JSON files.
* **`blog-cli preview <blog-id>`**: Starts a local, hot-reloading web server for previewing your `blog.md`.
* **`blog-cli stats`**: Displays view and like counts from Firestore.