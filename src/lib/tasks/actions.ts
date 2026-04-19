"use server";

import { createTask, updateTask } from "@/lib/tasks/mutations";

export type CreateTaskActionInput = {
  title: string;
  due_date: string | null;
  project_id: string | null;
  category_id: string | null;
  description: string | null;
  status_id: string;
};

export type CreateTaskActionResult = {
  id: string;
};

export type UpdateTaskActionInput = {
  taskId: string;
  title: string;
  due_date: string | null;
  project_id: string | null;
  category_id: string | null;
  description: string | null;
  status_id: string;
};

export type UpdateTaskActionResult = {
  id: string;
};

export async function createTaskAction(
  input: CreateTaskActionInput,
): Promise<CreateTaskActionResult> {
  return createTask(input);
}

export async function updateTaskAction(
  input: UpdateTaskActionInput,
): Promise<UpdateTaskActionResult> {
  const normalizedTaskId = input.taskId.trim();
  const normalizedTitle = input.title.trim();
  const normalizedDueDate = input.due_date || null;
  const normalizedProjectId = input.project_id || null;
  const normalizedCategoryId = normalizedProjectId
    ? null
    : input.category_id || null;
  const normalizedDescription = input.description?.trim() || null;
  const normalizedStatusId = input.status_id;

  return updateTask({
    taskId: normalizedTaskId,
    title: normalizedTitle,
    due_date: normalizedDueDate,
    project_id: normalizedProjectId,
    category_id: normalizedCategoryId,
    description: normalizedDescription,
    status_id: normalizedStatusId,
  });
}
