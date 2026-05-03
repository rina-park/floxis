import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/get-current-user";

import type {
  CategoryOption,
  ProjectOption,
  TaskDetail,
  TaskStatusOption,
} from "@/types/task";

function normalizeJoinedOne<T>(
  value: T | T[] | null | undefined,
): T | null {
  return Array.isArray(value)
    ? value[0] ?? null
    : value ?? null;
}

function assertNoError(
  error: { message?: string } | null,
  context: string,
): void {
  if (error) {
    throw new Error(
      `Failed to fetch ${context}: ${error.message ?? "Unknown error"}`,
    );
  }
}

function assertDataExists(
  data: unknown,
  context: string,
): void {
  if (data == null) {
    throw new Error(`No data returned for ${context}`);
  }
}

function assertFetched<T>(
  error: { message?: string } | null,
  data: T | null | undefined,
  context: string,
): asserts data is T {
  assertNoError(error, context);
  assertDataExists(data, context);
}

async function fetchTaskStatuses(): Promise<TaskStatusOption[]> {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("statuses")
    .select("id, key, name")
    .eq("owner_id", user.id)
    .order("sort_order", { ascending: true });

  assertFetched(error, data, "task statuses");

  return data.map((status) => ({
    id: status.id,
    key: status.key,
    name: status.name,
  }));
}

export async function getTasks() {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
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
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  assertFetched(error, data, "tasks");

  return data.map((task) => {
    const project = normalizeJoinedOne(task.project);

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

export type TaskListRow = Awaited<ReturnType<typeof getTasks>>[number];

export async function getTaskListStatuses(): Promise<TaskStatusOption[]> {
  return fetchTaskStatuses();
}

export async function getTaskFormStatuses(): Promise<TaskStatusOption[]> {
  return fetchTaskStatuses();
}

export async function getTaskCreateProjects(): Promise<ProjectOption[]> {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
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
    .eq("owner_id", user.id)
    .order("sort_order", { ascending: true });

  // プロジェクト・カテゴリ未設定でもタスク作成は可能なので空配列で返す
  assertNoError(error, "task create projects");

  return (data ?? []).map((project) => {
    const category = normalizeJoinedOne(project.category);

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

export async function getTaskCreateCategories(): Promise<CategoryOption[]> {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name")
    .eq("owner_id", user.id)
    .order("sort_order", { ascending: true });

  // プロジェクト・カテゴリ未設定でもタスク作成は可能なので空配列で返す
  assertNoError(error, "task create categories");

  return (data ?? []).map((category) => ({
    id: category.id,
    name: category.name,
  }));
}

export async function getTaskById(taskId: string): Promise<TaskDetail | null> {
  const supabase = await createServerClient();
  const user = await getCurrentUser();
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
    .eq("owner_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch task: ${error.message}`);
  }

  if (!data) return null;

  const status = normalizeJoinedOne(data.status);
  const category = normalizeJoinedOne(data.category);
  const rawProject = normalizeJoinedOne(data.project);

  if (!status) {
    throw new Error(`Task ${taskId} is missing a valid status relation`);
  }

  const projectCategory = rawProject
    ? normalizeJoinedOne(rawProject.category)
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
  return fetchTaskStatuses();
}
