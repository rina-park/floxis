import { createServerClient } from "@/lib/supabase/server";

import type {
  TaskDetail,
  TaskProject,
  TaskStatusOption,
} from "@/types/task";

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export async function getTasks() {
  const supabase = await createServerClient();
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

  if (error || !data) {
    throw new Error(`Failed to fetch tasks: ${error?.message ?? "Unknown error"}`);
  }

  return data.map((task) => {
    const project = pickOne(task.project);

    return {
      id: task.id,
      title: task.title,
      status_id: task.status_id,
      due_date: task.due_date,
      created_at: task.created_at,
      project: project
        ? {
            id: project.id,
            name: project.name,
          }
        : null,
    };
  });
}

export async function getTaskListStatuses() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("statuses")
    .select("id, key, name, sort_order")
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch task list statuses: ${error.message}`);
  }

  return data;
}

export async function getTaskById(taskId: string): Promise<TaskDetail | null> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
        id,
        title,
        title_original,
        description,
        due_date,
        created_at,
        completed_at,
        status:statuses (
          id,
          key,
          name
        ),
        project:projects (
          id,
          name,
          category:categories (
            id,
            name
          )
        ),
        category:categories (
          id,
          name
        )
      `,
    )
    .eq("id", taskId)
    .single();

  if (error || !data) {
    return null;
  }

  const status = pickOne(data.status);
  const category = pickOne(data.category);
  const rawProject = pickOne(data.project);

  if (!status) {
    return null;
  }

  const projectCategory = rawProject
    ? pickOne(rawProject.category)
    : null;

  const project: TaskProject = rawProject
    ? {
        id: rawProject.id,
        name: rawProject.name,
        category: projectCategory
          ? {
              id: projectCategory.id,
              name: projectCategory.name,
            }
          : null,
      }
    : null;

  return {
    id: data.id,
    title: data.title,
    title_original: data.title_original,
    description: data.description,
    due_date: data.due_date,
    created_at: data.created_at,
    completed_at: data.completed_at,
    status: {
      id: status.id,
      key: status.key,
      name: status.name,
    },
    project,
    category: category
      ? {
          id: category.id,
          name: category.name,
        }
      : null,
  };
}

export async function getTaskDetailStatuses(): Promise<TaskStatusOption[]> {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("statuses")
    .select("id, key, name")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}
