import {syncQueueRepo, SyncOperation} from './repositories/SyncQueueRepository';
import {habitRepo} from './repositories/HabitRepository';
import {completionRepo} from './repositories/CompletionRepository';
import * as firestore from '@core/firebase/firestore';

class SyncService {
  private isSyncing = false;

  /**
   * Starts the synchronization process
   */
  async processQueue(userId: string): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const pendingOps = await syncQueueRepo.findPending();
      console.log(`🔄 SyncService: Processing ${pendingOps.length} operations`);

      for (const op of pendingOps) {
        await this.processOperation(userId, op);
      }
    } catch (error) {
      console.error('❌ SyncService Error:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Processes a single operation from the queue
   */
  private async processOperation(userId: string, op: SyncOperation): Promise<void> {
    const payload = JSON.parse(op.payload);
    
    try {
      await syncQueueRepo.updateStatus(op.id!, 'syncing');

      switch (op.entityType) {
        case 'habit':
          await this.syncHabit(userId, op.operation, payload);
          break;
        case 'completion':
          // Handle completion sync if needed
          break;
        case 'profile':
          await firestore.updateUserProfile(userId, payload);
          break;
      }

      await syncQueueRepo.updateStatus(op.id!, 'synced');
      console.log(`✅ Synced ${op.entityType} ${op.operation}: ${op.entityId}`);
    } catch (error: any) {
      console.error(`❌ Sync failed for ${op.entityType} ${op.id}:`, error.message);
      await syncQueueRepo.updateStatus(op.id!, 'failed', error.message);
    }
  }

  /**
   * Helper to sync habit operations
   */
  private async syncHabit(userId: string, operation: SyncOperation['operation'], habit: any): Promise<void> {
    switch (operation) {
      case 'create':
        const created = await firestore.addHabit(userId, habit);
        // If Firestore generated a new ID, we should update our local record
        // but for now we assume IDs are consistent or handled by Firestore.addHabit
        break;
      case 'update':
        await firestore.updateHabit(userId, habit);
        break;
      case 'delete':
        await firestore.deleteHabit(userId, habit.id);
        break;
    }
    
    // Mark as clean in SQLite
    if (habit.id) {
      await habitRepo.save(userId, {...habit, isDirty: false, lastSyncedAt: new Date().toISOString()});
    }
  }
}

export const syncService = new SyncService();
export default SyncService;
