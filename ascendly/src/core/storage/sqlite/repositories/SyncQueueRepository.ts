import {Database} from '../Database';
import {BaseRepository} from './BaseRepository';

export interface SyncOperation {
  id?: number;
  entityType: 'habit' | 'completion' | 'profile';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  payload: string; // JSON stringified
  status: 'pending' | 'syncing' | 'failed' | 'synced';
  retryCount: number;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  lastAttemptAt?: string;
}

export class SyncQueueRepository extends BaseRepository<SyncOperation> {
  protected tableName = 'sync_queue';

  /**
   * Add a new operation to the queue
   */
  async enqueue(op: Omit<SyncOperation, 'id' | 'status' | 'retryCount' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const query = `
      INSERT INTO sync_queue (
        entityType, entityId, operation, payload, status, retryCount, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, 'pending', 0, ?, ?)
    `;

    const now = new Date().toISOString();
    const params = [
      op.entityType,
      op.entityId,
      op.operation,
      op.payload,
      now,
      now
    ];

    await Database.executeAsync(query, params);
  }

  /**
   * Fetch all pending operations in chronological order
   */
  async findPending(): Promise<SyncOperation[]> {
    const query = "SELECT * FROM sync_queue WHERE status IN ('pending', 'failed') ORDER BY createdAt ASC";
    const result = await Database.executeAsync(query);
    return result.rows?._array || [];
  }

  /**
   * Update operation status
   */
  async updateStatus(id: number, status: SyncOperation['status'], error?: string): Promise<void> {
    const now = new Date().toISOString();
    const query = `
      UPDATE sync_queue 
      SET status = ?, errorMessage = ?, updatedAt = ?, lastAttemptAt = ?, retryCount = retryCount + 1
      WHERE id = ?
    `;
    await Database.executeAsync(query, [status, error || null, now, now, id]);
  }
}

export const syncQueueRepo = new SyncQueueRepository();
