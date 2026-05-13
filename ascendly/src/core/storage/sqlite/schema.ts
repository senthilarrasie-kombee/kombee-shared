import {Database} from './Database';

/**
 * SQL statements for creating tables
 */
const TABLE_QUERIES = {
  HABITS: `
    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      categoryId TEXT,
      title TEXT NOT NULL,
      description TEXT,
      goal TEXT,
      priority TEXT,
      status TEXT,
      isOneTime INTEGER DEFAULT 0,
      isFavorite INTEGER DEFAULT 0,
      duration INTEGER,
      durationType TEXT,
      frequency TEXT,
      timeOfDay TEXT,
      targetPerWeek INTEGER,
      targetPerMonth INTEGER,
      scheduleDescription TEXT,
      createdDate TEXT,
      startDate TEXT,
      endDate TEXT,
      updatedAt TEXT,
      lastSyncedAt TEXT,
      isDirty INTEGER DEFAULT 0,
      deletedAt TEXT
    );
  `,
  HABIT_COMPLETIONS: `
    CREATE TABLE IF NOT EXISTS habit_completions (
      id TEXT PRIMARY KEY,
      habitId TEXT NOT NULL,
      userId TEXT NOT NULL,
      date TEXT NOT NULL,
      value REAL,
      note TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      lastSyncedAt TEXT,
      isDirty INTEGER DEFAULT 0,
      UNIQUE(habitId, date)
    );
  `,
  USER_PROFILE_CACHE: `
    CREATE TABLE IF NOT EXISTS user_profile_cache (
      uid TEXT PRIMARY KEY,
      email TEXT,
      displayName TEXT,
      firstName TEXT,
      lastName TEXT,
      photoURL TEXT,
      location TEXT,
      country TEXT,
      mobileNumber TEXT,
      countryCode TEXT,
      theme TEXT,
      isPremium INTEGER DEFAULT 0,
      provider TEXT,
      loginType TEXT,
      fcmToken TEXT,
      deviceDetails TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      lastSyncedAt TEXT
    );
  `,
  SYNC_QUEUE: `
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entityType TEXT NOT NULL,
      entityId TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT,
      status TEXT DEFAULT 'pending',
      retryCount INTEGER DEFAULT 0,
      errorMessage TEXT,
      createdAt TEXT,
      updatedAt TEXT,
      lastAttemptAt TEXT
    );
  `,
  FORM_DRAFTS: `
    CREATE TABLE IF NOT EXISTS form_drafts (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL,
      payload TEXT,
      updatedAt TEXT
    );
  `,
  APP_METADATA: `
    CREATE TABLE IF NOT EXISTS app_metadata (
      key TEXT PRIMARY KEY,
      value TEXT,
      updatedAt TEXT
    );
  `,
};

/**
 * Initializes the database schema
 */
export const initSchema = async (): Promise<void> => {
  console.log('🛠️ Initializing SQLite Schema...');
  
  try {
    await Database.transaction(async (tx) => {
      const execute = tx.executeAsync || tx.execute;
      if (!execute) throw new Error('SQLite transaction object has no execute method');

      // Create all tables
      await execute.call(tx, TABLE_QUERIES.HABITS);
      await execute.call(tx, TABLE_QUERIES.HABIT_COMPLETIONS);
      await execute.call(tx, TABLE_QUERIES.USER_PROFILE_CACHE);
      await execute.call(tx, TABLE_QUERIES.SYNC_QUEUE);
      await execute.call(tx, TABLE_QUERIES.FORM_DRAFTS);
      await execute.call(tx, TABLE_QUERIES.APP_METADATA);
      
      console.log('✅ SQLite Schema initialized successfully');
    });
  } catch (error) {
    console.error('❌ Failed to initialize SQLite Schema:', error);
    throw error;
  }
};

/**
 * Migration logic can be added here in the future
 */
export const runMigrations = async (): Promise<void> => {
  // Current version 1: Just ensure tables exist
  await initSchema();
};
