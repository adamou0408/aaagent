import { AppDataSource } from "../config/data-source";
import { EntityManager } from "typeorm";

/**
 * Execute a callback within a database transaction.
 * Automatically commits on success, rolls back on error.
 */
export async function withTransaction<T>(
  callback: (manager: EntityManager) => Promise<T>,
): Promise<T> {
  return AppDataSource.transaction(callback);
}
