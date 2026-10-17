# 🏡 CommunityCloset — Full-Stack Sustainability Platform

> **"For the people, by the people"** — Katraj's premier hyper-local tool library and material exchange platform. Built with React 19, TypeScript, Tailwind CSS, and Supabase.

---

## 🚀 Full-Stack Features & Data Architecture

- **Supabase**: Supabase Auth handles email/password and Google OAuth. Application collections are persisted in `public.app_records`, with row-level security policies scoped to the signed-in user and transaction participants.
- **Collections**: profiles, listings, requests, messages, notifications, reviews, wishlists, badges, reports, complaints, and categories.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide React
- **Database and authentication**: Supabase (PostgreSQL, Auth, and row-level security)
- **Maps**: Interactive Leaflet maps centered on Katraj, Pune (`18.4575, 73.8508`)
- **Client configuration**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`; never put a service-role key in browser environment variables.
- **AI Abstraction**: Secure server-side routes (`/api/ai/*`) reading `GEMINI_API_KEY` / `OPENAI_API_KEY` from environment variables

---

## 📥 Setup & Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/community-closet.git
cd community-closet
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Initialization
In the Supabase Dashboard, open **SQL Editor**, paste and run [`server/db/schema.sql`](./server/db/schema.sql). It creates the app-records table, row-level security policies, an Auth profile trigger, and the default categories. There is no local PostgreSQL server or `psql` step.

The previous app code did not connect to PostgreSQL; it used localStorage and simulated authentication. This change replaces that runtime with Supabase, but it does not import any existing browser localStorage or external PostgreSQL data. New accounts and records are created in Supabase after the schema is installed.

In **Authentication > URL Configuration**, set the site URL to your app URL and add your local/deployed URLs to the redirect allow-list. To use Google sign-in, enable Google under **Authentication > Providers** and configure its OAuth credentials there.

Admin access is based on the trusted `app_metadata.role` claim. Grant that claim to an account using a trusted Supabase Admin API/server-side process; never set it from client-side user metadata. Do not expose a service-role key in `VITE_*` variables.

### 4. Run Development Server
```bash
npm run dev -- --host 127.0.0.1
```
Open [http://127.0.0.1:5173/](http://127.0.0.1:5173/) in your browser.

---

## 🌐 Deployment Guide

### Deploying to Vercel / Netlify / Render
1. Push your repository to GitHub.
2. Import the project into **Vercel** or **Render**.
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the deployment environment. Configure AI keys separately on a trusted server, never as `VITE_*` variables.
4. Build Command: `npm run build`
5. Output Directory: `dist`
