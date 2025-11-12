export interface Task {
  idTask: number;
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 0 | 1 | 2;
  recurrence: string | null;
  attachments: string | null;
  tags: string | null;
  estimatedTime: number | null;
  assignedUsers: string | null;
  completed: 0 | 1;
  createdAt: string;
  idUser: number;
}

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: 0 | 1 | 2;
  recurrence?: string | null;
  attachments?: string | null;
  tags?: string | null;
  estimatedTime?: number | null;
  assignedUsers?: string | null;
}

export interface UpdateTaskDto {
  title: string;
  description: string | null;
  dueDate: string | null;
  priority: 0 | 1 | 2;
  recurrence: string | null;
  attachments: string | null;
  tags: string | null;
  estimatedTime: number | null;
  assignedUsers: string | null;
  completed: 0 | 1;
}

export interface TaskListParams {
  completed?: 0 | 1;
  priority?: 0 | 1 | 2;
  dueDateFrom?: string;
  dueDateTo?: string;
}

export type PriorityLevel = 0 | 1 | 2;

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
};

export const PRIORITY_COLORS: Record<PriorityLevel, string> = {
  0: 'bg-green-100 text-green-800',
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-red-100 text-red-800',
};
