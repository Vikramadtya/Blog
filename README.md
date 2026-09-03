# Monorepo Personal Blog & Notes Platform

Welcome to the source code for a modern, high-performance personal blog and technical notes platform. This repository is structured as a monorepo, separating the frontend application, the backend microservice, and the markdown datastore.

---

## Architecture Overview

This project is divided into three primary workspaces:

### 1. `blog-frontend` (Next.js - Domain-Driven Design)
A sleek, modern frontend built with **Next.js (App Router)** and **Tailwind CSS**.
- **Architecture:** We employ a strict **Domain-Driven Design (DDD)** layered architecture. Core business logic (Entities, Use Cases, Repositories) lives in `src/core/`, completely decoupled from the Next.js `src/presentation/` layer.
- **Static Generation:** Blog posts and notes are written in Markdown/MDX and generated statically at build time for maximum speed and SEO.
- **Dynamic Metrics:** Views, likes, and newsletter subscriptions are fetched dynamically from the microservice.
- **Design System:** Features a bespoke design with a customized hero section, elegant typography, and a dark/light mode toggle.

### 2. `blog-backend` (Hono Microservice)
An ultra-fast, serverless microservice built with **Hono** and **Cloudflare Workers**.
- **Performance:** Runs natively on the edge with near-zero cold starts.
- **Database:** Connects to a Postgres database (e.g., Neon or Supabase) using **Drizzle ORM**.
- **Responsibilities:** 
  - Atomically tracks page views and likes (`/metrics/:blogId`).
  - Handles newsletter signups securely (`/subscribe`).

### 3. `blog-datastore` (Local Markdown Database)
All technical notes, blog posts, and snippets are stored as local Markdown files.
- **Centralized:** Instead of scattered repositories, all content is unified here.
- **Version Controlled:** Treat your content like code.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A Postgres database connection string (e.g., from Neon.tech)

### 1. Setup the Backend
Navigate to the backend directory and configure your database:
```bash
cd blog-backend
npm install
```
Start a local PostgreSQL database using Docker (from the root of the project):
```bash
cd ..
docker-compose up -d
cd blog-backend
```
Create a `.dev.vars` file in `blog-backend` by copying the example:
```bash
cp .env.example .dev.vars
```
*(The `.env.example` defaults to the local Docker database string!)*

Sync the database schema and start the local development server:
```bash
npm run db:push
npm run dev
# The backend will run on http://localhost:8787
```

### 2. Setup the Frontend
Open a new terminal window and navigate to the frontend directory:
```bash
cd blog-frontend
npm install
```
Create a `.env.local` file in `blog-frontend` and point it to your local microservice:
```env
NEXT_PUBLIC_MICROSERVICE_URL="http://localhost:8787"
```
Start the Next.js development server:
```bash
npm run dev
# The frontend will run on http://localhost:3000
```

---

## Writing Content

To create a new blog post or technical note, we have built a custom frictionless local interface:
1. Ensure the frontend development server is running (`npm run dev` in `blog-frontend`).
2. Navigate to `http://localhost:3000/admin` in your browser.
3. Access the **Blog Editor** or **Note Editor**.
4. You can draft, preview, and save Markdown directly from the browser. The files are securely saved back to the `blog-datastore/` directory locally.

*(Note: This admin interface is strictly locked down to local development for security and will not function in production).*

## Deployment & CI/CD

For full setup instructions, please see the [Deployment Guide](deployment.md).

### Automated Deployments (GitHub Actions)
This monorepo is fully configured for CI/CD via GitHub Actions (`.github/workflows/`):

1. **Backend (Cloudflare Workers)**: Pushes to `main` in the `blog-backend/` directory will automatically deploy to Cloudflare. 
   - *Requirement*: You must add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` to your GitHub Repository Secrets.
2. **Frontend (Vercel)**: Pushes to `main` will automatically trigger a build check in GitHub Actions. 
   - *Requirement*: Production deployments for the frontend are handled natively by linking this GitHub repository directly in your Vercel Dashboard.
