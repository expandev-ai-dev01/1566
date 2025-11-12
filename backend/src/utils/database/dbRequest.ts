import sql from 'mssql';
import { getPool } from '@/instances/database';

/**
 * @summary
 * Enum for expected return types from database operations
 */
export enum ExpectedReturn {
  Single = 'Single',
  Multi = 'Multi',
  None = 'None',
}

/**
 * @summary
 * Interface for database record sets
 */
export interface IRecordSet<T = any> extends Array<T> {
  columns: any;
  recordset: T[];
}

/**
 * @summary
 * Executes a stored procedure with parameters
 *
 * @function dbRequest
 * @module utils
 *
 * @param {string} routine - Stored procedure name
 * @param {object} parameters - Procedure parameters
 * @param {ExpectedReturn} expectedReturn - Expected return type
 * @param {sql.Transaction} [transaction] - Optional transaction
 * @param {string[]} [resultSetNames] - Optional result set names
 *
 * @returns {Promise<any>} Database operation result
 *
 * @throws {Error} When database operation fails
 */
export async function dbRequest(
  routine: string,
  parameters: any = {},
  expectedReturn: ExpectedReturn = ExpectedReturn.Single,
  transaction?: sql.Transaction,
  resultSetNames?: string[]
): Promise<any> {
  try {
    const pool = await getPool();
    const request = transaction ? new sql.Request(transaction) : pool.request();

    // Add parameters to request
    Object.keys(parameters).forEach((key) => {
      request.input(key, parameters[key]);
    });

    // Execute stored procedure
    const result = await request.execute(routine);

    // Handle different return types
    switch (expectedReturn) {
      case ExpectedReturn.Single:
        return result.recordset;

      case ExpectedReturn.Multi:
        if (resultSetNames && resultSetNames.length > 0) {
          const namedResults: any = {};
          resultSetNames.forEach((name, index) => {
            namedResults[name] = result.recordsets[index];
          });
          return namedResults;
        }
        return result.recordsets;

      case ExpectedReturn.None:
        return result.rowsAffected;

      default:
        return result.recordset;
    }
  } catch (error: any) {
    console.error('Database request error:', {
      routine,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

/**
 * @summary
 * Begins a database transaction
 *
 * @returns {Promise<sql.Transaction>} Transaction object
 */
export async function beginTransaction(): Promise<sql.Transaction> {
  const pool = await getPool();
  const transaction = new sql.Transaction(pool);
  await transaction.begin();
  return transaction;
}

/**
 * @summary
 * Commits a database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to commit
 */
export async function commitTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.commit();
}

/**
 * @summary
 * Rolls back a database transaction
 *
 * @param {sql.Transaction} transaction - Transaction to rollback
 */
export async function rollbackTransaction(transaction: sql.Transaction): Promise<void> {
  await transaction.rollback();
}
