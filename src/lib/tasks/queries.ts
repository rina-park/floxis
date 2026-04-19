import { createServerClient } from "@/lib/supabase/server";

import type {
  TaskCategory,
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

function throwFetchError(
  error: { message?: string } | null,
  data: unknown,
  context: string,
): asserts data {
  if (error || !data) {
    throw new Error(
      `Failed to fetch ${context}: ${error?.message ?? "Unknown error"}`,
    );
  }
}

async function fetchTaskStatuses(): Promise<TaskStatusOption[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("statuses")
    .select("id, key, name")
    .order("sort_order", { ascending: true });

  throwFetchError(error, data, "task statuses");

  return data.map((status) => ({
    id: status.id,
    key: status.key,
    name: status.name,
  }));
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

  throwFetchError(error, data, "tasks");

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

export async function getTaskListStatuses(): Promise<TaskStatusOption[]> {
  return fetchTaskStatuses();
}

export async function getTaskCreateStatuses(): Promise<TaskStatusOption[]> {
  return fetchTaskStatuses();
}

export async function getTaskCreateProjects(): Promise<TaskProject[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        name,
        category:categories (
          id,
          name
        )
      `,
    )
    .order("sort_order", { ascending: true });

  throwFetchError(error, data, "task create projects");

  return data.map((project) => {
    const category = pickOne(project.category);

    return {
      id: project.id,
      name: project.name,
      category: category
        ? {
            id: category.id,
            name: category.name,
          }
        : null,
    };
  });
}

export async function getTaskCreateCategories(): Promise<TaskCategory[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  throwFetchError(error, data, "task create categories");

  return data.map((category) => ({
    id: category.id,
    name: category.name,
  }));
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

  const projectCategory = rawProject ? pickOne(rawProject.category) : null;

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
    project: rawProject
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
      : null,
    category: category
      ? {
          id: category.id,
          name: category.name,
        }
      : null,
  };
}

export async function getTaskDetailStatuses(): Promise<TaskStatusOption[]> {
  try {
    return await fetchTaskStatuses();
  } catch {
    return [];
  }
}
