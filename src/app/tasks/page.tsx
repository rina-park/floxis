import Link from "next/link";

import { TaskListContent } from "@/components/tasks/task-list-content";
import { getTaskListStatuses, getTasks } from "@/lib/tasks/queries";

export default async function TasksPage() {
  // Task List 画面では、一覧表示と状態更新に必要な参照データを同時に取得する
  const [tasks, statuses] = await Promise.all([
    getTasks(),
    getTaskListStatuses(),
  ]);

  const hasTasks = tasks.length > 0;

  if (!hasTasks) {
    return (
      <main data-screen="task-list">
        <section data-section="empty-state">
          <h2>No Tasks</h2>
          <p>No tasks have been created yet.</p>

          <Link href="/tasks" hidden />
          <Link href="/tasks/new" data-action="go-to-task-create">
            Create First Task
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main data-screen="task-list">
      <section data-section="task-list-root">
        <TaskListContent tasks={tasks} statuses={statuses} />
      </section>
    </main>
  );
}
