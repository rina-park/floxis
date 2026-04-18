import { createClient } from "@/lib/supabase/server";

export async function getTasks() {
  const supabase = await createClient();

  // Task List 画面では、現在状態と一覧表示に必要な関連情報のみを取得する
  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
        id,
        title,
        status_id,
        due_date,
        created_at,
        project:projects (
          id,
          name
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }

  return data;
}

export async function getTaskListStatuses() {
  const supabase = await createClient();

  // Task List 画面の status 選択肢は statuses マスタの表示順をそのまま使用する
  const { data, error } = await supabase
    .from("statuses")
    .select("id, key, name, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch task list statuses: ${error.message}`);
  }

  return data;
}