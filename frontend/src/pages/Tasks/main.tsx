import { useState } from 'react';
import { TaskForm, TaskList, useTaskList, useTaskCreate } from '@/domain/task';
import type { CreateTaskDto } from '@/domain/task';
import type { TasksPageProps } from './types';

export const TasksPage = (props: TasksPageProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'quick' | 'full'>('full');

  const { tasks, isLoading, refetch } = useTaskList();
  const { createTask, isCreating } = useTaskCreate({
    onSuccess: () => {
      setShowForm(false);
      refetch();
    },
  });

  const handleSubmit = async (data: CreateTaskDto) => {
    try {
      await createTask(data);
    } catch (error: unknown) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Tarefas</h1>
          <div className="flex gap-2">
            {!showForm && (
              <>
                <button
                  onClick={() => {
                    setFormMode('quick');
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Criação Rápida
                </button>
                <button
                  onClick={() => {
                    setFormMode('full');
                    setShowForm(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Nova Tarefa
                </button>
              </>
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-6">
            <TaskForm
              mode={formMode}
              onSubmit={handleSubmit}
              onCancel={() => setShowForm(false)}
              isSubmitting={isCreating}
            />
          </div>
        )}
      </div>

      <TaskList tasks={tasks || []} isLoading={isLoading} />
    </div>
  );
};

export default TasksPage;
