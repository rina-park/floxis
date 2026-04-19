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
  return updateTask(input);
}
