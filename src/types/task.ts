export type TaskStatusOption = {
  id: string;
  key: string;
  name: string;
};

export type TaskCategory = {
  id: string;
  name: string;
} | null;

export type TaskProject = {
  id: string;
  name: string;
  category: TaskCategory;
} | null;

export type TaskDetail = {
  id: string;
  title: string;
  title_original: string | null;
  description: string | null;
  due_date: string | null;
  created_at: string;
  completed_at: string | null;
  status: TaskStatusOption;
  project: TaskProject;
  category: TaskCategory;
};
