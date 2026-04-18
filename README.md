# Task Manager — Built in Claude Code

A full-stack CRUD application built entirely in Claude Code in 2 hours to demonstrate stack proficiency. Auth, database, row-level security, TypeScript, Tailwind — all generated and debugged through Claude Code sessions.

## Stack

- **Frontend:** Next.js 15.3, React 19, TypeScript, Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL + Auth + Row-Level Security)
- **Deployment:** Vercel-ready

## What This Demonstrates

This POC was built to prove that Claude Code expertise transfers across stacks. The developer's primary stack is Python/Node.js/SQLite on bare metal. This app uses a completely different stack — and was built from scratch in a single Claude Code session.

**Key implementation details:**
- Supabase Auth with email/password (signup + login flows)
- Row-level security policies — users can only read/modify their own tasks
- Full CRUD: create, complete, delete tasks
- Responsive dark mode UI with Tailwind
- TypeScript throughout — no `any` types, proper generic usage
- Zero client-side state management libraries

## Setup

```bash
npm install
```

Create a Supabase project, run `supabase-setup.sql` in the SQL Editor, then copy `.env.local.example` to `.env.local` with your project credentials.

```bash
npm run dev
```

## Build Time

~2 hours from `create-next-app` to working full-stack app with auth + RLS + deployment config.
