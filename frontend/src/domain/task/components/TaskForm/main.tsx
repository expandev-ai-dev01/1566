import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getTaskFormClassName } from './variants';
import type { TaskFormProps } from './types';
import type { CreateTaskDto } from '../../types';

const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres')
    .nullable()
    .optional(),
  dueDate: z.string().nullable().optional(),
  priority: z.union([z.literal(0), z.literal(1), z.literal(2)]).optional(),
  estimatedTime: z.number().int().min(5).max(1440).nullable().optional(),
  tags: z.string().nullable().optional(),
  recurrence: z.string().nullable().optional(),
  attachments: z.string().nullable().optional(),
  assignedUsers: z.string().nullable().optional(),
});

export const TaskForm = (props: TaskFormProps) => {
  const { onSubmit, onCancel, isSubmitting = false, mode = 'full' } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTaskDto>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 1,
      description: null,
      dueDate: null,
      estimatedTime: null,
      tags: null,
      recurrence: null,
      attachments: null,
      assignedUsers: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={getTaskFormClassName()}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o título da tarefa"
            disabled={isSubmitting}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        {mode === 'full' && (
          <>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva os detalhes da tarefa"
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Vencimento
                </label>
                <input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                {errors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  id="priority"
                  {...register('priority', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  <option value="0">Baixa</option>
                  <option value="1">Média</option>
                  <option value="2">Alta</option>
                </select>
                {errors.priority && (
                  <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="estimatedTime"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tempo Estimado (minutos)
                </label>
                <input
                  id="estimatedTime"
                  type="number"
                  {...register('estimatedTime', { valueAsNumber: true })}
                  min="5"
                  max="1440"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 60"
                  disabled={isSubmitting}
                />
                {errors.estimatedTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedTime.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  {...register('tags')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: trabalho, urgente"
                  disabled={isSubmitting}
                />
                {errors.tags && <p className="mt-1 text-sm text-red-600">{errors.tags.message}</p>}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 justify-end mt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </div>
    </form>
  );
};
