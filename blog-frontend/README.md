# 🚀 Premium Blog Template

A high-performance, static-first blog template built with Next.js, Tailwind CSS, and Firebase. Designed for maximum maintainability and full configurability.

## ✨ Features

- **Static-First Architecture**: All blog content is pre-rendered at build time for lightning-fast performance.
- **Unified Service Layer**: Clean separation between server-side logic and client-side API interactions.
- **Config-Driven**: Customize everything from navigation to page content via JSON files in the `config/` directory.
- **Local-First Datastore**: Store your blogs and snippets in a local filesystem structure for easy version control and portability.
- **Dynamic Metrics**: Real-time likes and view counts powered by Firebase.
- **Premium Design**: Modern, responsive UI with dark mode support, smooth animations, and a focus on readability.

---

## 🛠️ Configuration

The blog is fully configurable via the `config/` directory. No code changes are required for basic setup.

- **`config/site.json`**: Site-wide metadata, social links, analytics, and comment (Giscus) configuration.
- **`config/nav.json`**: Configure the main navigation and dropdown menus.
- **`config/content.json`**: Customize page titles, descriptions, and labels across the entire site.
- **`config/notes.json`**: Manage your technical notes and book recommendations.

---

## 📝 Content Management

Your content lives in the `blog-datastore/` directory:

- **Blogs**: Add `.md` files to `blog-datastore/blogs/`.
- **Metadata**: Manage blog attributes (tags, dates, categories) in `blog-datastore/blogs/metadata.json`.
- **Tags**: Register and customize tags in `blog-datastore/blogs/tags.json`.

---

## 🚀 Getting Started

1. **Clone the repository.**
2. **Install dependencies**: `npm install`
3. **Configure your site**: Update the files in the `config/` directory.
4. **Set up Firebase**: Add your Firebase configuration to `.env.local`.
5. **Run locally**: `npm run dev`
6. **Build for production**: `npm run build`

---

## 🎨 Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Datastore**: Local Filesystem + [Firebase](https://firebase.google.com/) (Firestore)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Animate.css](https://animate.style/) + Custom Tailwind Animations

---

Built with ❤️ by [Vikramaditya Singh](https://www.vikramaditya-singh.in)
