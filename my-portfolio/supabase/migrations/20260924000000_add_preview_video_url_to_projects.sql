-- Add preview_video_url column to projects table
alter table public.projects add column if not exists preview_video_url text;
