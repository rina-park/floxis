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

export async function createTask(
  input: CreateTaskInput,
): Promise<CreateTaskResult> {
  const supabase = await createServerClient();

  const normalizedTitle = input.title.trim();
  const normalizedDueDate = input.due_date || null;
  const normalizedProjectId = input.project_id || null;
  const normalizedCategoryId = normalizedProjectId
    ? null
    : input.category_id || null;
  const normalizedDescription = input.description?.trim() || null;
  const normalizedStatusId = input.status_id;

  if (!normalizedTitle) {
    throw new Error("Failed to create task: Title is required.");
  }

  if (!normalizedStatusId) {
    throw new Error("Failed to create task: Status is required.");
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: normalizedTitle,
      title_original: null,
      description: normalizedDescription,
      status_id: normalizedStatusId,
      due_date: normalizedDueDate,
      project_id: normalizedProjectId,
      category_id: normalizedCategoryId,
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
