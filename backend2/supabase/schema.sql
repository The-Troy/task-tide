-- ============================================================
-- TaskTide — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Enable UUID extension ────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Profiles (extends auth.users) ───────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null,
  role        text not null check (role in ('student', 'class_rep')),
  avatar_url  text,
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);
-- Service role bypasses RLS — used by our API server

-- ─── Course Servers ───────────────────────────────────────
create table if not exists public.course_servers (
  id            bigint generated always as identity primary key,
  name          text not null,
  description   text,
  code          text not null unique,
  is_active     boolean default true,
  class_rep_id  uuid not null references public.profiles(id) on delete cascade,
  created_at    timestamptz default now()
);
alter table public.course_servers enable row level security;
create policy "Enrolled users can view server"
  on public.course_servers for select
  using (
    exists (
      select 1 from public.user_course_servers
      where user_course_servers.course_server_id = course_servers.id
        and user_course_servers.user_id = auth.uid()
    )
    or class_rep_id = auth.uid()
  );
create policy "Class rep can manage own servers"
  on public.course_servers for all
  using (class_rep_id = auth.uid());

-- ─── User ↔ Course Server membership ─────────────────────
create table if not exists public.user_course_servers (
  user_id           uuid references public.profiles(id) on delete cascade,
  course_server_id  bigint references public.course_servers(id) on delete cascade,
  joined_at         timestamptz default now(),
  primary key (user_id, course_server_id)
);
alter table public.user_course_servers enable row level security;
create policy "Users see own memberships"
  on public.user_course_servers for select using (auth.uid() = user_id);

-- ─── Units ────────────────────────────────────────────────
create table if not exists public.units (
  id                bigint generated always as identity primary key,
  course_server_id  bigint not null references public.course_servers(id) on delete cascade,
  name              text not null,
  unit_code         text not null,
  description       text,
  credits           numeric,
  created_at        timestamptz default now()
);
alter table public.units enable row level security;
create policy "Enrolled users can view units"
  on public.units for select
  using (
    exists (
      select 1 from public.user_course_servers ucs
      where ucs.course_server_id = units.course_server_id
        and ucs.user_id = auth.uid()
    )
    or exists (
      select 1 from public.course_servers cs
      where cs.id = units.course_server_id
        and cs.class_rep_id = auth.uid()
    )
  );

-- ─── Documents ────────────────────────────────────────────
create table if not exists public.documents (
  id             bigint generated always as identity primary key,
  unit_id        bigint not null references public.units(id) on delete cascade,
  uploaded_by    uuid not null references public.profiles(id) on delete cascade,
  title          text not null,
  document_type  text not null check (document_type in (
                   'lecture_notes','past_papers','revision_materials',
                   'exam_timetable','lecture_timetable','other')),
  file_path      text not null,  -- path in Supabase Storage bucket
  file_name      text not null,
  file_size      bigint,
  mime_type      text,
  created_at     timestamptz default now()
);
alter table public.documents enable row level security;
create policy "Enrolled users can view documents"
  on public.documents for select
  using (
    exists (
      select 1 from public.units u
      join public.user_course_servers ucs on ucs.course_server_id = u.course_server_id
      where u.id = documents.unit_id and ucs.user_id = auth.uid()
    )
  );

-- ─── Messages ─────────────────────────────────────────────
create table if not exists public.messages (
  id          bigint generated always as identity primary key,
  unit_id     bigint not null references public.units(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  message     text not null,
  is_edited   boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.messages enable row level security;
create policy "Enrolled users can view messages"
  on public.messages for select
  using (
    exists (
      select 1 from public.units u
      join public.user_course_servers ucs on ucs.course_server_id = u.course_server_id
      where u.id = messages.unit_id and ucs.user_id = auth.uid()
    )
  );
create policy "Users can send messages"
  on public.messages for insert
  with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.units u
      join public.user_course_servers ucs on ucs.course_server_id = u.course_server_id
      where u.id = unit_id and ucs.user_id = auth.uid()
    )
  );
create policy "Users can edit own messages"
  on public.messages for update using (auth.uid() = user_id);
create policy "Users can delete own messages"
  on public.messages for delete using (auth.uid() = user_id);

-- ─── Invitations ──────────────────────────────────────────
create table if not exists public.invitations (
  id          bigint generated always as identity primary key,
  unit_id     bigint not null references public.units(id) on delete cascade,
  email       text not null,
  role        text not null default 'student',
  token       text not null unique,
  status      text not null default 'pending' check (status in ('pending','accepted','rejected','expired')),
  invited_by  uuid references public.profiles(id) on delete set null,
  expires_at  timestamptz not null,
  created_at  timestamptz default now()
);
alter table public.invitations enable row level security;
create policy "Invitee can view their invitation by token"
  on public.invitations for select using (true); -- token is secret itself

-- ─── Groups ───────────────────────────────────────────────
create table if not exists public.groups (
  id        bigint generated always as identity primary key,
  unit_id   bigint not null references public.units(id) on delete cascade,
  name      text not null,
  max_size  int not null default 4,
  created_at timestamptz default now()
);
alter table public.groups enable row level security;
create policy "Enrolled users can view groups"
  on public.groups for select
  using (
    exists (
      select 1 from public.units u
      join public.user_course_servers ucs on ucs.course_server_id = u.course_server_id
      where u.id = groups.unit_id and ucs.user_id = auth.uid()
    )
  );

-- ─── Group Members ────────────────────────────────────────
create table if not exists public.group_members (
  group_id   bigint references public.groups(id) on delete cascade,
  user_id    uuid references public.profiles(id) on delete cascade,
  joined_at  timestamptz default now(),
  primary key (group_id, user_id)
);
alter table public.group_members enable row level security;
create policy "Enrolled users can view group members"
  on public.group_members for select using (true);

-- ─── Supabase Storage bucket ──────────────────────────────
-- Create via Dashboard: Storage → New bucket → "documents" → Private
-- Or via SQL (requires storage schema):
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', false)
-- on conflict do nothing;
