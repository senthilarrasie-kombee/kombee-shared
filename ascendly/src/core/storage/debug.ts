import {storage as mmkv} from './mmkv';
import {asyncStorage} from './asyncStorage';
import {secureStorage} from './secureStorage';
import {habitRepo} from './sqlite/repositories/HabitRepository';
import {completionRepo} from './sqlite/repositories/CompletionRepository';
import {syncQueueRepo} from './sqlite/repositories/SyncQueueRepository';
import {Database} from './sqlite/Database';

/**
 * Comprehensive logger for all storage mechanisms
 */
export const logAllStorageData = async () => {
  console.log('============== 📦 STORAGE DEBUG LOG ==============');

  // 1. MMKV Logging
  const mmkvKeys = mmkv.getAllKeys();
  const mmkvData = mmkvKeys.reduce((acc: any, key) => {
    acc[key] = mmkv.getString(key) || mmkv.getNumber(key) || mmkv.getBoolean(key) || 'null';
    return acc;
  }, {});
  console.log('[MMKV] Data:', JSON.stringify(mmkvData, null, 2));

  // 2. SQLite Logging
  try {
    const habits = await habitRepo.findAll();
    const completions = await completionRepo.findAll();
    const queue = await syncQueueRepo.findAll();
    
    console.log('[SQLite] Habits Count:', habits.length);
    console.log('[SQLite] Completions Count:', completions.length);
    console.log('[SQLite] Sync Queue Count:', queue.length);
    
    if (habits.length > 0) {
      console.log('[SQLite] All Habits:', JSON.stringify(habits, null, 2));
    }
    if (completions.length > 0) {
      console.log('[SQLite] All Completions:', JSON.stringify(completions, null, 2));
    }
    if (queue.length > 0) {
      console.log('[SQLite] Full Sync Queue:', JSON.stringify(queue, null, 2));
    }
  } catch (e) {
    console.warn('[SQLite] Error logging data:', e);
  }

  // 3. AsyncStorage Logging
  try {
    await asyncStorage.logAllData();
  } catch (e) {
    console.warn('[AsyncStorage] Error logging data:', e);
  }

  // 4. Secure Storage (Keychain) Logging
  try {
    // We can't list all keys in Keychain easily, but we can check specific known keys
    const userId = await secureStorage.getItem('user_id');
    console.log('[Keychain] User ID:', userId ? '✅ STORED' : '❌ NOT FOUND');
  } catch (e) {
    console.warn('[Keychain] Error checking data:', e);
  }

  console.log('==================================================');
};
