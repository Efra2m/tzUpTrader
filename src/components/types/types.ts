export interface Subtask {
  id: number;
  title: string;
  status: string;
}
export type TaskStatus = "queue" | "development" | "done";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

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
  comments?: Comment[];
}

export interface TasksCollection {
  queue?: Task[];
  development?: Task[];
  done?: Task[];
}

export interface ProjectsData {
  [projectKey: string]: TasksCollection;
}
export type TaskColumn = "queue" | "development" | "done";
