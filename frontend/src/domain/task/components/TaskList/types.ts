import type { Task } from '../../types';

export interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  isLoading?: boolean;
}
