import { notFound } from "next/navigation";

import { TaskForm } from "@/components/tasks/task-form";
import {
  getTaskById,
  getTaskCreateCategories,
  getTaskCreateProjects,
  getTaskCreateStatuses,
} from "@/lib/tasks/queries";

type TaskEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskEditPage({ params }: TaskEditPageProps) {
  const { id } = await params;
  const taskId = id.trim();

  if (!taskId) {
    notFound();
  }

  const [task, statuses, projects, categories] = await Promise.all([
    getTaskById(taskId),
    getTaskCreateStatuses(),
    getTaskCreateProjects(),
    getTaskCreateCategories(),
  ]);

  if (!task) {
    notFound();
  }

  const defaultValues = {
    title: task.title,
    due_date: task.due_date ?? "",
    project_id: task.project?.id ?? null,
    category_id: task.project ? null : (task.category?.id ?? null),
    description: task.description ?? "",
    status_id: task.status.id,
  };

  return (
    <TaskForm
      mode="edit"
      taskId={taskId}
      statuses={statuses}
      projects={projects}
      categories={categories}
      defaultValues={defaultValues}
    />
  );
}
