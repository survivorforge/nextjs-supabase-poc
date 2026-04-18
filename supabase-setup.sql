-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- 1. Create tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null,
  completed boolean default false,
  created_at timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.tasks enable row level security;

-- 3. RLS policies — users can only access their own tasks
create policy "Users can view their own tasks"
  on public.tasks for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tasks"
  on public.tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on public.tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on public.tasks for delete
  using (auth.uid() = user_id);
