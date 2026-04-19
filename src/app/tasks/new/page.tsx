import { TaskForm } from "@/components/tasks/task-form";
import {
  getTaskCreateCategories,
  getTaskCreateProjects,
  getTaskCreateStatuses,
} from "@/lib/tasks/queries";

export default async function TaskCreatePage() {
  const [statuses, projects, categories] = await Promise.all([
    getTaskCreateStatuses(),
    getTaskCreateProjects(),
    getTaskCreateCategories(),
  ]);

  const pendingStatus = statuses.find((status) => status.key === "pending");

  if (!pendingStatus) {
    throw new Error("Pending status is required to create a task.");
  }

  return (
    <TaskForm
      mode="create"
      statuses={statuses}
      projects={projects}
      categories={categories}
      defaultValues={{
        title: "",
        due_date: "",
        project_id: null,
        category_id: null,
        description: "",
        status_id: pendingStatus.id,
      }}
    />
  );
}
