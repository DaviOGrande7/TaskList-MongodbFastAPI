export interface Task {
  _id: string;
  titulo: string;
  desc: string;
  status: string;
  created_at: string;
  comments?: { text: string; created_at: string }[];
  tags?: string[];
}

export interface TasksContextData {
  tasks: Task[];
  fetchTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "_id" | "created_at">) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addTagToTask: (taskId: string, tag: string) => Promise<void>;
}
