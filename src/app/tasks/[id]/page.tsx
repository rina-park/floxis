import { notFound } from "next/navigation";

import { TaskDetailContent } from "@/components/tasks/task-detail-content";
import { getTaskById } from "@/lib/tasks/queries";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { id } = await params;
  const taskId = id.trim();

  if (!taskId) {
    notFound();
  }

  const task = await getTaskById(id);

  if (!task) {
    notFound();
  }

  return <TaskDetailContent task={task}/>;
}
