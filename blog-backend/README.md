# Blog CLI Tool

<div align="center">
  <pre>
   ____  __     __    ___    ____   __      __    ___     ___    ____
  (  _ \(  )   / _\  / __)  (  _ \ /  \    /  \  / __)   / __)  (_  _)
   ) _ < )(__ /    \( (__    )   /(  O )  (  O )( (__   ( (__     )(
  (____/(____)\_/\_/ \___)  (__\_) \__/    \__/  \___)   \___)   (__)
  </pre>
  <p><strong>A powerful, professional-grade CLI to manage your blog posts ✍️</strong></p>
</div>

---

## Table of Contents

- [Philosophy & Design Choices](#philosophy--design-choices)
- [✨ Features](#-features)
- [📂 Project Structure](#-project-structure)
- [🚀 Setup and Installation](#-setup-and-installation)
- [Usage Guide](#usage-guide)
  - [Core Commands](#core-commands)
  - [Deployment & Processing](#deployment--processing)
  - [Utility & Sync Commands](#utility--sync-commands)
- [☁️ Cloud Integration Workflow](#️-cloud-integration-workflow)
- [🧑‍💻 Development Guide](#-development-guide)
- [📝 Schema Reference](#-schema-reference)

---

## Philosophy & Design Choices

This CLI tool was built to bridge the gap between local content creation and a cloud-based backend, providing a robust, repeatable, and scalable workflow for managing a blog. Several key design choices were made to achieve this:

- **Centralized Helper Files**: Instead of relying solely on individual blog metadata, we use central `registry.json`, `authors.json`, and `tags.json` files. This approach:
  - **Ensures Consistency**: Guarantees that author names and tags are consistent across all blog posts.
  - **Simplifies Syncing**: Makes it easy to synchronize this helper data with a cloud database (like Firebase) in a single, efficient operation.
  - **Improves Performance**: Prevents the need to scan every single `metadata.json` file just to get a list of all tags or authors.

- **Two-Way Synchronization**: The `sync` command is designed to be a "source of truth" resolver. It compares the state of your local filesystem with the state of your central JSON files, intelligently adding missing entries and removing stale ones. This makes the CLI resilient to manual changes or accidental deletions.

- **Decoupled Asset Management**: By integrating with Firebase Storage, we decouple the blog's images from the Git repository. This is standard practice for modern web development, as it improves site performance (images are served from a CDN) and keeps the repository lightweight.

- **Extensible Command Structure**: Each piece of functionality is encapsulated in its own file within the `commands` directory. This modular structure makes it straightforward to add new commands or enhance existing ones without affecting other parts of the application.

---

## ✨ Features

- **Interactive Blog Creation**: Quickly scaffold new blog posts with an interactive command-line prompt.
- **Centralized Author & Tag Management**: Store all authors and tags in central JSON files for consistency and easy syncing.
- **Automated Content Generation**: Automatically calculates **reading time** and generates a **Table of Contents**.
- **Robust Schema Validation**: Enforces a consistent metadata structure for all blog posts using **Joi**.
- **Advanced Processing**: Intelligently updates image paths and tracks file changes using SHA-256 hashes.
- **Cloud Image Uploads**: Uploads local images to **Firebase Storage** and automatically replaces paths in your markdown.
- **Live Local Preview**: Preview your markdown files in a browser with a hot-reloading local server.
- **Professional UX**: Includes a stylish banner, spinners for long tasks, and formatted tables for lists.
- **Comprehensive Syncing**: A single `sync` command keeps your local registry and tags perfectly aligned with your filesystem.
- **Full Deployment Workflow**: Dedicated commands to `migrate` helper data and `upload` blog posts to Firebase.
- **Developer Friendly**: Includes support for code linting with **ESLint** and formatting with **Prettier**.
- **CI/CD Ready**: Comes with a GitHub Actions workflow for continuous integration.

---

## 📂 Project Structure

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
│   ├── preview.js
│   ├── process.js
│   ├── publish.js
│   ├── stats.js
│   └── sync.js
├── utils
│   └── helpers.js
├── schemas
│   └── blog.schema.js
```

---

## 🚀 Setup and Installation

### **One-Time Setup**

Before you can run any commands, you need to set up the tool. You only need to do this once.

1.  **Install Node.js**: Make sure you have Node.js (**version 16.x or higher**) installed on your computer.

2.  **Clone the Repository**: Download the project files and navigate into the main folder.

    ```bash
    git clone <your-repo-url>
    cd blog-cli
    ```

3.  **Install Dependencies**: Run this command to download all the necessary libraries the tool depends on.

    ```bash
    npm install
    ```

4.  **Set Up Environment Variables**: Create a file named `.env` in the project's root directory. **This step is critical.** You must provide the full, absolute path to the folder where your blogs will be stored, along with your Firebase credentials.

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

5.  **Make the CLI Globally Executable** (Recommended): This step allows you to run the `blog-cli` command from any folder on your computer.
    ```bash
    npm link
    ```

---

## Usage Guide

Once the setup is complete, you can use the following commands to manage your blog.

### **Core Commands**

- **`blog-cli create`** (alias: `c`)
  Starts an interactive prompt to create a new blog post. It will guide you through setting the title, selecting an author (or creating a new one), choosing tags, and more.

- **`blog-cli list`** (alias: `ls`)
  Displays a formatted table of all your local blog posts, including their title, publish status, last update time, and ID.

- **`blog-cli delete <blog-id>`** (alias: `rm`)
  Safely deletes a blog post. It will ask for confirmation before permanently deleting the blog's directory and removing its entry from `registry.json`.

- **`blog-cli add-asset <blog-id> <path-to-file>`**
  Copies an asset (like an image) from anywhere on your computer into the specified blog's directory and prints the markdown snippet needed to embed it.

### **Deployment & Processing**

- **`blog-cli process [blog-id] [options]`** (alias: `p`)
  The core command for preparing a blog post for publication. It calculates the file hash and, most importantly, handles image paths.
  - `--all`: Process all blog posts instead of just one.
  - `--upload-images`: **(Recommended for production)** Finds local images (`./image.png`), uploads them to Firebase Storage, and replaces the local paths with public cloud URLs.

- **`blog-cli publish <blog-id>`**
  A powerful workflow command that sets `"publish": true` in the blog's metadata and then automatically runs the `process` and `upload` commands for that post.

- **`blog-cli migrate`**
  Syncs your central helper files (`authors.json`, `tags.json`) with your Firestore database. This should be run before uploading blog posts to ensure relationships are correctly established.

- **`blog-cli upload [blog-id] [options]`** (alias: `up`)
  Uploads the final `metadata.json` for one or all blog posts to your Firestore database.
  - `--all`: Upload all blog posts that have changed.
  - `--dry-run`: Shows which posts would be uploaded without making any actual changes to your database.

### **Utility & Sync Commands**

- **`blog-cli sync`**
  A powerful two-way synchronization command. It scans your filesystem and:
  1.  Updates `registry.json` by adding missing blogs and removing deleted ones.
  2.  Updates `tags.json` by adding newly discovered tags from your metadata and removing any tags that are no longer in use.

- **`blog-cli preview <blog-id>`**
  Starts a local, hot-reloading web server so you can preview your `blog.md` file in a browser as you write.

- **`blog-cli stats`**
  Connects to Firestore and displays a table of view and like counts for all your published blog posts.

---

## ☁️ Cloud Integration Workflow

Here is the recommended step-by-step workflow to perform the initial migration of your content and to keep your data in sync going forward.

1.  **Create Local Content**: Use `blog-cli create` to create your blog posts. If you have existing blog folders, this step is complete.

2.  **Sync Local Helper Files**: If you have existing blog posts, run this command to populate your central JSON files based on the metadata in your blogs.

    ```bash
    # Gathers all tags and updates the registry
    blog-cli sync
    ```

3.  **Migrate Helper Data to Firebase**: Push your central author and tag definitions to Firestore. This creates the necessary documents in your `users` and `tags` collections.

    ```bash
    blog-cli migrate
    ```

4.  **Process and Upload All Blog Posts**: Process all your posts, uploading their images to the cloud, and then upload their final metadata to Firestore.

    ```bash
    # Process all posts and upload their images
    blog-cli process --all --upload-images

    # Upload all metadata to Firestore
    blog-cli upload --all
    ```

---

## 🧑‍💻 Development Guide

### **Linting & Formatting**

This project uses ESLint and Prettier to maintain code quality and a consistent style.

```bash
# Run the linter to find issues
npm run lint

# Automatically format all code
npm run format
```
