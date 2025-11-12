import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zID, zName, zNullableString, zNullableDate, zBit } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {get} /api/v1/internal/task/:id Get Task
 * @apiName GetTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves detailed information for a specific task
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Object} task Task details
 *
 * @apiError {String} ValidationError Task not found
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const paramsSchema = z.object({
    id: zID,
  });

  const [validated, error] = await operation.read(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskGet({
      idAccount: 1,
      idTask: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {put} /api/v1/internal/task/:id Update Task
 * @apiName UpdateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Updates an existing task
 *
 * @apiParam {Number} id Task identifier
 * @apiParam {String} title Task title
 * @apiParam {String} [description] Task description
 * @apiParam {Date} [dueDate] Task due date
 * @apiParam {Number} priority Task priority
 * @apiParam {Object} [recurrence] Recurrence configuration
 * @apiParam {Array} [attachments] Attachments metadata
 * @apiParam {Array} [tags] Task tags
 * @apiParam {Number} [estimatedTime] Estimated time in minutes
 * @apiParam {Array} [assignedUsers] Assigned user IDs
 * @apiParam {Number} completed Completion status
 *
 * @apiSuccess {Number} rowsAffected Number of rows updated
 *
 * @apiError {String} ValidationError Invalid parameters
 * @apiError {String} ServerError Internal server error
 */
export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'UPDATE' }]);

  const schema = z.object({
    id: zID,
    title: zName,
    description: zNullableString(1000),
    dueDate: zNullableDate,
    priority: z.number().int().min(0).max(2),
    recurrence: zNullableString(),
    attachments: zNullableString(),
    tags: zNullableString(),
    estimatedTime: z.number().int().min(5).max(1440).nullable().optional(),
    assignedUsers: zNullableString(),
    completed: zBit,
  });

  const [validated, error] = await operation.update(req, schema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskUpdate({
      idAccount: 1,
      idTask: validated.params.id,
      ...validated.params,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}

/**
 * @api {delete} /api/v1/internal/task/:id Delete Task
 * @apiName DeleteTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Soft deletes a task
 *
 * @apiParam {Number} id Task identifier
 *
 * @apiSuccess {Number} rowsAffected Number of rows deleted
 *
 * @apiError {String} ValidationError Task not found
 * @apiError {String} ServerError Internal server error
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'DELETE' }]);

  const paramsSchema = z.object({
    id: zID,
  });

  const [validated, error] = await operation.delete(req, paramsSchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskDelete({
      idAccount: 1,
      idTask: validated.params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.number === 51000) {
      res.status(400).json(errorResponse(error.message));
    } else {
      next(StatusGeneralError);
    }
  }
}
