# Task Manager — Next.js + Supabase POC

A full-stack CRUD app built entirely in Claude Code as feasibility evidence for the Claude Code Power User RFP.

## Stack

- **Frontend:** Next.js 15.3, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth + Row-Level Security)
- **Deployment:** Vercel (ready, needs account connection)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Run `supabase-setup.sql` in the SQL Editor (Dashboard > SQL Editor)
3. Copy `.env.local.example` to `.env.local` and fill in your project URL and anon key
4. Disable email confirmation for testing: Dashboard > Authentication > Settings

### 3. Run locally

```bash
npm run dev
```

### 4. Deploy to Vercel

```bash
npx vercel
```

Set environment variables in Vercel dashboard.

## Features

- Email/password authentication (signup + login)
- Create, complete, and delete tasks
- Row-level security (users only see their own tasks)
- Responsive dark mode UI
- Zero client-side state management libraries needed

## Built in Claude Code

Total build time: ~15 minutes. See `../20260417-nextjs-supabase-research.md` for detailed findings.
