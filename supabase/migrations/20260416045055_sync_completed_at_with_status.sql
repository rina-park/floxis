-- completed_at を status_id と同期するための trigger function
create or replace function public.sync_completed_at_with_status()
returns trigger
language plpgsql
as $$
declare
    completed_status_id uuid;
begin
    -- statuses.key = 'completed' の id を取得
    select id
    into completed_status_id
    from public.statuses
    where key = 'completed'
    limit 1;

    -- completed ステータスが未定義ならエラー
    if completed_status_id is null then
        raise exception 'statuses table does not contain key = completed';
    end if;

    -- completed のときだけ completed_at を保持
    if new.status_id = completed_status_id then
        if new.completed_at is null then
            new.completed_at := now();
        end if;
    else
        new.completed_at := null;
    end if;

    return new;
end;
$$;

-- 既存 trigger があれば置き換えられるように drop
drop trigger if exists trg_sync_completed_at_with_status on public.tasks;

-- insert / update 時に completed_at を自動同期
create trigger trg_sync_completed_at_with_status
before insert or update of status_id, completed_at
on public.tasks
for each row
execute function public.sync_completed_at_with_status();