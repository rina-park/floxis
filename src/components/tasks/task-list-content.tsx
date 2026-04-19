import Link from "next/link";

import { formatDateOnly, formatDateTime } from "@/lib/format/date";
import type { TaskListRow } from "@/lib/tasks/queries";
import type { TaskStatusOption } from "@/types/task";

type TaskListContentProps = {
  tasks: TaskListRow[];
  statuses: TaskStatusOption[];
};

function getProjectName(task: TaskListRow): string {
  if (!task.project) {
    return "—";
  }

  return task.project.name;
}

export function TaskListContent({
  tasks,
  statuses,
}: TaskListContentProps) {
  return (
    <>
      <h1>Tasks</h1>

      <Link href="/tasks/new" data-action="go-to-task-create">
        Add Task
      </Link>

      <ul data-component="task-list">
        {tasks.map((task) => (
          <li key={task.id} data-entity="task-item">
            <article>
              <h2 data-field="title">{task.title}</h2>

              <label>
                Status:
                {/* Status update is not wired yet in v0.1 */}
                <select
                  name="status"
                  data-action="update-task-status"
                  defaultValue={task.status_id}
                  disabled
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </label>

              <p data-field="due-date">
                Due Date: {formatDateOnly(task.due_date)}
              </p>

              <p data-field="project">
                Project: {getProjectName(task)}
              </p>

              <p data-field="created-at">
                Created At: {formatDateTime(task.created_at)}
              </p>

              <div data-component="task-actions">
                <Link
                  href={`/tasks/${task.id}`}
                  data-action="go-to-task-detail"
                >
                  View Detail
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
