# Comprehensive Deployment Guide

This guide provides a detailed, step-by-step walkthrough to deploy the modern monorepo blog.

The architecture consists of:
1. **Database (`Neon`)**: A serverless PostgreSQL database.
2. **Backend (`blog-backend`)**: A Hono microservice running on Edge (Cloudflare Workers).
3. **Frontend (`blog-frontend`)**: A Next.js (App Router) application hosted on Vercel.

---

## Phase 1: Database Setup (Neon)
We use Neon because it supports serverless drivers required by edge networks like Cloudflare.

1. **Create Account:** Go to [Neon.tech](https://neon.tech) and sign up for a free account.
2. **Create Project:** Click **New Project**. Name it `blog-database` (or similar) and select a region close to your users.
3. **Get Connection String:** Once created, you will see a connection string on the dashboard. It looks like this:
   `postgres://username:password@ep-cool-snowflake-1234.us-east-2.aws.neon.tech/dbname?sslmode=require`
4. **Copy this string.** You will need it for the backend.

---

## Phase 2: Backend Setup & Initial Push
Before the Cloudflare Worker can run, we must push our database schema to Neon so the tables exist.

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd blog-backend
   ```
2. Create a local environment file to connect to your Neon database:
   ```bash
   touch .dev.vars
   ```
3. Open `.dev.vars` and paste your Neon connection string:
   ```env
   DATABASE_URL="postgres://username:password@ep-cool-snowflake-1234.us-east-2.aws.neon.tech/dbname?sslmode=require"
   ```
4. Push the schema to the database using Drizzle ORM:
   ```bash
   npm run db:push
   ```
   *You should see a success message indicating the tables were created in Neon.*

---

## Phase 3: GitHub Actions CI/CD Setup (Cloudflare Workers)
We will automate the deployment of the backend so that every push to the `main` branch deploys to Cloudflare.

### 1. Get Cloudflare Credentials
1. Sign up for a free account at [Cloudflare](https://dash.cloudflare.com).
2. Go to **My Profile (top right) -> API Tokens**.
3. Click **Create Token** -> Use the **"Edit Cloudflare Workers"** template.
4. Continue to summary and **Create Token**. Copy this token (it will only be shown once).
5. Go back to the main Cloudflare Dashboard. On the right-hand sidebar under **Workers & Pages**, find your **Account ID** and copy it.

### 2. Add Secrets to GitHub
1. Go to your GitHub repository in the browser.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Click **New repository secret** and add the following four secrets:

   - **Name:** `CLOUDFLARE_API_TOKEN`
     **Value:** (The API token you just created)
   
   - **Name:** `CLOUDFLARE_ACCOUNT_ID`
     **Value:** (Your Cloudflare Account ID)
   
   - **Name:** `DATABASE_URL`
     **Value:** (Your Neon Connection String)
     
   - **Name:** `ALLOWED_ORIGIN`
     **Value:** `https://your-future-blog-url.com` (If you don't know your Vercel URL yet, put `*` for now, but update it later for CORS security).

### 3. Deploy
Now, simply push your code to the `main` branch. 
Go to the **Actions** tab in your GitHub repository, and you will see the `Deploy Backend to Cloudflare Workers` job running. 
Once it finishes, check the logs or your Cloudflare Dashboard to get your backend's deployed URL (e.g., `https://blog-backend.yourusername.workers.dev`).

---

## Phase 4: Frontend Deployment (Vercel)
Vercel integrates natively with GitHub. You do not need GitHub Actions for this; Vercel's dashboard handles everything automatically.

### 1. Link to Vercel
1. Go to [Vercel.com](https://vercel.com) and sign up/log in with GitHub.
2. Click **Add New Project**.
3. Import your blog's GitHub repository.

### 2. Configure the Project
Before clicking deploy, you MUST configure the following settings:

1. **Root Directory:** 
   - Click **Edit** next to Root Directory.
   - Select `blog-frontend`.
2. **Framework Preset:** 
   - Ensure it says **Next.js**.
3. **Environment Variables:** 
   - Expand the Environment Variables section and add:
     - **Name:** `NEXT_PUBLIC_MICROSERVICE_URL`
     - **Value:** `https://blog-backend.yourusername.workers.dev` *(The URL you got from Cloudflare in Phase 3. **Important:** Do NOT include a trailing slash!)*
     - **Name:** `RESEND_API_KEY` *(Optional)*
     - **Value:** `re_123456789...` *(If you want newsletter subscriptions to work, get a free API key from resend.com)*

### 3. Deploy
Click **Deploy**. Vercel will build the Next.js app, read all the markdown files from `blog-datastore`, and generate the static site.

---

## Final Security Check
Once Vercel finishes deploying, you will get your final production URL (e.g., `https://myblog.vercel.app` or a custom domain).

**Important:** If you put `*` for your `ALLOWED_ORIGIN` in GitHub Secrets earlier, you must update it now for security!
1. Go to GitHub **Settings > Secrets and variables > Actions**.
2. Edit `ALLOWED_ORIGIN` and set it to your real Vercel URL (e.g., `https://myblog.vercel.app`). No trailing slash.
3. Trigger a new backend deployment (either by pushing an empty commit or re-running the GitHub Action) so the Worker updates its CORS policy.

Congratulations! Your monorepo blog is now fully deployed and automated.
