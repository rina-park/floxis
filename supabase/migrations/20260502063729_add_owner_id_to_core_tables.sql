alter table public.tasks
add column owner_id uuid not null references auth.users(id);

alter table public.statuses
add column owner_id uuid not null references auth.users(id);

alter table public.categories
add column owner_id uuid not null references auth.users(id);

alter table public.projects
add column owner_id uuid not null references auth.users(id);

alter table public.task_status_logs
add column owner_id uuid not null references auth.users(id);

alter table public.statuses
drop constraint if exists statuses_key_key;

alter table public.statuses
add constraint statuses_owner_id_key_unique unique (owner_id, key);
