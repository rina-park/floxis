import { createServerClient } from "@/lib/supabase/server";

export type CreateTaskInput = {
  title: string;
  due_date: string | null;
  project_id: string | null;
  category_id: string | null;
  description: string | null;
  status_id: string;
};

export type CreateTaskResult = {
  id: string;
};

export type UpdateTaskInput = {
  taskId: string;
  title: string;
  due_date: string | null;
  project_id: string | null;
  category_id: string | null;
  description: string | null;
  status_id: string;
};

export type UpdateTaskResult = {
  id: string;
};

type NormalizedTaskInput = {
  title: string;
  due_date: string | null;
  project_id: string | null;
  category_id: string | null;
  description: string | null;
  status_id: string;
};

function normalizeTaskInput(
  input: Omit<UpdateTaskInput, "taskId">,
): NormalizedTaskInput {
  const normalizedTitle = input.title.trim();
  const normalizedDueDate = input.due_date || null;
  const normalizedProjectId = input.project_id || null;
  const normalizedCategoryId = normalizedProjectId
    ? null
    : input.category_id || null;
  const normalizedDescription = input.description?.trim() || null;
  const normalizedStatusId = input.status_id;

  return {
    title: normalizedTitle,
    due_date: normalizedDueDate,
    project_id: normalizedProjectId,
    category_id: normalizedCategoryId,
    description: normalizedDescription,
    status_id: normalizedStatusId,
  };
}

export async function createTask(
  input: CreateTaskInput,
): Promise<CreateTaskResult> {
  const supabase = await createServerClient();
  const normalizedInput = normalizeTaskInput(input);

  if (!normalizedInput.title) {
    throw new Error("Failed to create task: Title is required.");
  }

  if (!normalizedInput.status_id) {
    throw new Error("Failed to create task: Status is required.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: normalizedInput.title,
      title_original: null,
      description: normalizedInput.description,
      status_id: normalizedInput.status_id,
      due_date: normalizedInput.due_date,
      project_id: normalizedInput.project_id,
      category_id: normalizedInput.category_id,
      completed_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to create task: ${error?.message ?? "Unknown error"}`,
    );
  }

  return {
    id: data.id,
  };
}

export async function updateTask(
  input: UpdateTaskInput,
): Promise<UpdateTaskResult> {
  const supabase = await createServerClient();
  const normalizedTaskId = input.taskId.trim();
  const normalizedInput = normalizeTaskInput(input);

  if (!normalizedTaskId) {
    throw new Error("Failed to update task: Task ID is required.");
  }

  if (!normalizedInput.title) {
    throw new Error("Failed to update task: Title is required.");
  }

  if (!normalizedInput.status_id) {
    throw new Error("Failed to update task: Status is required.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .update({
      title: normalizedInput.title,
      due_date: normalizedInput.due_date,
      project_id: normalizedInput.project_id,
      category_id: normalizedInput.category_id,
      description: normalizedInput.description,
      status_id: normalizedInput.status_id,
    })
    .eq("id", normalizedTaskId)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `Failed to update task: ${error?.message ?? "Unknown error"}`,
    );
  }

  return { id: data.id };
}
