"use server";

import { createTask } from "@/lib/tasks/mutations";

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

export async function createTaskAction(
  input: CreateTaskActionInput,
): Promise<CreateTaskActionResult> {
  return createTask(input);
}
