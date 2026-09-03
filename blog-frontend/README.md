# 🚀 Premium Developer Blog & Notes Platform

A high-performance, statically generated blog and technical notes platform built with Next.js, Tailwind CSS, and a Domain-Driven Design (DDD) architecture. Designed for maximum maintainability, clean separation of concerns, and full configurability.

## ✨ Features

- **Domain-Driven Design (DDD)**: Clean architecture separating Domain Entities, Application Services, and Infrastructure Repositories from the Next.js presentation layer.
- **Static-First Architecture**: All blog and note content is pre-rendered at build time for lightning-fast performance and SEO.
- **Markdown & MDX Native**: Write your content in standard Markdown with Math (KaTeX) and Code highlighting support. Frontmatter acts as your database.
- **Config-Driven**: Customize everything from navigation to page content via JSON files in the `config/` directory.
- **Local-First Datastore**: Store your blogs and hierarchical technical notes directly in a local filesystem structure (`blog-datastore/`).
- **Built-in Admin Editor**: A fully integrated, authenticated markdown editor (`/admin`) for writing, previewing, and managing your posts without leaving the app.
- **Premium Design**: Modern, responsive UI with dark mode support, smooth animations, and a focus on readability.

---

## 🛠️ Architecture

This codebase follows a strict **Domain-Driven Design (DDD)** layered architecture:

- **`src/core/domain/`**: Pure Javascript entities (`Post`, `Note`) enforcing business rules.
- **`src/core/infrastructure/`**: Repositories managing the heavy I/O operations (reading local Markdown files, parsing gray-matter).
- **`src/core/application/`**: Services orchestrating business logic and providing caching layers (`BlogService`, `NoteService`).
- **`src/presentation/`**: React Server/Client Components strictly organized by bounded contexts (`blog`, `note`, `admin`, `ui`, `layout`) instead of arbitrary sizes.

---

## 📝 Content Management

Your content lives in the `blog-datastore/` directory at the root of the project:

- **Blogs**: Add `.md` files to `blog-datastore/blogs/`. Metadata is parsed directly from standard YAML frontmatter.
- **Notes**: Hierarchical trees of markdown files in `blog-datastore/notes/`. Directories automatically become sections.
- **Tags**: Register and customize tag colors in `blog-datastore/blogs/tags.json`.

You can manage this content manually in your IDE, or use the built-in visual editor by navigating to `/admin` when running the app locally.

---

## ⚙️ Configuration

The blog is fully configurable via the `config/` directory and `site.config.mjs`.

- **`site.config.mjs`**: Site-wide metadata, social links, analytics, and comment (Giscus) configuration.
- **`config/nav.json`**: Configure the main navigation and dropdown menus.
- **`config/content.json`**: Customize page titles, descriptions, and labels across the entire site.
- **`config/notes.json`**: Manage your technical notes structure and books.

---

## 🚀 Getting Started

1. **Clone the repository.**
2. **Install dependencies**: `npm install`
3. **Configure your site**: Update `site.config.mjs` and the files in the `config/` directory.
4. **Run locally**: `npm run dev`
5. **Access the Admin Editor**: Go to `http://localhost:3000/admin` to write your first post.
6. **Build for production**: `npm run build`

---

## 🎨 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Architecture**: Domain-Driven Design (DDD)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Content Parsing**: `gray-matter`, `next-mdx-remote`, `rehype-pretty-code`
- **Icons**: [Lucide React](https://lucide.dev/)

---

Built with ❤️ by [Vikramaditya Singh](https://www.vikramaditya-singh.in)
