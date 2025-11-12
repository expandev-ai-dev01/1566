/**
 * @summary
 * Shared test helper functions
 *
 * @module tests
 */

import { Request, Response } from 'express';

/**
 * @summary
 * Creates a mock Express request object
 *
 * @param {Partial<Request>} overrides - Request properties to override
 * @returns {Partial<Request>} Mock request object
 */
export function createMockRequest(overrides: Partial<Request> = {}): Partial<Request> {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    ...overrides,
  };
}

/**
 * @summary
 * Creates a mock Express response object
 *
 * @returns {Partial<Response>} Mock response object
 */
export function createMockResponse(): Partial<Response> {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
}
