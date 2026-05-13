import {Database} from '../Database';
import {BaseRepository} from './BaseRepository';
import {Habit} from '@shared/types/habit';

export class HabitRepository extends BaseRepository<Habit> {
  protected tableName = 'habits';

  /**
   * Saves a habit to SQLite (Insert or Replace)
   */
  async save(userId: string, habit: Habit): Promise<void> {
    const query = `
      INSERT OR REPLACE INTO habits (
        id, userId, categoryId, title, description, goal, priority, status,
        isOneTime, isFavorite, duration, durationType, frequency, timeOfDay,
        targetPerWeek, targetPerMonth, scheduleDescription, createdDate,
        startDate, endDate, updatedAt, lastSyncedAt, isDirty, deletedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      habit.id.toString(),
      userId,
      habit.categoryId,
      habit.title,
      habit.description,
      habit.goal,
      habit.priority,
      habit.status,
      habit.isOneTime ? 1 : 0,
      habit.isFavorite ? 1 : 0,
      habit.duration || null,
      habit.durationType,
      habit.frequency,
      habit.timeOfDay,
      habit.targetPerWeek || null,
      habit.targetPerMonth || null,
      habit.scheduleDescription || null,
      habit.createdDate,
      habit.startDate || null,
      habit.endDate || null,
      habit.updatedAt || null,
      habit.lastSyncedAt || null,
      habit.isDirty ? 1 : 0,
      null // deletedAt - handle separately if needed
    ];

    await Database.executeAsync(query, params);
  }

  /**
   * Fetch habits for a specific user
   */
  async findByUserId(userId: string): Promise<Habit[]> {
    const query = 'SELECT * FROM habits WHERE userId = ? AND deletedAt IS NULL';
    const result = await Database.executeAsync(query, [userId]);
    const rows = result.rows?._array || [];
    return rows.map((row: any) => this.mapRowToHabit(row));
  }

  /**
   * Fetch all dirty habits (not yet synced to Firestore)
   */
  async findDirty(userId: string): Promise<Habit[]> {
    const query = 'SELECT * FROM habits WHERE userId = ? AND isDirty = 1';
    const result = await Database.executeAsync(query, [userId]);
    const rows = result.rows?._array || [];
    return rows.map((row: any) => this.mapRowToHabit(row));
  }

  /**
   * Mark a habit as deleted (soft delete)
   */
  async softDelete(id: string | number): Promise<void> {
    const query = 'UPDATE habits SET deletedAt = ?, isDirty = 1 WHERE id = ?';
    await Database.executeAsync(query, [new Date().toISOString(), id.toString()]);
  }

  /**
   * Map database row to Habit object
   */
  private mapRowToHabit(row: any): Habit {
    return {
      ...row,
      isOneTime: !!row.isOneTime,
      isFavorite: !!row.isFavorite,
      isDirty: !!row.isDirty,
      // Handle completions separately or as JSON if needed
      // Currently completions are stored in a separate table for performance
      completions: [], 
    } as unknown as Habit;
  }
}

export const habitRepo = new HabitRepository();
