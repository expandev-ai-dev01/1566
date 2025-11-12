import { dbRequest, ExpectedReturn } from '@/utils/database';
import {
  TaskCreateRequest,
  TaskListRequest,
  TaskGetRequest,
  TaskUpdateRequest,
  TaskDeleteRequest,
  TaskEntity,
} from './taskTypes';

/**
 * @summary
 * Creates a new task with specified parameters
 *
 * @function taskCreate
 * @module task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 *
 * @returns {Promise<{ idTask: number }>} Created task identifier
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function taskCreate(params: TaskCreateRequest): Promise<{ idTask: number }> {
  const result = await dbRequest(
    '[functional].[spTaskCreate]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      title: params.title,
      description: params.description || null,
      dueDate: params.dueDate || null,
      priority: params.priority !== undefined ? params.priority : 1,
      recurrence: params.recurrence || null,
      attachments: params.attachments || null,
      tags: params.tags || null,
      estimatedTime: params.estimatedTime || null,
      assignedUsers: params.assignedUsers || null,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Retrieves list of tasks with optional filters
 *
 * @function taskList
 * @module task
 *
 * @param {TaskListRequest} params - Task list parameters
 *
 * @returns {Promise<TaskEntity[]>} List of tasks
 *
 * @throws {DatabaseError} When database operation fails
 */
export async function taskList(params: TaskListRequest): Promise<TaskEntity[]> {
  const result = await dbRequest(
    '[functional].[spTaskList]',
    {
      idAccount: params.idAccount,
      idUser: params.idUser,
      completed: params.completed !== undefined ? params.completed : null,
      priority: params.priority !== undefined ? params.priority : null,
      dueDateFrom: params.dueDateFrom || null,
      dueDateTo: params.dueDateTo || null,
    },
    ExpectedReturn.Single
  );

  return result;
}

/**
 * @summary
 * Retrieves detailed information for a specific task
 *
 * @function taskGet
 * @module task
 *
 * @param {TaskGetRequest} params - Task get parameters
 *
 * @returns {Promise<TaskEntity>} Task details
 *
 * @throws {ValidationError} When task not found
 * @throws {DatabaseError} When database operation fails
 */
export async function taskGet(params: TaskGetRequest): Promise<TaskEntity> {
  const result = await dbRequest(
    '[functional].[spTaskGet]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Updates an existing task
 *
 * @function taskUpdate
 * @module task
 *
 * @param {TaskUpdateRequest} params - Task update parameters
 *
 * @returns {Promise<{ rowsAffected: number }>} Number of rows updated
 *
 * @throws {ValidationError} When parameters fail validation
 * @throws {DatabaseError} When database operation fails
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<{ rowsAffected: number }> {
  const result = await dbRequest(
    '[functional].[spTaskUpdate]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
      title: params.title,
      description: params.description || null,
      dueDate: params.dueDate || null,
      priority: params.priority,
      recurrence: params.recurrence || null,
      attachments: params.attachments || null,
      tags: params.tags || null,
      estimatedTime: params.estimatedTime || null,
      assignedUsers: params.assignedUsers || null,
      completed: params.completed,
    },
    ExpectedReturn.Single
  );

  return result[0];
}

/**
 * @summary
 * Soft deletes a task
 *
 * @function taskDelete
 * @module task
 *
 * @param {TaskDeleteRequest} params - Task delete parameters
 *
 * @returns {Promise<{ rowsAffected: number }>} Number of rows deleted
 *
 * @throws {ValidationError} When task not found
 * @throws {DatabaseError} When database operation fails
 */
export async function taskDelete(params: TaskDeleteRequest): Promise<{ rowsAffected: number }> {
  const result = await dbRequest(
    '[functional].[spTaskDelete]',
    {
      idAccount: params.idAccount,
      idTask: params.idTask,
    },
    ExpectedReturn.Single
  );

  return result[0];
}
