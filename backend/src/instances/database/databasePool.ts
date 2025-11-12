import sql from 'mssql';
import { config } from '@/config';

let pool: sql.ConnectionPool | null = null;

/**
 * @summary
 * Gets or creates a database connection pool
 *
 * @function getPool
 * @module instances
 *
 * @returns {Promise<sql.ConnectionPool>} Database connection pool
 *
 * @throws {Error} When connection fails
 */
export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    try {
      pool = await new sql.ConnectionPool({
        server: config.database.server,
        port: config.database.port,
        database: config.database.database,
        user: config.database.user,
        password: config.database.password,
        options: config.database.options,
      }).connect();

      console.log('Database connection pool created successfully');

      pool.on('error', (err) => {
        console.error('Database pool error:', err);
        pool = null;
      });
    } catch (error: any) {
      console.error('Failed to create database connection pool:', error.message);
      throw error;
    }
  }

  return pool;
}

/**
 * @summary
 * Closes the database connection pool
 *
 * @function closePool
 * @module instances
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection pool closed');
  }
}
