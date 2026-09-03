# Deployment Guide

This guide covers everything needed to deploy the modern monorepo blog.

The architecture consists of:
1. **Frontend (`blog-frontend`)**: A Next.js (App Router) application.
2. **Backend (`blog-backend`)**: A Hono microservice running on Edge (Cloudflare Workers).
3. **Database**: A serverless PostgreSQL database (Neon).

---

## What is Needed?
To successfully deploy this blog, you will need free accounts on the following platforms:
1. **Neon** (Database) - https://neon.tech
2. **Cloudflare** (Backend Edge Network) - https://dash.cloudflare.com
3. **Vercel** (Frontend Hosting) - https://vercel.com
4. **Resend** (Optional: For Newsletter Emails) - https://resend.com

---

## 1. Setup the Production Database (Neon)
1. Go to Neon.tech and create a new project.
2. Copy the **Connection String** provided on your dashboard. It looks like:
   `postgres://username:password@ep-cool-snowflake-1234.us-east-2.aws.neon.tech/dbname?sslmode=require`

---

## 2. Deploy the Backend (Cloudflare Workers)
The backend is deployed via GitHub Actions automatically when you push to the `main` branch.

### Configure GitHub Secrets for the Backend:
In your GitHub Repository, go to **Settings > Secrets and variables > Actions** and add the following:

1. `CLOUDFLARE_API_TOKEN`: Create this token in your Cloudflare Profile Settings -> API Tokens -> Create Token (Use the "Edit Cloudflare Workers" template).
2. `CLOUDFLARE_ACCOUNT_ID`: Found on the right sidebar of your Cloudflare Dashboard under "Workers & Pages".
3. `DATABASE_URL`: The Neon connection string you copied in Step 1.
4. `ALLOWED_ORIGIN`: Your frontend URL (e.g., `https://myblog.com`). This is critical for CORS.

*Once these secrets are set, pushing to the `main` branch will automatically trigger the `.github/workflows/deploy-backend.yml` action to deploy your Hono microservice.*

*(To get your deployed backend URL early, you can manually run `npm run deploy` inside the `blog-backend` folder locally using wrangler).*

---

## 3. Deploy the Frontend (Vercel)
Vercel integrates natively with GitHub, meaning you don't need a complex GitHub Action to deploy it. Vercel's dashboard handles everything automatically.

### Steps:
1. Log into Vercel and click **Add New Project**.
2. Import your GitHub repository.
3. **Crucial Settings:**
   - **Root Directory:** Edit this and select `blog-frontend`.
   - **Framework Preset:** Ensure "Next.js" is selected.
4. **Environment Variables:** Add the following environment variables in Vercel:
   - `NEXT_PUBLIC_MICROSERVICE_URL`: The URL of your deployed Cloudflare Worker (e.g., `https://blog-backend.yourname.workers.dev` - No trailing slash!).
   - `RESEND_API_KEY`: (Optional) Your Resend API key if you want newsletter subscriptions to work.
5. Click **Deploy**.

Every time you push changes (or new markdown files in `blog-datastore`) to the `main` branch, Vercel will automatically rebuild and deploy your static frontend!

---

## Conclusion
- Pushing to `main` triggers **Cloudflare Workers** deployment via the built-in GitHub Action (`deploy-backend.yml`).
- Pushing to `main` triggers **Vercel** frontend deployment via Vercel's native GitHub integration.
- The `frontend-ci.yml` Action ensures your Next.js app builds successfully before merging any Pull Requests.
