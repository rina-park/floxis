create table if not exists public.statuses (
    id uuid primary key default gen_random_uuid(),
    key text not null unique,
    name text not null,
    sort_order integer not null,
    created_at timestamptz not null default now()
);

create table if not exists public.categories (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    category_id uuid references public.categories(id) on delete set null,
    sort_order integer not null default 0,
    created_at timestamptz not null default now()
);

create table if not exists public.task_status_logs (
    id uuid primary key default gen_random_uuid(),
    task_id uuid not null references public.tasks(id) on delete cascade,
    from_status_id uuid not null references public.statuses(id),
    to_status_id uuid not null references public.statuses(id),
    changed_at timestamptz not null default now()
);

alter table public.tasks
    add column if not exists description text,
    add column if not exists status_id uuid,
    add column if not exists project_id uuid,
    add column if not exists category_id uuid;

do $$
begin
    if not exists (
        select 1 from pg_constraint where conname = 'tasks_status_id_fkey'
    ) then
        alter table public.tasks
            add constraint tasks_status_id_fkey
            foreign key (status_id)
            references public.statuses(id)
            on delete restrict;
    end if;

    if not exists (
        select 1 from pg_constraint where conname = 'tasks_project_id_fkey'
    ) then
        alter table public.tasks
            add constraint tasks_project_id_fkey
            foreign key (project_id)
            references public.projects(id)
            on delete set null;
    end if;

    if not exists (
        select 1 from pg_constraint where conname = 'tasks_category_id_fkey'
    ) then
        alter table public.tasks
            add constraint tasks_category_id_fkey
            foreign key (category_id)
            references public.categories(id)
            on delete set null;
    end if;
end $$;

insert into public.statuses (key, name, sort_order)
values
    ('pending', 'Pending', 1),
    ('in_progress', 'In Progress', 2),
    ('completed', 'Completed', 3),
    ('on_hold', 'On Hold', 4)
on conflict (key) do nothing;

grant all on table public.statuses to anon;
grant all on table public.statuses to authenticated;
grant all on table public.statuses to service_role;

grant all on table public.categories to anon;
grant all on table public.categories to authenticated;
grant all on table public.categories to service_role;

grant all on table public.projects to anon;
grant all on table public.projects to authenticated;
grant all on table public.projects to service_role;

grant all on table public.task_status_logs to anon;
grant all on table public.task_status_logs to authenticated;
grant all on table public.task_status_logs to service_role;