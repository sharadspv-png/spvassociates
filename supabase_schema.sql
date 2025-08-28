-- Run this SQL in your Supabase project's SQL editor

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  board text not null, -- e.g., 'incometax', 'gst', 'corporate'
  author text,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  author text,
  content text not null,
  created_at timestamptz not null default now()
);

-- Helpful index
create index if not exists questions_board_created_idx on questions(board, created_at desc);
create index if not exists answers_qid_created_idx on answers(question_id, created_at asc);

-- (Optional) Enable Row Level Security and policies for public read/write
alter table questions enable row level security;
alter table answers enable row level security;

-- Allow anonymous (anon key) to read/write (you can tighten later)
create policy "anon read questions" on questions for select using (true);
create policy "anon insert questions" on questions for insert with check (true);
create policy "anon read answers" on answers for select using (true);
create policy "anon insert answers" on answers for insert with check (true);


-- Moderation: flags & soft-hide
alter table questions add column if not exists is_hidden boolean not null default false;
alter table answers add column if not exists is_hidden boolean not null default false;

create table if not exists flags (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('question','answer')),
  target_id uuid not null,
  reason text,
  created_at timestamptz not null default now()
);

create index if not exists flags_target_idx on flags(kind, target_id);

-- Allow public to insert flags, read flags count
alter table flags enable row level security;
create policy "anon read flags" on flags for select using (true);
create policy "anon insert flags" on flags for insert with check (true);

-- Allow updates to hide/unhide (temporarily open; tighten later)
create policy "anon update hide question" on questions for update using (true) with check (true);
create policy "anon update hide answer" on answers for update using (true) with check (true);
