import Link from "next/link";

type TaskListItem = {
  id: string;
  title: string;
  status_id: string;
  due_date: string | null;
  created_at: string;
  project?: {
    name: string;
  } | null;
};

type TaskListStatus = {
  id: string;
  key: string;
  name: string;
};

type TaskListContentProps = {
  tasks: TaskListItem[];
  statuses: TaskListStatus[];
};

function formatDate(value: string | null): string {
  if (!value) {
    return "—";
  }

  return value.slice(0, 10);
}

function getProjectName(task: TaskListItem): string {
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
                <select
                  name="status"
                  data-action="update-task-status"
                  defaultValue={task.status_id}
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </label>

              <p data-field="due-date">
                Due Date: {formatDate(task.due_date)}
              </p>

              <p data-field="project">
                Project: {getProjectName(task)}
              </p>

              <p data-field="created-at">
                Created At: {formatDate(task.created_at)}
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
