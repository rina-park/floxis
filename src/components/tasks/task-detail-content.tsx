import Link from "next/link";

import { formatDateOnly, formatDateTime } from "@/lib/format/date";
import type { TaskDetail, TaskStatusOption } from "@/types/task";

type TaskDetailContentProps = {
  task: TaskDetail;
  statuses: TaskStatusOption[];
};

function formatOptionalValue(value: string | null | undefined): string {
  return value?.trim() ? value : "—";
}


export function TaskDetailContent({ task }: TaskDetailContentProps) {
  const effectiveCategory = task.project?.category ?? task.category;

  return (
    <section className="task-detail-page" data-section="task-detail-root">
      <header className="page-header">
        <div className="page-title-group">
          <Link
            href="/tasks"
            className="page-back-link"
            aria-label="Back to task list"
            data-action="go-to-task-list"
          >
            <svg
              className="page-back-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M15 18L9 12L15 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <h1 className="page-title">Task Detail</h1>
        </div>

        <Link
          href={`/tasks/${task.id}/edit`}
          className="button-secondary"
          data-action="go-to-task-edit"
        >
          Edit Task
        </Link>
      </header>

      <article className="task-detail-card" data-entity="task-detail">
        <section className="task-detail-title-section" data-field-group="title">
          <h2 className="task-detail-title" data-field="title">
            {task.title}
          </h2>
        </section>

        <dl className="task-detail-list">
          <div className="task-detail-item" data-field-group="status">
            <dt>Status</dt>
            <dd>
              <span className="task-status-badge" data-field="status">
                {task.status.name}
              </span>
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="category">
            <dt>Category</dt>
            <dd data-field="category">
              {formatOptionalValue(effectiveCategory?.name)}
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="project">
            <dt>Project</dt>
            <dd data-field="project">
              {formatOptionalValue(task.project?.name)}
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="created-at">
            <dt>Created At</dt>
            <dd data-field="created-at">
              {formatDateTime(task.created_at)}
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="due-date">
            <dt>Due Date</dt>
            <dd data-field="due-date">
              {task.due_date ? formatDateOnly(task.due_date) : "—"}
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="completed-at">
            <dt>Completed At</dt>
            <dd data-field="completed-at">
              {task.completed_at ? formatDateTime(task.completed_at) : "—"}
            </dd>
          </div>

          <div className="task-detail-item" data-field-group="description">
            <dt>Notes</dt>
            <dd data-field="description">
              {formatOptionalValue(task.description)}
            </dd>
          </div>

        </dl>
      </article>
      <div className="task-danger-zone">
        <button
          type="button"
          className="button-danger"
          data-action="delete-task"
        >
          Delete Task
        </button>
      </div>
    </section>
  );
}
