import { clsx } from 'clsx';

export function getTaskListClassName(): string {
  return clsx('space-y-3');
}

export interface TaskItemVariantProps {
  clickable?: boolean;
}

export function getTaskItemClassName(props: TaskItemVariantProps): string {
  const { clickable = false } = props;

  return clsx('bg-white rounded-lg shadow-sm p-4 border border-gray-200', {
    'cursor-pointer hover:shadow-md transition-shadow': clickable,
  });
}
