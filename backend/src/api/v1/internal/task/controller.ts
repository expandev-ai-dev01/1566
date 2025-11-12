import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CrudController,
  errorResponse,
  StatusGeneralError,
  successResponse,
} from '@/middleware/crud';
import { taskCreate, taskList, taskGet, taskUpdate, taskDelete } from '@/services/task';
import { zID, zName, zNullableString, zNullableDate, zBit, zNumber } from '@/utils/zodValidation';

const securable = 'TASK';

/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with specified parameters
 *
 * @apiParam {String} title Task title (3-100 characters)
 * @apiParam {String} [description] Task description (max 1000 characters)
 * @apiParam {Date} [dueDate] Task due date
 * @apiParam {Number} [priority] Task priority (0=Low, 1=Medium, 2=High)
 * @apiParam {Object} [recurrence] Recurrence configuration
 * @apiParam {Array} [attachments] Attachments metadata
 * @apiParam {Array} [tags] Task tags
 * @apiParam {Number} [estimatedTime] Estimated time in minutes (5-1440)
 * @apiParam {Array} [assignedUsers] Assigned user IDs
 *
 * @apiSuccess {Number} idTask Created task identifier
 *
 * @apiError {String} ValidationError Invalid parameters provided
 * @apiError {String} ServerError Internal server error
 */
export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'CREATE' }]);

  const bodySchema = z.object({
    title: zName,
    description: zNullableString(1000),
    dueDate: zNullableDate,
    priority: z.number().int().min(0).max(2).optional().default(1),
    recurrence: zNullableString(),
    attachments: zNullableString(),
    tags: zNullableString(),
    estimatedTime: z.number().int().min(5).max(1440).nullable().optional(),
    assignedUsers: zNullableString(),
  });

  const [validated, error] = await operation.create(req, bodySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskCreate({
      idAccount: 1,
      idUser: 1,
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
 * @api {get} /api/v1/internal/task List Tasks
 * @apiName ListTasks
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves list of tasks with optional filters
 *
 * @apiParam {Number} [completed] Filter by completion status
 * @apiParam {Number} [priority] Filter by priority
 * @apiParam {Date} [dueDateFrom] Filter by due date from
 * @apiParam {Date} [dueDateTo] Filter by due date to
 *
 * @apiSuccess {Array} tasks List of tasks
 *
 * @apiError {String} ServerError Internal server error
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  const operation = new CrudController([{ securable, permission: 'READ' }]);

  const querySchema = z.object({
    completed: z.coerce.number().int().min(0).max(1).optional(),
    priority: z.coerce.number().int().min(0).max(2).optional(),
    dueDateFrom: z.coerce.date().optional(),
    dueDateTo: z.coerce.date().optional(),
  });

  const [validated, error] = await operation.list(req, querySchema);

  if (!validated) {
    return next(error);
  }

  try {
    const data = await taskList({
      idAccount: 1,
      idUser: 1,
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
