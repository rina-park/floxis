"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

import { createTaskAction, updateTaskAction } from "@/lib/tasks/actions";

import type {
  TaskCategory,
  TaskProject,
  TaskStatusOption,
} from "@/types/task";

type TaskFormValues = {
  title: string;
  due_date: string;
  project_id: string | null;
  category_id: string | null;
  description: string;
  status_id: string;
};

type TaskFormBaseProps = {
  statuses: TaskStatusOption[];
  projects: TaskProject[];
  categories: TaskCategory[];
  defaultValues: TaskFormValues;
};

type TaskCreateFormProps = TaskFormBaseProps & {
  mode: "create";
  taskId?: never;
};

type TaskEditFormProps = TaskFormBaseProps & {
  mode: "edit";
  taskId: string;
};

export type TaskFormProps = TaskCreateFormProps | TaskEditFormProps;

export function TaskForm(props: TaskFormProps) {
  const { mode, statuses, projects, categories, defaultValues } = props;

  const router = useRouter();

  const [formValues, setFormValues] = useState<TaskFormValues>(defaultValues);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const availableProjects = useMemo(() => {
    return projects.filter(
      (project): project is NonNullable<TaskProject> => project !== null,
    );
  }, [projects]);

  const availableCategories = useMemo(() => {
    return categories.filter(
      (category): category is NonNullable<TaskCategory> => category !== null,
    );
  }, [categories]);

  const isProjectSelected =
    formValues.project_id !== null && formValues.project_id !== "";

  const formTitle = mode === "create" ? "Create Task" : "Edit Task";
  const submitLabel = isPending
    ? "Saving..."
    : mode === "create"
      ? "Save Task"
      : "Save Changes";

  const screenName = mode === "create" ? "task-create" : "task-edit";
  const rootSectionName =
    mode === "create" ? "task-create-root" : "task-edit-root";
  const formComponentName =
    mode === "create" ? "task-create-form" : "task-edit-form";

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormValues((currentValues) => ({
      ...currentValues,
      title: event.target.value,
    }));
  }

  function handleDueDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormValues((currentValues) => ({
      ...currentValues,
      due_date: event.target.value,
    }));
  }

  function handleProjectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextProjectId = event.target.value || null;

    setFormValues((currentValues) => ({
      ...currentValues,
      project_id: nextProjectId,
      // project 配下タスクでは category は project 側で解釈するため、UIで明示的に null に戻す
      category_id: nextProjectId ? null : currentValues.category_id,
    }));
  }

  function handleCategoryChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormValues((currentValues) => ({
      ...currentValues,
      category_id: event.target.value || null,
    }));
  }

  function handleDescriptionChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    setFormValues((currentValues) => ({
      ...currentValues,
      description: event.target.value,
    }));
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setFormValues((currentValues) => ({
      ...currentValues,
      status_id: event.target.value,
    }));
  }

  function handleCancel() {
    if (mode === "edit") {
      router.push(`/tasks/${props.taskId}`);
      return;
    }

    router.push("/tasks");
  }

  function validateForm(values: TaskFormValues) {
    const nextValidationErrors: string[] = [];

    if (values.title.trim().length === 0) {
      nextValidationErrors.push("Title is required.");
    }

    if (values.due_date) {
      const isAbsoluteDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(values.due_date);
      const parsedDate = new Date(values.due_date);
      const isValidDate = !Number.isNaN(parsedDate.getTime());

      if (!isAbsoluteDateFormat || !isValidDate) {
        nextValidationErrors.push("Due Date must be an absolute date.");
      }
    }

    if (values.project_id && values.category_id) {
      nextValidationErrors.push(
        "Category must be empty when Project is selected.",
      );
    }

    if (!values.status_id) {
      nextValidationErrors.push("Status is required.");
    }

    return nextValidationErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isPending) {
      return;
    }

    const normalizedValues: TaskFormValues = {
      ...formValues,
      title: formValues.title.trim(),
      due_date: formValues.due_date || "",
      project_id: formValues.project_id || null,
      category_id: formValues.project_id ? null : formValues.category_id || null,
      description: formValues.description.trim(),
      status_id: formValues.status_id,
    };

    const nextValidationErrors = validateForm(normalizedValues);

    if (nextValidationErrors.length > 0) {
      setValidationErrors(nextValidationErrors);
      setSubmitError(null);
      return;
    }

    setValidationErrors([]);
    setSubmitError(null);

    startTransition(async () => {
      try {
        if (mode === "edit") {
          await updateTaskAction({
            taskId: props.taskId,
            title: normalizedValues.title,
            due_date: normalizedValues.due_date || null,
            project_id: normalizedValues.project_id,
            category_id: normalizedValues.category_id,
            description: normalizedValues.description || null,
            status_id: normalizedValues.status_id,
          });

          router.push(`/tasks/${props.taskId}`);
          return;
        }

        await createTaskAction({
          title: normalizedValues.title,
          due_date: normalizedValues.due_date || null,
          project_id: normalizedValues.project_id,
          category_id: normalizedValues.category_id,
          description: normalizedValues.description || null,
          status_id: normalizedValues.status_id,
        });

        router.push("/tasks");
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Failed to save task. Please try again.",
        );
      }
    });
  }

  return (
    <main data-screen={screenName}>
      <section data-section={rootSectionName}>
        <h1>{formTitle}</h1>

        <form data-component={formComponentName} onSubmit={handleSubmit}>
          <div data-field-group="title">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleTitleChange}
              required
              disabled={isPending}
            />
          </div>

          <div data-field-group="due-date">
            <label htmlFor="task-due-date">Due Date</label>
            <input
              id="task-due-date"
              name="due_date"
              type="date"
              value={formValues.due_date}
              onChange={handleDueDateChange}
              disabled={isPending}
            />
          </div>

          <div data-field-group="project">
            <label htmlFor="task-project">Project</label>
            <select
              id="task-project"
              name="project_id"
              value={formValues.project_id ?? ""}
              onChange={handleProjectChange}
              disabled={isPending}
            >
              <option value="">No Project</option>
              {availableProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div data-field-group="category">
            <label htmlFor="task-category">Category</label>
            <select
              id="task-category"
              name="category_id"
              value={formValues.category_id ?? ""}
              onChange={handleCategoryChange}
              disabled={isProjectSelected || isPending}
            >
              <option value="">No Category</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {isProjectSelected ? (
              <p>Category is disabled when Project is selected.</p>
            ) : null}
          </div>

          <div data-field-group="description">
            <label htmlFor="task-description">Notes</label>
            <textarea
              id="task-description"
              name="description"
              rows={6}
              value={formValues.description}
              onChange={handleDescriptionChange}
              disabled={isPending}
            />
          </div>

          <div data-field-group="status" hidden={mode === "create"}>
            {mode === "edit" ? (
              <>
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  name="status_id"
                  value={formValues.status_id}
                  onChange={handleStatusChange}
                  disabled={isPending}
                >
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
          </div>

          {mode === "create" ? (
            <div data-field-group="status-hidden" hidden>
              <input
                type="hidden"
                name="status_id"
                value={formValues.status_id}
                readOnly
              />
            </div>
          ) : null}

          <div data-component="form-actions">
            <button
              type="submit"
              data-action={mode === "create" ? "create-task" : "update-task"}
              disabled={isPending}
            >
              {submitLabel}
            </button>
            <button
              type="button"
              data-action={
                mode === "create" ? "cancel-task-create" : "cancel-task-edit"
              }
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>

      <section
        data-section="validation-errors"
        hidden={validationErrors.length === 0}
      >
        <h2>Validation Errors</h2>
        <ul>
          {validationErrors.map((validationError) => (
            <li key={validationError}>{validationError}</li>
          ))}
        </ul>
      </section>

      <section data-section="submit-errors" hidden={submitError === null}>
        <h2>Save Error</h2>
        {submitError ? <p>{submitError}</p> : null}
      </section>
    </main>
  );
}
