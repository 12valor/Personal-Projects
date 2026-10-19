-- Migration: Add Hardware Projects Case Study fields to projects table
-- Timestamp: 20261020000000

-- 1. Ensure preview_video_url exists
alter table public.projects add column if not exists preview_video_url text;

-- 2. Add slug for human-readable, SEO-friendly case study URLs
alter table public.projects add column if not exists slug text;

-- 3. Add publication status (defaults to true so existing software projects remain public)
alter table public.projects add column if not exists is_published boolean not null default true;

-- 4. Add structured JSONB column for technical case study sections
-- (BOM components, architecture, steps, challenges, testing, captions, SEO)
alter table public.projects add column if not exists case_study jsonb not null default '{}'::jsonb;

-- 5. Create unique index on slug (allowing null for older records without slugs)
create unique index if not exists projects_slug_unique_idx on public.projects (slug) where slug is not null;

-- 6. Create index on publication status and display_index for fast public queries
create index if not exists projects_published_display_idx on public.projects (is_published, display_index);

-- 7. Reload schema cache for PostgREST
notify pgrst, 'reload schema';
