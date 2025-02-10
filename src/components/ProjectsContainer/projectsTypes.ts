export type TaskStatus = "queue" | "development" | "done";

export interface Task {
  id: number;
  title: string;
  description: string;
  createdAt?: string;
  workingTime?: string;
  endDate?: string | null;
  priority?: string;
  files?: string[];
  status: TaskStatus;
  subtasks?: { id: number; title: string; status: string }[];
}

export interface TasksCollection {
  queue: Task[];
  development: Task[];
  done: Task[];
}

export interface ProjectsData {
  [projectKey: string]: TasksCollection;
}
