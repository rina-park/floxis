-- Enable RLS
alter table public.tasks enable row level security;
alter table public.statuses enable row level security;
alter table public.categories enable row level security;
alter table public.projects enable row level security;
alter table public.task_status_logs enable row level security;

-- Tasks
create policy "Users can manage own tasks"
on public.tasks
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Statuses
create policy "Users can manage own statuses"
on public.statuses
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Categories
create policy "Users can manage own categories"
on public.categories
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Projects
create policy "Users can manage own projects"
on public.projects
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Task status logs
create policy "Users can manage own task status logs"
on public.task_status_logs
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
