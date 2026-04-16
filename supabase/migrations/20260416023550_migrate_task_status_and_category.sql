insert into public.categories (name, sort_order)
select distinct category, 0
from public.tasks
where category is not null
  and btrim(category) <> ''
on conflict (name) do nothing;

update public.tasks t
set status_id = s.id
from public.statuses s
where t.status_id is null
  and t.status = s.key;

update public.tasks t
set category_id = c.id
from public.categories c
where t.category_id is null
  and t.category = c.name;