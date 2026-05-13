import {open, NitroSQLiteConnection} from 'react-native-nitro-sqlite';

/**
 * Database configuration
 */
const DB_CONFIG = {
  name: 'ascendly.db',
  location: 'default',
};

class DatabaseManager {
  private _db: NitroSQLiteConnection | null = null;

  /**
   * Opens the database connection if not already open
   */
  get db(): NitroSQLiteConnection {
    if (!this._db) {
      console.log('📦 Opening SQLite database:', DB_CONFIG.name);
      this._db = open({name: DB_CONFIG.name});
    }
    return this._db;
  }

  /**
   * Executes a SQL query asynchronously
   */
  async executeAsync(query: string, params: any[] = []): Promise<any> {
    try {
      const result = await this.db.executeAsync(query, params);
      return result;
    } catch (error) {
      console.error(`❌ SQLite Error executing query: ${query}`, error);
      throw error;
    }
  }

  /**
   * Executes a batch of SQL queries in a single transaction
   */
  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    try {
      return await this.db.transaction(callback);
    } catch (error) {
      console.error('❌ SQLite Transaction Error:', error);
      throw error;
    }
  }

  /**
   * Closes the database connection
   */
  close() {
    if (this._db) {
      this._db.close();
      this._db = null;
    }
  }
}

export const Database = new DatabaseManager();
export default Database;
