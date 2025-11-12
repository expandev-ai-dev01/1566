import { format } from 'date-fns';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../../types';
import { getTaskListClassName, getTaskItemClassName } from './variants';
import type { TaskListProps } from './types';

export const TaskList = (props: TaskListProps) => {
  const { tasks, onTaskClick, isLoading = false } = props;

  if (isLoading) {
    return (
      <div className={getTaskListClassName()}>
        <p className="text-center text-gray-500">Carregando tarefas...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className={getTaskListClassName()}>
        <p className="text-center text-gray-500">Nenhuma tarefa encontrada</p>
      </div>
    );
  }

  return (
    <div className={getTaskListClassName()}>
      {tasks.map((task) => (
        <div
          key={task.idTask}
          onClick={() => onTaskClick?.(task)}
          className={getTaskItemClassName({ clickable: !!onTaskClick })}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    PRIORITY_COLORS[task.priority]
                  }`}
                >
                  {PRIORITY_LABELS[task.priority]}
                </span>
                {task.dueDate && (
                  <span className="text-xs text-gray-500">
                    Vencimento: {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                  </span>
                )}
                {task.estimatedTime && (
                  <span className="text-xs text-gray-500">{task.estimatedTime} min</span>
                )}
              </div>
            </div>
            <div className="ml-4">
              {task.completed === 1 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Concluída
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Pendente
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
