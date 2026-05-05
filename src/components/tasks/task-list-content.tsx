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

function getCategoryName(task: TaskListRow): string {
  return task.category?.name ?? "—";
}

function getStatusName(
  task: TaskListRow,
  statuses: TaskStatusOption[],
): string {
  const status = statuses.find((status) => status.id === task.status_id);

  return status?.name ?? "Unknown";
}

export function TaskListContent({
  tasks,
  statuses,
}: TaskListContentProps) {
  return (
    <section className="task-list-page">

      <header className="page-header">
        <h1 className="page-title">Tasks</h1>
        <Link href="/tasks/new" className="button-primary" data-action="go-to-task-create">
          Add Task
        </Link>
      </header>

      <ul className="task-list" data-component="task-list">
        {tasks.map((task) =>(
          <li
            key={task.id}
            className="task-list-item"
            data-entity="task-item"
          >
            <Link
              href={`/tasks/${task.id}`}
              className="task-card-link"
              data-action="go-to-task-detail"
            >
              <article className="task-card">
                <header className="task-card-header">
                  <h2 className="task-card-title" data-field="title">
                    {task.title}
                  </h2>

                  <span className="task-status-badge" data-field="status">
                    {getStatusName(task, statuses)}
                  </span>
                </header>

                <dl className="task-meta-list">
                  <div className="task-meta-row">
                    <div className="task-meta-item">
                      <dt>Category</dt>
                      <dd data-field="category">{getCategoryName(task)}</dd>
                    </div>
                     <div className="task-meta-item">
                      <dt>Project</dt>
                      <dd data-field="project">{getProjectName(task)}</dd>
                    </div>
                  </div>

                  <div className="task-meta-row">
                    <div className="task-meta-item">
                      <dt>Created At</dt>
                      <dd data-field="created-at">{formatDateTime(task.created_at)}</dd>
                    </div>

                    <div className="task-meta-item">
                      <dt>Due Date</dt>
                      <dd data-field="due-date">{formatDateOnly(task.due_date)}</dd>
                    </div>
                  </div>
                </dl>
              </article>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
