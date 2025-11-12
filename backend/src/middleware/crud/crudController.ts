import { Request } from 'express';
import { z } from 'zod';

/**
 * @summary
 * CRUD controller middleware for handling common CRUD operations
 * with security and validation
 *
 * @class CrudController
 * @module middleware
 */
export class CrudController {
  private permissions: Array<{ securable: string; permission: string }>;

  constructor(permissions: Array<{ securable: string; permission: string }>) {
    this.permissions = permissions;
  }

  /**
   * @summary
   * Validates request for CREATE operations
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[any, any]>} Tuple with validated data or error
   */
  async create(req: Request, schema: z.ZodSchema): Promise<[any, any]> {
    try {
      const validated = await schema.parseAsync(req.body);
      return [{ credential: {}, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @summary
   * Validates request for READ operations
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[any, any]>} Tuple with validated data or error
   */
  async read(req: Request, schema: z.ZodSchema): Promise<[any, any]> {
    try {
      const validated = await schema.parseAsync(req.params);
      return [{ credential: {}, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @summary
   * Validates request for UPDATE operations
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[any, any]>} Tuple with validated data or error
   */
  async update(req: Request, schema: z.ZodSchema): Promise<[any, any]> {
    try {
      const validated = await schema.parseAsync({ ...req.params, ...req.body });
      return [{ credential: {}, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @summary
   * Validates request for DELETE operations
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[any, any]>} Tuple with validated data or error
   */
  async delete(req: Request, schema: z.ZodSchema): Promise<[any, any]> {
    try {
      const validated = await schema.parseAsync(req.params);
      return [{ credential: {}, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }

  /**
   * @summary
   * Validates request for LIST operations
   *
   * @param {Request} req - Express request object
   * @param {z.ZodSchema} schema - Zod validation schema
   *
   * @returns {Promise<[any, any]>} Tuple with validated data or error
   */
  async list(req: Request, schema: z.ZodSchema): Promise<[any, any]> {
    try {
      const validated = await schema.parseAsync(req.query);
      return [{ credential: {}, params: validated }, null];
    } catch (error) {
      return [null, error];
    }
  }
}

/**
 * @summary
 * Creates a success response object
 *
 * @param {any} data - Response data
 * @returns {object} Success response object
 */
export function successResponse(data: any): object {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * @summary
 * Creates an error response object
 *
 * @param {string} message - Error message
 * @returns {object} Error response object
 */
export function errorResponse(message: string): object {
  return {
    success: false,
    error: {
      message,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * @summary
 * General error status object
 */
export const StatusGeneralError = {
  statusCode: 500,
  message: 'Internal Server Error',
};
