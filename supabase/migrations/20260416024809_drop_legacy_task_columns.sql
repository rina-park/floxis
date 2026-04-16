alter table public.tasks
    alter column status_id set not null;

alter table public.tasks
    drop constraint if exists status_check;

alter table public.tasks
    drop column if exists status,
    drop column if exists category;