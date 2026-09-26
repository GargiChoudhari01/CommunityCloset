# 🏡 CommunityCloset — Full-Stack Sustainability Platform

> **"For the people, by the people"** — Katraj's premier hyper-local tool library and material exchange platform. Built with React 19, TypeScript, Tailwind CSS, Node.js, and PostgreSQL.

---

## 🚀 Full-Stack Features & Data Architecture

- **10 Relational Data Schemas / Collections**:
  - `users` — Auth accounts, ratings, badges, items shared/borrowed stats
  - `listings` — Tools and materials (`borrow`, `giveaway`, `exchange`, `donate`)
  - `requests` — Borrow/claim transactions with dates and status lifecycle
  - `messages` — Real-time request-linked chat threads
  - `notifications` — Event alerts for requests, approvals, reviews, and badges
  - `reviews` — 1 to 5 star ratings and reviews written after completed borrows
  - `wishlist` — User-saved listings
  - `badges` — Automated achievements (`first_share`, `reuse_hero`, `community_helper`, `resource_champion`)
  - `reports` — User-flagged item reports for admin moderation
  - `impact_stats` — Platform-wide sustainability aggregation (kg CO₂ diverted, ₹ saved)

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4 + Lucide React
- **Backend API**: Node.js + Express REST API (`server/`)
- **Database**: PostgreSQL schema (`server/db/schema.sql`) + Database client (`server/db/index.ts`) + Automated seeder (`server/db/seed.ts`)
- **Authentication**: JWT token handling + bcrypt password hashing + Google OAuth endpoint
- **Maps**: Interactive Leaflet maps centered on Katraj, Pune (`18.4575, 73.8508`)
- **Storage**: Object Storage / Supabase Storage adapter (`server/services/storageService.ts`)
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

### 3. Database Initialization & Seeding
Initialize the database tables and populate sample Katraj data:
```bash
# Apply SQL Schema
psql $DATABASE_URL -f server/db/schema.sql
```

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
3. Set Environment Variables (`VITE_API_URL`, `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`).
4. Build Command: `npm run build`
5. Output Directory: `dist`
