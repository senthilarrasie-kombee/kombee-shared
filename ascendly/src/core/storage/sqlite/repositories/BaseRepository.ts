import {Database} from '../Database';

/**
 * Base Repository with common CRUD operations
 */
export abstract class BaseRepository<T> {
  protected abstract tableName: string;

  /**
   * Fetch all records from the table
   */
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result = await Database.executeAsync(query);
    return result.rows?._array || [];
  }

  /**
   * Find a single record by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const result = await Database.executeAsync(query, [id]);
    return result.rows && result.rows.length > 0 ? result.rows[0] : null;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string | number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await Database.executeAsync(query, [id]);
  }

  /**
   * Clear the entire table
   */
  async deleteAll(): Promise<void> {
    const query = `DELETE FROM ${this.tableName}`;
    await Database.executeAsync(query);
  }

  /**
   * Count records in the table
   */
  async count(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const result = await Database.executeAsync(query);
    return result.rows?.[0]?.count || 0;
  }
}
