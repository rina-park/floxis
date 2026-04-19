import Link from "next/link";

import { formatDateOnly, formatDateTime } from "@/lib/format/date";
import type { TaskDetail, TaskStatusOption } from "@/types/task";

type TaskDetailContentProps = {
  task: TaskDetail;
  statuses: TaskStatusOption[];
};

export function TaskDetailContent({
  task,
  statuses,
}: TaskDetailContentProps) {
  const effectiveCategory = task.project?.category ?? task.category;
  const hasTitleOriginal = task.title_original !== null;
  const hasDueDate = task.due_date !== null;
  const hasProject = task.project !== null;
  const hasCategory = effectiveCategory !== null;
  const hasDescription = task.description !== null;
  const hasCompletedAt = task.completed_at !== null;

  return (
    <section data-section="task-detail-root">
      <h1>Task Detail</h1>

      <article data-entity="task-detail">
        <section data-field-group="title">
          <h2 data-field="title">{task.title}</h2>
        </section>

        <section
          data-field-group="title-original"
          hidden={!hasTitleOriginal}
        >
          <h3>Original Input</h3>
          <p data-field="title-original">{task.title_original}</p>
        </section>

        <section data-field-group="status">
          <label htmlFor="task-status">Status</label>
          {/* Status update is not wired yet in v0.1 */}
          <select
            id="task-status"
            name="status"
            defaultValue={task.status.id}
            data-action="update-task-status"
            disabled
          >
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </section>

        <section data-field-group="due-date" hidden={!hasDueDate}>
          <h3>Due Date</h3>
          <p data-field="due-date">{formatDateOnly(task.due_date)}</p>
        </section>

        <section data-field-group="project" hidden={!hasProject}>
          <h3>Project</h3>
          <p data-field="project">{task.project?.name}</p>
        </section>

        <section data-field-group="category" hidden={!hasCategory}>
          <h3>Category</h3>
          <p data-field="category">{effectiveCategory?.name}</p>
        </section>

        <section data-field-group="description" hidden={!hasDescription}>
          <h3>Notes</h3>
          <p data-field="description">{task.description}</p>
        </section>

        <section data-field-group="created-at">
          <h3>Created At</h3>
          <p data-field="created-at">{formatDateTime(task.created_at)}</p>
        </section>

        <section data-field-group="completed-at" hidden={!hasCompletedAt}>
          <h3>Completed At</h3>
          <p data-field="completed-at">{formatDateTime(task.completed_at)}</p>
        </section>

        <section data-component="task-actions">
          <Link href={`/tasks/${task.id}/edit`} data-action="go-to-task-edit">
            Edit Task
          </Link>

          <button type="button" data-action="delete-task">
            Delete Task
          </button>

          <Link href="/tasks" data-action="go-to-task-list">
            Back to Task List
          </Link>
        </section>
      </article>
    </section>
  );
}
