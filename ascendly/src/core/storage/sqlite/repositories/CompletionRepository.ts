import {Database} from '../Database';
import {BaseRepository} from './BaseRepository';
import {HabitCompletion} from '@shared/types/habit';

export interface SQLiteCompletion extends HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  isDirty?: boolean;
  updatedAt?: string;
  lastSyncedAt?: string;
}

export class CompletionRepository extends BaseRepository<SQLiteCompletion> {
  protected tableName = 'habit_completions';

  /**
   * Save a completion (Insert or Replace)
   */
  async save(userId: string, habitId: string, completion: HabitCompletion): Promise<void> {
    const id = `${habitId}_${completion.date}`;
    const query = `
      INSERT OR REPLACE INTO habit_completions (
        id, habitId, userId, date, value, note, createdAt, updatedAt, isDirty
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();
    const params = [
      id,
      habitId,
      userId,
      completion.date,
      completion.value || null,
      completion.note || null,
      now, // createdAt
      now, // updatedAt
      1    // isDirty
    ];

    await Database.executeAsync(query, params);
  }

  /**
   * Fetch completions for a specific habit
   */
  async findByHabitId(habitId: string): Promise<SQLiteCompletion[]> {
    const query = 'SELECT * FROM habit_completions WHERE habitId = ? ORDER BY date DESC';
    const result = await Database.executeAsync(query, [habitId]);
    return result.rows?._array || [];
  }

  /**
   * Fetch all dirty completions for sync
   */
  async findDirty(userId: string): Promise<SQLiteCompletion[]> {
    const query = 'SELECT * FROM habit_completions WHERE userId = ? AND isDirty = 1';
    const result = await Database.executeAsync(query, [userId]);
    return result.rows?._array || [];
  }

  /**
   * Mark a completion as synced
   */
  async markSynced(id: string, lastSyncedAt: string): Promise<void> {
    const query = 'UPDATE habit_completions SET isDirty = 0, lastSyncedAt = ? WHERE id = ?';
    await Database.executeAsync(query, [lastSyncedAt, id]);
  }
}

export const completionRepo = new CompletionRepository();
